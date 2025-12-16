'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX IF NOT EXISTS casino_transactions_createdat_amounttype_actiontype_userid_amou ON public.casino_transactions (created_at, amount_type, action_type, user_id) INCLUDE (amount, sc, gc);')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS casino_transactions_createdat_amounttype_actiontype_userid_amou;')
  }
}
