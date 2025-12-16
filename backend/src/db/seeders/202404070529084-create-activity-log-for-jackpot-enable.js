'use strict'

const { default: db } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query('ALTER TYPE "public"."enum_user_activities_activity_type" ADD VALUE \'user-jackpot-enabled\'')
      const data = await queryInterface.sequelize.query(
        'SELECT user_id, MIN(created_at) AS first_entry_at FROM public.jackpot_entries GROUP BY user_id;',
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: sequelizeTransaction
        }
      )

      const bulkData = []
      for (const user of data) {
        bulkData.push({
          activityType: 'user-jackpot-enabled',
          userId: user.user_id,
          createdAt: user.first_entry_at,
          updatedAt: user.first_entry_at
        })
      }

      await db.UserActivities.bulkCreate(bulkData, {
        transaction: sequelizeTransaction
      })

      await sequelizeTransaction.commit()
    } catch (error) {
      await sequelizeTransaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
