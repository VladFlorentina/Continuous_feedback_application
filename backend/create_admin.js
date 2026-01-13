/**
 * script pentru crearea unui utilizator admin initial
 */
const bcrypt = require('bcryptjs');
const db = require('./config/database');
const User = db.User;
require('dotenv').config();

async function createAdmin() {
    try {
        await db.sequelize.authenticate();
        console.log('Connected to DB.');

        const email = 'admin@test.com';
        const password = 'adminpassword';

        let user = await User.findOne({ where: { email } });
        if (user) {
            console.log('Admin already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`Admin created successfully.\nEmail: ${email}\nPassword: ${password}`);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        process.exit();
    }
}

createAdmin();
