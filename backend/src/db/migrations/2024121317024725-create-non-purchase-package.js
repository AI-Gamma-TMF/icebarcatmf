'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('non_purchase_packages', {
      non_purchase_package_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      package_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'package',
          key: 'package_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      interval_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      discounted_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      user_ids: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
        defaultValue: []
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      bonus_percentage: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sc_coin: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gc_coin: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sc_bonus: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      gc_bonus: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('non_purchase_packages')
  }
}
