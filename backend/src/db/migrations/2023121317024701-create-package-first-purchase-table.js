'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable(
      'package_first_purchase_bonuses',
      {
        package_first_purchase_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        package_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        first_purchase_sc_bonus: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        first_purchase_gc_bonus: {
          type: DataTypes.DOUBLE(10, 2),
          allowNull: true,
          defaultValue: 0.0
        },
        more_details: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date()
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date()
        },
        order_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: null
        }
      },
      { schema: 'public' }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('package_first_purchase_bonuses', { schema: 'public' })
  }
}
