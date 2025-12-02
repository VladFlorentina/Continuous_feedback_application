module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accessCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    tableName: 'Activities',
    timestamps: true
  });

  Activity.associate = (models) => {
    Activity.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
    Activity.hasMany(models.Feedback, {
      foreignKey: 'activityId',
      as: 'feedback'
    });
    Activity.belongsTo(models.User, {
      foreignKey: 'professorId',
      as: 'professor'
    });
  };

  return Activity;
};