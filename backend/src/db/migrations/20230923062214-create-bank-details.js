'use strict'

const { BANK_ACCOUNT_TYPE } = require('../../utils/constants/constant')

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('bank_details', {
      bank_detail_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      routing_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      holder_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'user_id'
        }
      },
      type: {
        type: DataTypes.ENUM(Object.values(BANK_ACCOUNT_TYPE)),
        allowNull: false,
        comment: 'checking:0, savings:1'
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('bank_details', { schema: 'public' })
  }
}
