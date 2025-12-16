'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('template_category', [
          {
              name: JSON.stringify({ EN: 'Upcoming Event Notification' }),
              is_active: true,
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: JSON.stringify({ EN: 'Promotional Notification' }),
              is_active: true,
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: JSON.stringify({ EN: 'Site Maintenance Notification' }),
              is_active: true,
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: JSON.stringify({ EN: 'Active User Notification' }),
              is_active: true,
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: JSON.stringify({ EN: 'Inactive User Notification' }),
              is_active: true,
              created_at: new Date(),
              updated_at: new Date()
          }
      ])
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('template_category', null, {})
  }
};
