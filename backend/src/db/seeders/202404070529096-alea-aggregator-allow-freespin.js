'use strict'

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(`
        UPDATE master_game_aggregators 
        SET free_spin_allowed = true
        WHERE name = 'alea'
      `, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('Failed to update free_spin_allowed to true for alea:', error)
      throw error
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(`
        UPDATE master_game_aggregators 
        SET free_spin_allowed = false
        WHERE name = 'alea'
      `, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('Failed to revert free_spin_allowed to false for alea:', error)
      throw error
    }
  }
}
