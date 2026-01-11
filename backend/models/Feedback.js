module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    feedbackType: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'Feedback',
    timestamps: true
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Activity, {
      foreignKey: 'activityId',
      as: 'activity'
    });
  };

  return Feedback;
};