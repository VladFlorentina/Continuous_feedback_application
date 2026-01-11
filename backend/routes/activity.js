const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/database');
const Activity = db.Activity;
const Feedback = db.Feedback;
const auth = require('../middleware/auth');

const generateAccessCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/', auth, async (req, res) => {
    const professorId = req.user.id;
    const { courseId, description, startDate, durationMinutes } = req.body;

    if (!description || !startDate || !durationMinutes) {
        return res.status(400).send('Date incomplete. Va rugam completati toate campurile.');
    }

    try {
        let accessCode = generateAccessCode();

        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${accessCode}`;

        const newActivity = await Activity.create({
            professorId,
            courseId,
            description,
            startDate,
            durationMinutes,
            accessCode
        });

        res.status(201).json({
            id: newActivity.id,
            description: newActivity.description,
            accessCode: newActivity.accessCode,
            qrCode: qrApiUrl,
            message: 'Activitate creata cu succes'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare server la salvarea activitatii.');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const activities = await Activity.findAll({
            where: { professorId: req.user.id },
            order: [['startDate', 'DESC']]
        });

        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la preluarea listei de activitati.');
    }
});

router.get('/:id', auth, async (req, res) => {
    const activityId = req.params.id;

    try {
        const activity = await Activity.findOne({
            where: {
                id: activityId,
                professorId: req.user.id
            },
            include: [{
                model: Feedback,
                as: 'feedback',
                attributes: ['feedbackType', 'createdAt']
            }]
        });

        if (!activity) {
            return res.status(404).send('Activitatea nu a fost gasita sau nu aveti acces.');
        }

        res.json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la preluarea detaliilor activitatii.');
    }
});

module.exports = router;