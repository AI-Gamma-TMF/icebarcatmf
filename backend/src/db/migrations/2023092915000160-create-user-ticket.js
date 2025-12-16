'use strict'

const { TICKET_TYPE, TICKET_STATUS } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('user_tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      player_action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      player_action_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      assign_to: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(Object.values(TICKET_STATUS)),
        allowNull: true
      },
      resolve: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      ticket_type: {
        type: DataTypes.ENUM(Object.values(TICKET_TYPE)),
        allowNull: true
      },
      assigned_on: {
        type: DataTypes.DATE,
        allowNull: true
      },
      more_details: {
        type: DataTypes.JSONB
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      resolved_in: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })

    await queryInterface.addIndex('user_tickets', ['status', 'ticket_type'], {
      name: 'user_tickets_status_ticket_type_index'
    })

    await queryInterface.addIndex('user_tickets', ['resolve'], {
      name: 'user_tickets_resolve_index'
    })

    await queryInterface.addIndex('user_tickets', ['assign_to'], {
      name: 'user_tickets_assign_to_index'
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_tickets')
  }
}
