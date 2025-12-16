'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'cms_pages',
        schema: 'public'
      }, 'cms_type',
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
      ),
      queryInterface.addColumn({
        tableName: 'cms_pages',
        schema: 'public'
      }, 'target_url',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'cms_pages', schema: 'public' },
        'cms_type', Sequelize.INTEGER),
      queryInterface.removeColumn({ tableName: 'cms_pages', schema: 'public' },
        'target_url', Sequelize.STRING)
    ])
  }
}
