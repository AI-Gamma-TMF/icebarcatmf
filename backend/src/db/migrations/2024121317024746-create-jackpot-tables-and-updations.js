'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('jackpots', {
        jackpot_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        jackpot_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        max_ticket_size: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        seed_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        jackpot_pool_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        jackpot_pool_earning: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        entry_amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        admin_share: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        pool_share: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        winning_ticket: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        game_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()')
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()')
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true
        }
      }, {
        transaction
      })

      await queryInterface.addColumn('users', 'is_jackpot_terms_accepted', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction })

      await queryInterface.addColumn('users', 'is_jackpot_opted_in', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction })

      await queryInterface.createTable('jackpot_entries', {
        jackpot_entry_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        jackpot_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        amount: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()')
        }
      }, {
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error(error)
    }
  },

  down: async (queryInterface, Sequelize) => {}
}
