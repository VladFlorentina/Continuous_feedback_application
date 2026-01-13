const express = require('express');
const router = express.Router();

/**
 * @file student.js
 * @description rutele publice pentru interfata studentului (join & feedback)
 */
const db = require('../config/database');
const Activity = db.Activity;
const Feedback = db.Feedback;

// verifica daca o activitate este activa (in desfasurare)
const isActivityActive = (activity) => {
    const now = new Date();
    const start = new Date(activity.startDate);

    const end = new Date(start.getTime() + activity.durationMinutes * 60000);

    return now >= start && now <= end;
};

// studetul se alatura unei activitati folosind codul de acces
router.post('/join', async (req, res) => {
    // Extragem codul de acces din cerere (folosind camelCase)
    const { accessCode } = req.body;

    if (!accessCode) {
        return res.status(400).send('Codul de acces este necesar.');
    }

    try {
        // Cautam activitatea in baza de date dupa codul unic
        const activity = await Activity.findOne({ where: { accessCode: accessCode } });

        if (!activity) {
            return res.status(404).send('Cod invalid.');
        }

        // Verificam daca activitatea mai este valabila in timp
        if (!isActivityActive(activity)) {
            return res.status(403).send('Aceasta activitate nu este activa momentan.');
        }

        // Daca totul e ok, trimitem succes
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

// primeste feedback de la student si il trimite in timp real profesorului
router.post('/feedback', async (req, res) => {
    const { accessCode, feedbackType } = req.body;

    // Tipuri valide de feedback acceptate
    const validTypes = ['smiley', 'frowny', 'surprised', 'confused'];

    if (!accessCode || !validTypes.includes(feedbackType)) {
        return res.status(400).send('Date invalide.');
    }

    try {
        const activity = await Activity.findOne({ where: { accessCode: accessCode } });

        if (!activity) {
            return res.status(404).send('Activitatea nu exista.');
        }

        // Studentii pot da feedback doar in timpul activitatii
        if (!isActivityActive(activity)) {
            return res.status(403).send('Activitatea s-a incheiat.');
        }

        // Salvam feedback-ul in baza de date
        const feedback = await Feedback.create({
            activityId: activity.id,
            feedbackType: feedbackType
        });

        // Trimitem eveniment in timp real catre profesor (socket.io)
        const io = req.app.get('io');
        if (io) {
            // Profesorul asculta pe un canal specific ID-ului activitatii
            io.emit(`new_feedback_${activity.id}`, feedback);
        }

        res.status(201).json({ message: 'Feedback inregistrat.' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la salvarea feedback-ului.');
    }
});

module.exports = router;