'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.dropTable('redeem_rule', { schema: 'public' })
    await queryInterface.createTable('redeem_rule', {
      rule_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      rule_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rule_condition: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      completion_time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('redeem_rule', { schema: 'public' })
  }
}
