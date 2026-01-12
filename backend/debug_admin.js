console.log("1. Starting");
try {
    require('dotenv').config();
    console.log("2. Dotenv loaded. DB_USER:", process.env.DB_USER);
} catch (e) {
    console.error("2. Dotenv failed", e);
}

try {
    const bcrypt = require('bcryptjs');
    console.log("3. Bcrypt loaded");
} catch (e) {
    console.error("3. Bcrypt failed", e);
}

try {
    const { Sequelize } = require('sequelize');
    console.log("4. Sequelize loaded");

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false,
        }
    );
    console.log("5. Sequelize instantiated");

    sequelize.authenticate().then(() => {
        console.log("6. Connection successful");
        process.exit(0);
    }).catch(err => {
        console.error("6. Connection failed:", err);
        process.exit(1);
    });

} catch (e) {
    console.error("4/5. Sequelize failed", e);
}
