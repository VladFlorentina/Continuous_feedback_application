const express = require('express');
const router = express.Router();

/**
 * @file admin.js
 * @description Rutele protejate pentru panoul de administrare (statistici, useri)
 */
const db = require('../config/database');
const User = db.User;
const Activity = db.Activity;
const Feedback = db.Feedback;
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');


// Middleware pentru verificare rol de admin
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return next();
        }


        const user = await User.findByPk(req.user.id);
        if (user && user.role === 'admin') {

            req.user.role = 'admin';
            return next();
        }

        return res.status(403).send('Access denied.');
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).send('Server error checking permissions');
    }
};

// Returneaza statistici generale (nr. useri, activitati, feedback)
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const userCount = await User.count();
        const activityCount = await Activity.count();
        const feedbackCount = await Feedback.count();


        const now = new Date();
        const activities = await Activity.findAll();
        let activeCount = 0;
        activities.forEach(a => {
            const end = new Date(new Date(a.startDate).getTime() + a.durationMinutes * 60000);
            if (now >= new Date(a.startDate) && now <= end) {
                activeCount++;
            }
        });

        res.json({
            users: userCount,
            activities: activityCount,
            totalFeedback: feedbackCount,
            activeActivities: activeCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Returneaza lista tuturor utilizatorilor
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server Error');
    }
});


// Actualizeaza un utilizator (nume, email, rol)
router.put('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }


        if (user.id === req.user.id && role !== 'admin') {
            return res.status(400).json({ msg: 'Cannot demote yourself.' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.json(user);

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server Error');
    }
});


// sterge un utilizator
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.id === req.user.id) {
            return res.status(400).json({ msg: 'Cannot delete yourself.' });
        }

        await user.destroy();
        res.json({ msg: 'User removed' });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
