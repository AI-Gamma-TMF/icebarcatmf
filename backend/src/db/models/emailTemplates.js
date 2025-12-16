'use strict'
// import { jobScheduler } from '../../utils/common'
const { EMAIL_TEMPLATE_PRIMARY_STATUS } = require('../../utils/constants/constant')

module.exports = function (sequelize, DataTypes) {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    emailTemplateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    templateEmailCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actionEmailType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'auto'
    },
    isPrimary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: EMAIL_TEMPLATE_PRIMARY_STATUS.DISABLE
    },
    dynamicData: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    templateCode: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isComplete: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'email_templates',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  EmailTemplate.addHook('afterCreate', async (transaction, options) => {
    if (transaction.dataValues.templateEmailCategoryId !== null) {
      // jobScheduler(transaction.dataValues.emailTemplateId)
    }
  })
  EmailTemplate.addHook('afterUpdate', async (transaction, options) => {
    // console.log('afterUpdate', transaction.dataValues.emailTemplateId)
  })
  return EmailTemplate
}
