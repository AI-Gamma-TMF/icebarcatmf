'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(
        "UPDATE user_bonus SET status = 'CLAIMED' WHERE bonus_type IN ('weekly-tier-bonus', 'monthly-tier-bonus') AND sc_amount = 0 AND gc_amount = 0",
        {
          type: Sequelize.QueryTypes.UPDATE,
          transaction: sequelizeTransaction
        }
      )
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
