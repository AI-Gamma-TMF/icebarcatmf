'use strict'
import db from '../models'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await queryInterface.sequelize.transaction()
    try {
      const activityLogs = await queryInterface.sequelize.query(
        "SELECT * FROM public.activity_logs WHERE NOT ((more_details::jsonb) ? 'favorite')",
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: sequelizeTransaction
        }
      )

      for (const activityLog of activityLogs) {
        const moreDetails = typeof activityLog.more_details === 'string'
          ? JSON.parse(activityLog.more_details)
          : activityLog.more_details

        moreDetails.favorite = false

        await db.ActivityLog.update(
          { moreDetails: moreDetails },
          {
            where: { activityLogId: activityLog.activity_log_id },
            transaction: sequelizeTransaction
          }
        )
      }

      await sequelizeTransaction.commit()
    } catch (error) {
      console.error('Error while running the activity log seeder:', error)
      await sequelizeTransaction.rollback()
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally revert the favorite field
  }
}
