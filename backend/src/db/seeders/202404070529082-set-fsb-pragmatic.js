'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      await sequelize.query(`
        UPDATE master_casino_providers 
        SET free_spin_allowed = true
        WHERE name = 'PRAGMATIC'
      `, { transaction })

      await transaction.commit()
      console.log('updated FSB successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Not updated FSB successfully:', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      await sequelize.query(`
        UPDATE master_casino_providers 
        SET free_spin_allowed = false
        WHERE name = 'PRAGMATIC'
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
