const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/User'); 
const CourseModel = require('../models/Course'); 
const ActivityModel = require('../models/Activity'); 
const FeedbackModel = require('../models/Feedback'); 


require('dotenv').config(); 

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