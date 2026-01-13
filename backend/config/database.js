/**
 * @file database.js
 * @description Configurarea conexiunii la baza de date PostgreSQL folosind Sequelize.
 */
const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/User');
const CourseModel = require('../models/Course');
const ActivityModel = require('../models/Activity');
const FeedbackModel = require('../models/Feedback');


require('dotenv').config();

// Initializare Sequelize cu parametrii de conexiune din variabilele de mediu
// Folosim valori default pentru fallback in caz ca nu sunt setate in .env (ex: Supabase connection string)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'MadalinaFlori88.',
  {
    host: process.env.DB_HOST || 'db.xkxpjnqartskkdozhfoc.supabase.co',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false, // Dezactivam logurile SQL in consola pentru curatenie
    dialectOptions: {
      // Configurare SSL necesara pentru conexiunea la Supabase (si majoritatea cloud providers)
      ssl: {
        require: true,
        rejectUnauthorized: false // Permitem certificate auto-semnate (comun pentru conexiuni externe)
      }
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize, DataTypes);
db.Course = CourseModel(sequelize, DataTypes);
db.Activity = ActivityModel(sequelize, DataTypes);
db.Feedback = FeedbackModel(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;