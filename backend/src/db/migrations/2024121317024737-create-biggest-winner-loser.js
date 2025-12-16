'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('biggest_winners_losers', {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      game_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      game_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      total_win_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      total_bet_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      total_rollback_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      net_amount: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      more_details: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      amount_type: {
        // 0 = gc, 1 = sc, 2 - gc + sc
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('biggest_winners_losers')
  }
}
