const jwt = require('jsonwebtoken');

/**
 * @file auth.js
 * @description Middleware pentru protejarea rutelor private folosind JWT.
 */

/**
 * Middleware care verifica validitatea token-ului JWT din header.
 * Adauga utilizatorul decodat in req.user daca token-ul este valid.
 */
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).send('Acces respins. Nu exista token.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_default');

        // Daca tokenul are structura { user: { id: ... } }
        if (decoded.user) {
            req.user = decoded.user;
        } else {
            req.user = decoded;
        }

        next();
    } catch (ex) {
        res.status(400).send('Token invalid.');
    }
};

module.exports = auth;