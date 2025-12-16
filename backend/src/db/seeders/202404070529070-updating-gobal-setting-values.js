'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize

    await sequelize.query(`
    INSERT INTO public.global_settings ("key", "value", "created_at", "updated_at") VALUES
    ('ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME', 30, NOW(), NOW()),
    ('ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME', 15, NOW(), NOW()),
    ('ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME', 10, NOW(), NOW()),
    ('ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME', 20, NOW(), NOW())`)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
