'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      await sequelize.query(`
        UPDATE master_game_aggregators 
        SET free_spin_allowed = true
        WHERE name  IN ('pragmatic', 'mancala' )
      `, { transaction })

      await transaction.commit()
      console.log('updated FreeSpin allow Aggregator successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Not updated FreeSpin allow Aggregator successfully:', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      await sequelize.query(`
        UPDATE master_game_aggregators 
        SET free_spin_allowed = false
        WHERE name  IN ('pragmatic', 'mancala' )
      `, { transaction })

      await transaction.commit()
      console.log('reverted FreeSpin allow Aggregator successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Error reverting FreeSpin allow Aggregator:', error)
      throw error
    }
  }
}
