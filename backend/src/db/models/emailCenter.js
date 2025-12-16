'use strict'

module.exports = function (sequelize, DataTypes) {
  const EmailTemplates = sequelize.define(
    'EmailTemplates',
    {
      emailTemplateId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      templateName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subjectName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contentHtml: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      dynamicFields: {
        type: DataTypes.JSONB,
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
      templateType: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'email_templates',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  EmailTemplates.associate = function (model) {
  }

  return EmailTemplates
}
