const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Activity = db.Activity;
const Feedback = db.Feedback;


const isActivityActive = (activity) => {
    const now = new Date();
    const start = new Date(activity.startDate);

    const end = new Date(start.getTime() + activity.durationMinutes * 60000);

    return now >= start && now <= end;
};


router.post('/join', async (req, res) => {
    const { access_code } = req.body;

    if (!access_code) {
        return res.status(400).send('Codul de acces este necesar.');
    }

    try {

        const activity = await Activity.findOne({ where: { accessCode: access_code } });

        if (!activity) {
            return res.status(404).send('Cod invalid.');
        }


        if (!isActivityActive(activity)) {
            return res.status(403).send('Aceasta activitate nu este activa momentan.');
        }


        res.status(200).json({
            id: activity.id,
            description: activity.description,
            message: 'Te-ai alaturat activitatii cu succes.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare server.');
    }
});


router.post('/feedback', async (req, res) => {
    const { access_code, feedback_type } = req.body;


    const validTypes = ['smiley', 'frowny', 'surprised', 'confused'];

    if (!access_code || !validTypes.includes(feedback_type)) {
        return res.status(400).send('Date invalide.');
    }

    try {
        const activity = await Activity.findOne({ where: { accessCode: access_code } });

        if (!activity) {
            return res.status(404).send('Activitatea nu exista.');
        }


        if (!isActivityActive(activity)) {
            return res.status(403).send('Activitatea s-a incheiat.');
        }


        const feedback = await Feedback.create({
            activityId: activity.id,
            feedbackType: feedback_type
        });

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.emit(`new_feedback_${activity.id}`, feedback);
        }

        res.status(201).json({ message: 'Feedback inregistrat.' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la salvarea feedback-ului.');
    }
});

module.exports = router;