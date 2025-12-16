'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()
    try {
      const data = await queryInterface.sequelize.query(
        `SELECT
          jackpots.jackpot_id,
          winning_ticket,
          jackpot_entries.user_id
        FROM
          jackpots
        JOIN jackpot_entries ON jackpot_entries.jackpot_entry_id = jackpots.winning_ticket
        WHERE deleted_At is NULl
        ORDER BY jackpots.jackpot_id ASC`,
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: sequelizeTransaction
        }
      )

      for (const jackpot of data) {
        await queryInterface.sequelize.query(
          'UPDATE jackpots SET user_id = :userId WHERE jackpot_id = :jackpotId;',
          {
            replacements: { userId: jackpot.user_id, jackpotId: jackpot.jackpot_id },
            transaction: sequelizeTransaction
          }
        )
      }

      await queryInterface.sequelize.query('UPDATE jackpots SET winning_ticket = ticket_sold WHERE status = 2', { transaction: sequelizeTransaction })

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
