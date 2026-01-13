const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const User = db.User;
const auth = require('../middleware/auth');
require('dotenv').config();

// functie auxiliara pentru validarea formatului de email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// ruta de inregistrare
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // -----------------------------------------------------
    // VALIDARE DATE INTRARE
    // -----------------------------------------------------

    // Verificam daca campurile sunt completate
    if (!name || !email || !password) {
        return res.status(400).json({
            errors: [{ msg: 'Toate campurile sunt obligatorii (nume, email, parola).' }]
        });
    }

    // Verificam lungimea parolei (minim 6 caractere)
    if (password.length < 6) {
        return res.status(400).json({
            errors: [{ msg: 'Parola trebuie sa aiba cel putin 6 caractere.' }]
        });
    }

    // Verificam formatul email-ului
    if (!validateEmail(email)) {
        return res.status(400).json({
            errors: [{ msg: 'Adresa de email nu este valida.' }]
        });
    }

    try {
        // Verificam daca utilizatorul exista deja
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'Utilizatorul exista deja.' }] });
        }

        // Criptam parola inainte de salvare
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Cream utilizatorul nou
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'professor'
        });

        // Generam token JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_default',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, name: user.name, id: user.id });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la server');
    }
});

// ruta de autentificare (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validare simpla la login
    if (!email || !password) {
        return res.status(400).send('Email-ul si parola sunt necesare.');
    }

    try {
        // Cautam utilizatorul dupa email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json('Email sau parola incorecta.');
        }

        // Verificam parola
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json('Email sau parola incorecta.');
        }

        // Returnam token daca totul e ok
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_default',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, name: user.name, id: user.id });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare server');
    }
});

// ruta pentru actualizarea profilului
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