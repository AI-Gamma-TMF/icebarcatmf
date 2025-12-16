'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await Promise.all([
        queryInterface.sequelize.query("UPDATE casino_transactions SET amount = before_balance, sc = before_balance WHERE action_type = 'scDeduct'", { transaction }),
        queryInterface.sequelize.query("UPDATE users SET is_active = true WHERE user_id IN (SELECT DISTINCT(user_id) from casino_transactions where action_type = 'scDeduct')", { transaction }),
        queryInterface.sequelize.query("UPDATE activity_logs SET remark = 'SC coin deducted due to user in-activity for over 60 days.' WHERE jsonb_extract_path_text(more_details, 'reason') = 'Account closed due to 60 days inactivity' AND field_changed = 'isActive'", { transaction })
      ])
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.log('Error while running sc deduct seeder', error)
      throw error
    }
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
