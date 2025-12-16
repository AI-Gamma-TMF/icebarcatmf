'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove columns
    await queryInterface.removeColumn('scratch_card_configuration', 'scratch_card_type')
    await queryInterface.removeColumn('scratch_card_configuration', 'is_allow')

    // Add new columns
    await queryInterface.addColumn('scratch_card_configuration', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.addColumn('scratch_card_configuration', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('scratch_card_configuration', 'message', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('scratch_card_configuration', 'scratch_card_type', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.addColumn('scratch_card_configuration', 'is_allow', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
    await queryInterface.removeColumn('scratch_card_configuration', 'deleted_at')
    await queryInterface.removeColumn('scratch_card_configuration', 'image_url')
    await queryInterface.removeColumn('scratch_card_configuration', 'message')
  }
}
