try {
    console.log("Loading sequelize...");
    const { Sequelize } = require('sequelize');
    console.log("Sequelize loaded.");
} catch (e) {
    console.error("Failed to load sequelize:", e);
}
