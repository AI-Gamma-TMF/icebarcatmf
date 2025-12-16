'use strict'
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('raffles', {
      raffle_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sub_heading: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      wager_base_amt: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false
      },
      wager_base_amt_type: {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue: 'SC'
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      game_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      prize_amount_gc: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      prize_amount_sc: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      winner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
      },
      won_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      more_details: {
        type: DataTypes.JSONB,
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
      terms_and_conditions: {
        type: DataTypes.TEXT,
        allowNull: true,  
      }
    },
    {
        schema: 'public'
      })
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('raffles')
  }
}
