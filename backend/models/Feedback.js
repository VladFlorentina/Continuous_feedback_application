module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    feedbackType: { // smiley, frowny, confused, surprised
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