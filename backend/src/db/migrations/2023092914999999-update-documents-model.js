'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn({
        tableName: 'user_documents',
        schema: 'public'
      }, 'signature',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({ tableName: 'user_documents', schema: 'public' },
        'signature', Sequelize.STRING)
    ])
  }
}
