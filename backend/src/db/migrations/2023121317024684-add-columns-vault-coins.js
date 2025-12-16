
'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('wallets', 'vault_gc_coin', {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    })
    await queryInterface.addColumn('wallets', 'vault_sc_coin', {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: { psc: 0, bsc: 0, wsc: 0 }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('wallets', 'vault_gc_coin')
    await queryInterface.removeColumn('wallets', 'vault_sc_coin')
  }
}
