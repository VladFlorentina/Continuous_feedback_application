const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Activity = db.Activity;
const Feedback = db.Feedback; 
const auth = require('../middleware/auth'); 

/**
 * Functie auxiliara pentru generarea unui cod unic de acces.
 * Returneaza un string de 6 cifre.
 */
const generateAccessCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * POST /api/activities
 * Descriere: Permite unui profesor autentificat sa creeze o noua activitate.
 * Authorization: Token JWT necesar (middleware 'auth').
 */
router.post('/', auth, async (req, res) => { 
    // Extragem ID-ul profesorului din token
    const professorId = req.user.id; 
    const { courseId, description, startDate, durationMinutes } = req.body;

    // Validare date de intrare
    if (!description || !startDate || !durationMinutes) {
        return res.status(400).send('Date incomplete. Va rugam completati toate campurile.');
    }

    try {
        // Generam cod unic si salvam activitatea
        let accessCode = generateAccessCode();
        const newActivity = await Activity.create({
            professorId, 
            courseId, 
            description, 
            startDate, 
            durationMinutes, 
            accessCode
        });

        // Returnam obiectul creat
        res.status(201).json({
            id: newActivity.id,
            description: newActivity.description,
            accessCode: newActivity.accessCode, 
            message: 'Activitate creata cu succes'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare server la salvarea activitatii.');
    }
});

/**
 * GET /api/activities
 * Descriere: Returneaza lista tuturor activitatilor create de profesorul curent.
 * Authorization: Token JWT necesar.
 */
router.get('/', auth, async (req, res) => {
    try {
        // Cautam doar activitatile unde professorId este cel al utilizatorului logat
        const activities = await Activity.findAll({
            where: { professorId: req.user.id },
            order: [['startDate', 'DESC']] // Ordonare descrescatoare dupa data
        });

        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la preluarea listei de activitati.');
    }
});

/**
 * GET /api/activities/:id
 * Descriere: Returneaza detaliile unei activitati specifice si feedback-ul asociat.
 * Authorization: Token JWT necesar.
 */
router.get('/:id', auth, async (req, res) => {
    const activityId = req.params.id;

    try {
        // Cautam activitatea si includem (JOIN) tabelul de Feedback
        const activity = await Activity.findOne({
            where: { 
                id: activityId,
                professorId: req.user.id // Securitate: doar proprietarul vede datele
            },
            include: [{
                model: Feedback,
                as: 'feedback', // Alias definit in model
                attributes: ['feedbackType', 'createdAt'] // Selectam doar campurile relevante
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