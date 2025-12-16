'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addIndex('user_tickets', ['assign_to', 'resolve', 'status', 'created_at'], {
        name: 'idx_user_tickets_assign_to_resolve_status_created_at'
      })
      await queryInterface.addIndex('user_tickets', ['ticket_type', 'resolve', 'status', 'created_at'], {
        name: 'idx_user_tickets_resolve_status_ticket_type_created_at'
      })
      await queryInterface.addIndex('user_tickets', ['more_details', 'resolve', 'status', 'created_at'], {
        name: 'idx_user_tickets_resolve_status_more_details_created_at'
      })
    } catch (error) {
      console.log(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('user_tickets', 'idx_user_tickets_assign_to_resolve_status_created_at')
    await queryInterface.removeIndex('user_tickets', 'idx_user_tickets_resolve_status_ticket_type_created_at')
    await queryInterface.removeIndex('user_tickets', 'idx_user_tickets_resolve_status_more_details_created_at')
  }
}
