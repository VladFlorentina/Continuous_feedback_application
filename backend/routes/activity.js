const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Activity = db.Activity;
const auth = require('../middleware/auth'); 

const generateAccessCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/activities - Ruta protejata
router.post('/', auth, async (req, res) => { 
    const professorId = req.user.id; 
    const { courseId, description, startDate, durationMinutes } = req.body;

    if (!description || !startDate || !durationMinutes) {
        return res.status(400).send('Date incomplete');
    }

    try {
        let accessCode = generateAccessCode();

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
            message: 'Activitate creata cu succes'
        });

    } catch (error) {
        res.status(500).send('Eroare server la salvarea activitatii');
    }
});

module.exports = router;