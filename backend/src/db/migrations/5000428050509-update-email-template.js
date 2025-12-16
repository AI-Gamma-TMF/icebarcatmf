'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'template_email_category_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: {
            tableName: 'template_category',
            schema: 'public'
          },
          key: 'template_category_id'
        }
      }
      ),
      queryInterface.addColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'action_email_type',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'auto'
      }
      ),
      queryInterface.changeColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'type',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'scheduled_at',
      {
        type: Sequelize.DATE,
        allowNull: true
      }),
      queryInterface.addColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'is_complete',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'template_email_category_id', Sequelize.INTEGER),
      queryInterface.removeColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'action_email_type', Sequelize.STRING),
      queryInterface.changeColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'type',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
      ),
      queryInterface.removeColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'scheduled_at', Sequelize.DATE),
      queryInterface.removeColumn({
        tableName: 'email_templates',
        schema: 'public'
      }, 'is_complete', Sequelize.INTEGER)
    ])
  }
}
