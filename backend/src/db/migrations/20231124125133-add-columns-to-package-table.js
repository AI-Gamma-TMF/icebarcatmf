'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('package', 'vip_points', {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    })

    await queryInterface.addColumn('package', 'bonus_id', {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('package', 'vip_points')
    await queryInterface.removeColumn('package', 'bonus_id')
  }
}
