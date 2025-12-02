const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Activity = db.Activity;
const Feedback = db.Feedback;

/**
 * Functie auxiliara pentru a verifica daca o activitate este in desfasurare.
 * Compara momentul curent cu intervalul (start, start + durata).
 */
const isActivityActive = (activity) => {
    const now = new Date();
    const start = new Date(activity.startDate);
    // Calculam timpul de final (adaugam minutele convertite in milisecunde)
    const end = new Date(start.getTime() + activity.durationMinutes * 60000);
    
    return now >= start && now <= end;
};

/**
 * POST /api/join
 * Descriere: Permite unui student (anonim) sa verifice un cod de acces.
 * Acces: Public
 */
router.post('/join', async (req, res) => {
    const { access_code } = req.body;

    if (!access_code) {
        return res.status(400).send('Codul de acces este necesar.');
    }

    try {
        // Cautam activitatea dupa cod
        const activity = await Activity.findOne({ where: { accessCode: access_code } });

        if (!activity) {
            return res.status(404).send('Cod invalid.');
        }

        // Verificam validitatea temporala
        if (!isActivityActive(activity)) {
            return res.status(403).send('Aceasta activitate nu este activa momentan.');
        }

        // Returnam datele de baza pentru interfata studentului
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

/**
 * POST /api/feedback
 * Descriere: Permite unui student sa trimita o reactie (emoticon).
 * Acces: Public
 */
router.post('/feedback', async (req, res) => {
    const { access_code, feedback_type } = req.body;

    // Lista tipurilor valide de feedback
    const validTypes = ['smiley', 'frowny', 'surprised', 'confused'];

    if (!access_code || !validTypes.includes(feedback_type)) {
        return res.status(400).send('Date invalide.');
    }

    try {
        const activity = await Activity.findOne({ where: { accessCode: access_code } });

        if (!activity) {
            return res.status(404).send('Activitatea nu exista.');
        }

        // Feedback-ul se accepta doar in timpul activitatii
        if (!isActivityActive(activity)) {
            return res.status(403).send('Activitatea s-a incheiat.');
        }

        // Salvam reactia in baza de date (cu timestamp automat)
        await Feedback.create({
            activityId: activity.id,
            feedbackType: feedback_type
        });

        res.status(201).json({ message: 'Feedback inregistrat.' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la salvarea feedback-ului.');
    }
});

module.exports = router;