'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn(
        {
          tableName: 'promotion_codes',
          schema: 'public'
        },
        'max_uses',
        {
          type: Sequelize.BIGINT,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        {
          tableName: 'promotion_codes',
          schema: 'public'
        },
        'use_count',
        {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    // To be written later
  }
}
