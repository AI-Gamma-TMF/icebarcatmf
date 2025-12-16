'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(`
       UPDATE master_casino_providers
        SET free_spin_allowed = true
        FROM master_game_aggregators
        WHERE master_casino_providers.master_game_aggregator_id = master_game_aggregators.master_game_aggregator_id
          AND master_game_aggregators.name = 'alea'
      `, { transaction })

      await transaction.commit()
      console.log('updated FSB successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Failed to update free_spin_allowed to true for alea:', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(`
       UPDATE master_casino_providers
        SET free_spin_allowed = false
        FROM master_game_aggregators
        WHERE master_casino_providers.master_game_aggregator_id = master_game_aggregators.master_game_aggregator_id
          AND master_game_aggregators.name = 'alea'
      `, { transaction })

      await transaction.commit()
      console.log('reverted FSB successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Error reverting FSB:', error)
      throw error
    }
  }
}
