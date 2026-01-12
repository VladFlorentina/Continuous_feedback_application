const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/User');
const CourseModel = require('../models/Course');
const ActivityModel = require('../models/Activity');
const FeedbackModel = require('../models/Feedback');


require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'MadalinaFlori88.',
  {
    host: process.env.DB_HOST || 'db.xkxpjnqartskkdozhfoc.supabase.co',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
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