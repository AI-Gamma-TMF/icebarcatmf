'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserQuestionnaireAnswer = sequelize.define(
    'UserQuestionnaireAnswer',
    {
      userQuestionnaireAnswerId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      answer: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'user_questionnaire_answer',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  UserQuestionnaireAnswer.associate = function (model) {
    UserQuestionnaireAnswer.belongsTo(model.User, { foreignKey: 'userId' })
    UserQuestionnaireAnswer.belongsTo(model.Questionnaire, { foreignKey: 'questionnaireId' })
  }

  return UserQuestionnaireAnswer
}
