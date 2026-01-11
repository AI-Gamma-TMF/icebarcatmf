'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const tableName = { tableName: 'email_templates', schema: 'public' }
      const tableInfo = await queryInterface.describeTable(tableName.tableName, { transaction })

      // Add missing columns only if they are not already present
      if (!tableInfo.template_email_category_id) {
        await queryInterface.addColumn(
          tableName,
          'template_email_category_id',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: { tableName: 'template_category', schema: 'public' },
              key: 'template_category_id'
            }
          },
          { transaction }
        )
      }

      if (!tableInfo.action_email_type) {
        await queryInterface.addColumn(
          tableName,
          'action_email_type',
          {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'auto'
          },
          { transaction }
        )
      }

      // The previous deploy failed because the column "type" was missing.
      // If it's absent, create it as INTEGER; otherwise just change the type.
      if (!tableInfo.type) {
        await queryInterface.addColumn(
          tableName,
          'type',
          {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          { transaction }
        )
      } else {
        await queryInterface.changeColumn(
          tableName,
          'type',
          {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          { transaction }
        )
      }

      if (!tableInfo.scheduled_at) {
        await queryInterface.addColumn(
          tableName,
          'scheduled_at',
          {
            type: Sequelize.DATE,
            allowNull: true
          },
          { transaction }
        )
      }

      if (!tableInfo.is_complete) {
        await queryInterface.addColumn(
          tableName,
          'is_complete',
          {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          { transaction }
        )
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const tableName = { tableName: 'email_templates', schema: 'public' }
      const tableInfo = await queryInterface.describeTable(tableName.tableName, { transaction })

      if (tableInfo.template_email_category_id) {
        await queryInterface.removeColumn(tableName, 'template_email_category_id', { transaction })
      }

      if (tableInfo.action_email_type) {
        await queryInterface.removeColumn(tableName, 'action_email_type', { transaction })
      }

      if (tableInfo.type) {
        await queryInterface.changeColumn(
          tableName,
          'type',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false
          },
          { transaction }
        )
      }

      if (tableInfo.scheduled_at) {
        await queryInterface.removeColumn(tableName, 'scheduled_at', { transaction })
      }

      if (tableInfo.is_complete) {
        await queryInterface.removeColumn(tableName, 'is_complete', { transaction })
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
