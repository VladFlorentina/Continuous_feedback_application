/**
 * @file User.js
 * @description Modelul pentru utilizatori (Profesori/Admini).
 */
module.exports = (sequelize, DataTypes) => {
  // Definirea modelului User
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

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: 'userId',
      as: 'courses'
    });
    User.hasMany(models.Activity, {
      foreignKey: 'professorId',
      as: 'activities'
    });
  };

  return User;
};