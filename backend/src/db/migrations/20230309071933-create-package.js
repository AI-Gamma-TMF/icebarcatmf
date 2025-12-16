'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('package', {
      package_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0
      },
      previous_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0
      },
      gc_coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      sc_coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'USD'
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_visible_in_store: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      show_package_type: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      package_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text_color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      background_color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      valid_till: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      schema: 'public'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('package', { schema: 'public' })
  }
}
