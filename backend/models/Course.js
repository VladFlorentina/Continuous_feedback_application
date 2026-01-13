/**
 * @file Course.js
 * @description Modelul pentru cursuri.
 */
module.exports = (sequelize, DataTypes) => {
  // Definirea modelului Course
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'Courses',
    timestamps: true
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'professor'
    });
    Course.hasMany(models.Activity, {
      foreignKey: 'courseId',
      as: 'activities'
    });
  };

  return Course;
};