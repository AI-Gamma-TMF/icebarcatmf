'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('master_casino_providers', 'free_spin_allowed', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })

    await queryInterface.addColumn('email_templates', 'template_type', {
      type: Sequelize.STRING,
      allowNull: true
    })

    await queryInterface.addColumn('user_bonus', 'free_spin_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('master_casino_providers', 'free_spin_allowed')
    await queryInterface.removeColumn('email_templates', 'template_type')
    await queryInterface.removeColumn('user_bonus', 'free_spin_id')
  }
}
