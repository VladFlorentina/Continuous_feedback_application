const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const User = db.User;


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email si parola sunt necesare');

    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(409).send('Utilizatorul exista deja');

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token: token, id: user.id, email: user.email, name: user.name });

    } catch (error) {
        res.status(500).send('Eroare server');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Email si parola sunt necesare');

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).send('Credetiale invalide');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send('Credetiale invalide');

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token: token, id: user.id, email: user.email, name: user.name });

    } catch (error) {
        res.status(500).send('Eroare server');
    }
});

module.exports = router;