'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('package', 'valid_from', {
      type: Sequelize.DATE,
      allowNull: true
    }),
    await queryInterface.addColumn('package', 'bonus_sc', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    }),
    await queryInterface.addColumn('package', 'bonus_gc', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    }),
    await queryInterface.addColumn('package', 'player_id', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'valid_from'),
    await queryInterface.removeColumn('package', 'bonus_sc'),
    await queryInterface.removeColumn('package', 'bonus_gc'),
    await queryInterface.removeColumn('package', 'player_id')
  }
}
