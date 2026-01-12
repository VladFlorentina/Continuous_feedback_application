const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configurare directă
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);

// Model User simplificat
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'professor'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'Users',
    timestamps: true
});

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const email = 'colega@test.com';
        const password = 'adminpassword';
        const name = 'Admin Colega';

        let user = await User.findOne({ where: { email } });
        if (user) {
            console.log('User exists. Updating role...');
            user.role = 'admin';
            await user.save();
            console.log('Admin role updated.');
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
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

createAdmin();
