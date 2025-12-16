'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({
      tableName: 'wallets',
      schema: 'public'
    }, 'gc_bonus_coin',
    {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    }
    )
    await queryInterface.addColumn({
      tableName: 'wallets',
      schema: 'public'
    }, 'sc_bonus_coin',
    {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'wallets',
      schema: 'public'
    }, 'sc_bonus_coin', Sequelize.DOUBLE)
    await queryInterface.removeColumn({
      tableName: 'wallets',
      schema: 'public'
    }, 'gc_bonus_coin', Sequelize.DOUBLE)
  }
}
