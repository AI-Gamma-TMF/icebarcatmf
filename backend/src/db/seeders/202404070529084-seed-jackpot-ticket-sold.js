'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()
    try {
      const data = await queryInterface.sequelize.query(
        'SELECT jackpot_id, count(*) FROM jackpot_entries GROUP BY jackpot_id order by jackpot_id ASC;',
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: sequelizeTransaction
        }
      )

      for (const jackpot of data) {
        await queryInterface.sequelize.query(
          'UPDATE jackpots SET ticket_sold = :ticketsSold WHERE jackpot_id = :jackpotId;',
          {
            replacements: { ticketsSold: jackpot.count, jackpotId: jackpot.jackpot_id },
            transaction: sequelizeTransaction
          }
        )
      }

      await sequelizeTransaction.commit()
    } catch (error) {
      await sequelizeTransaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
