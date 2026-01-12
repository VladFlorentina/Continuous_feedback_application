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

// Route pentru crearea unei activitati noi
// Aceasta ruta este protejata si necesita autentificare
// Returneaza detaliile activitatii create si codul QR in format base64
router.post('/', auth, async (req, res) => {
    // Extragem ID-ul profesorului din tokenul de autentificare
    const professorId = req.user.id;
    // Extragem datele din corpul cererii
    const { courseId, description, startDate, durationMinutes } = req.body;

    // Validam datele de intrare
    if (!description || !startDate || !durationMinutes) {
        return res.status(400).send('Date incomplete. Va rugam completati toate campurile.');
    }

    try {
        // Generam un cod unic de acces
        let accessCode = generateAccessCode();

        // -----------------------------------------------------
        // INTEGRARE SERVICIU EXTERN
        // -----------------------------------------------------
        // Cerinta: Backend-ul acceseaza date expuse de un serviciu extern.
        // Aici apelam api.qrserver.com pentru a obtine imaginea QR.
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${accessCode}`;
        
        let qrCodeBase64 = '';
        try {
            // Facem request catre serviciul extern folosind axios
            const response = await axios.get(qrApiUrl, { responseType: 'arraybuffer' });
            // Convertim raspunsul (imaginea) in string Base64 pentru a-l trimite la frontend
            const base64Image = Buffer.from(response.data, 'binary').toString('base64');
            qrCodeBase64 = `data:image/png;base64,${base64Image}`;
        } catch (apiError) {
            console.error('Eroare la serviciul extern QR:', apiError.message);
            // Fallback: trimitem doar URL-ul daca conversia esueaza (desi nu ar trebui)
            qrCodeBase64 = qrApiUrl;
        }

        // Salvam activitatea in baza de date folosind Sequelize (ORM)
        const newActivity = await Activity.create({
            professorId,
            courseId,
            description,
            startDate,
            durationMinutes,
            accessCode
        });

        // Trimitem raspunsul catre client (frontend)
        res.status(201).json({
            id: newActivity.id,
            description: newActivity.description,
            accessCode: newActivity.accessCode,
            qrCode: qrCodeBase64, // Imaginea gata de afisat
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