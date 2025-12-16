'use strict'
const { BONUS_TYPE, BONUS_STATUS } = require('../../utils/constants/constant')
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable(
      'personal_bonus',
      {
        bonus_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        bonus_code: {
          type: DataTypes.STRING,
          allowNull: false
        },
        amount: {
          type: DataTypes.DOUBLE(10, 2),
          defaultValue: 0.0
        },
        coin_type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        claimed_by: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: BONUS_STATUS.PENDING
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        claimed_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        schema: 'public'
      }
    )
  },

  async down (queryInterface) {
    await queryInterface.dropTable('personal_bonus', { schema: 'public' })
  }
}
