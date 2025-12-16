'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('user_bonus', {
      user_bonus_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      bonus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'bonus',
            schema: 'public'
          },
          key: 'bonus_id'
        }
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
      bonus_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      free_spins_qty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      bonus_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      amount_to_wager: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      wagered_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      wagering_status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      claimed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date()
      },
      expire_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      issuer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      issuer_role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      games: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      cash_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      amount_converted: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      unique_id: {
        unique: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      bet_level: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      primary_currency_amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      cancelled_by: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sc: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      gc: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      schema: 'public'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('user_bonus', { schema: 'public' })
  }
}
