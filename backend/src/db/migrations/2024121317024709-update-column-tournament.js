'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tournament', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('tournament', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.changeColumn('tournament', 'winner_percentages', {
      type: Sequelize.ARRAY(Sequelize.FLOAT), // Use FLOAT to represent numbers
      allowNull: false,
      defaultValue: [100]
    })
    await queryInterface.removeColumn('tournament', 'is_active')
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('tournament', 'image_url')
    await queryInterface.removeColumn('tournament', 'order_id')
    await queryInterface.addColumn('tournament', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false
    })
    await queryInterface.changeColumn('tournament', 'winner_percentages', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
      defaultValue: [100]
    })
  }
}
