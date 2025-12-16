'use strict'

module.exports = function (sequelize, DataTypes) {
  const Questionnaire = sequelize.define(
    'Questionnaire',
    {
      questionnaireId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      questionType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      frontendQuestionType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      orderId: {
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
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: 'questionnaire',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )
  Questionnaire.associate = function (model) {
    Questionnaire.hasMany(model.UserQuestionnaireAnswer, { foreignKey: 'questionnaireId' })
  }

  return Questionnaire
}
