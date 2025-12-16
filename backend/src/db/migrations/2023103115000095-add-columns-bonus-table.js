'use strict'

const { BONUS_TYPE } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('bonus', 'minimum_purchase_amount', {
      type: DataTypes.BIGINT,
      allowNull: true
    })

    await queryInterface.addColumn('bonus', 'percentage', {
      type: DataTypes.INTEGER,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bonus', 'minimum_purchase_amount')
    await queryInterface.removeColumn('bonus', 'percentage')
  }
}
