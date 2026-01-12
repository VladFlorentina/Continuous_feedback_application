const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const User = db.User;
const auth = require('../middleware/auth');


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
        if (!user) return res.status(401).send('Credentiale invalide');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send('Credentiale invalide');

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token: token, id: user.id, email: user.email, name: user.name, role: user.role });

    } catch (error) {
        res.status(500).send('Eroare server');
    }
});

router.put('/profile', auth, async (req, res) => {
    const { name, password, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Utilizator negasit' });

        if (newPassword) {
            if (!password) {
                return res.status(400).json({ msg: 'Parola curenta este necesara pentru a seta una noua' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Parola curenta incorecta' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (name) user.name = name;

        await user.save();
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            msg: 'Profil actualizat cu succes'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare Server');
    }
});

module.exports = router;