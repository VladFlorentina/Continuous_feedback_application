const bcrypt = require('bcryptjs');
const db = require('./config/database');
const User = db.User;
require('dotenv').config();

// Script pentru a crea un cont de admin secundar (exemplu pentru colega ta)
async function createColleagueAdmin() {
    try {
        await db.sequelize.authenticate();
        console.log('Connected to DB.');

        // TODO: Modifica aici cu datele reale
        const email = 'colega@admin.com';
        const password = 'passcolegaadmin';
        const name = 'Admin Colega';

        let user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`User ${email} already exists. Updating role to admin...`);
            user.role = 'admin';
            await user.save();
            console.log('Role updated successfully.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`Admin ${name} created successfully.`);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        process.exit();
    }
}

createColleagueAdmin();
