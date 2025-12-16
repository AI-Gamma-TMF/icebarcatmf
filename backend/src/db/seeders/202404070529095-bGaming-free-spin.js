'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize
    const transaction = await sequelize.transaction()

    try {
      await Promise.all([
        sequelize.query("UPDATE master_casino_providers SET free_spin_allowed = true WHERE name = 'BGAMING-DIRECT'", { transaction }),
        sequelize.query("UPDATE master_game_aggregators SET free_spin_allowed = true WHERE name = 'bgaming'", { transaction })
      ]
      )

      await transaction.commit()
      console.log('updated FSB successfully!')
    } catch (error) {
      await transaction.rollback()
      console.error('Not updated FSB successfully:', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {}
}
