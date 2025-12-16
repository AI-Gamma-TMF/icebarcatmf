'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable(
      'hall_of_fame_record',
      {
        casino_transaction_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        game_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        amount: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0
        },
        amount_type: {
          // 0 = gc, 1 = sc, 2 - gc + sc
          type: DataTypes.INTEGER,
          allowNull: true
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
        }
      },
      { schema: 'public' }
    )
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('hall_of_fame_record', { schema: 'public' })
  }
}
