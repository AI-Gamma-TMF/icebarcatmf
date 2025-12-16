'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('create unique index user_bonus_bonus_id_user_id_is_active_uindex on user_bonus (bonus_id, user_id, is_active) where is_active')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('drop index user_bonus_bonus_id_user_id_is_active_uindex;')
  }
}
