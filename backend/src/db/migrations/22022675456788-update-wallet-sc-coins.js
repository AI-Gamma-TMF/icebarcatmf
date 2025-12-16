'use strict'

const { userWalletUpdate } = require('../../utils/common')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('wallets', 'sc_coin',
        {
          type: `${Sequelize.JSONB} using to_jsonb(sc_coin)`,
          allowNull: false
        }
      ),
      await userWalletUpdate(),
      await queryInterface.bulkInsert('global_settings', [
        {
          key: 'MINIMUM_REDEEMABLE_COINS',
          value: '50',
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn({
        tableName: 'wallets',
        schema: 'public'
      }, 'sc_coin', Sequelize.JSONB)
    ])
  }
}
