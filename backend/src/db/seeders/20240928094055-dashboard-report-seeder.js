'use strict'

const { QueryTypes } = require('sequelize')
const { sequelize, default: db } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelizeTransaction = await sequelize.transaction()

    try {
      const internalUsers = (await db.User.findAll({ where: { isInternalUser: true }, attributes: ['userId'] })).map(obj => { return obj.userId })
      const internalUsersList = internalUsers.length > 0 ? internalUsers.join(',') : '-1'
      const baseReport = await sequelize.query(
        `
        SELECT
          date(created_at) AS "Date",
          DATE_TRUNC('hour', created_at) + INTERVAL '1 minute' * (CASE WHEN EXTRACT(MINUTE FROM created_at) < 30 THEN 0 ELSE 30 END ) AS "timestamp",
          TRUNC(SUM(CASE WHEN action_type = 'bet' AND "CasinoTransaction"."user_id" NOT IN (${internalUsersList}) THEN COALESCE(amount, 0) END)::NUMERIC, 2) AS "totalRealBetSum",
          TRUNC(SUM(CASE WHEN action_type = 'win' AND "CasinoTransaction"."user_id" NOT IN (${internalUsersList}) THEN COALESCE(amount, 0) END)::NUMERIC, 2) AS "totalRealWinSum",
          TRUNC(SUM(CASE WHEN action_type = 'bet' AND "CasinoTransaction"."user_id" IN (${internalUsersList}) THEN COALESCE(amount, 0) END)::NUMERIC, 2) AS "totalTestBetSum",
          TRUNC(SUM(CASE WHEN action_type = 'win' AND "CasinoTransaction"."user_id" IN (${internalUsersList}) THEN COALESCE(amount, 0) END)::NUMERIC, 2) AS "totalTestWinSum"
        FROM
          "public"."casino_transactions" AS "CasinoTransaction"
        WHERE amount_type = 1
        GROUP BY
          "Date", "timestamp"
        ORDER BY
          "Date" ASC, "timestamp" ASC;
        `,
        {
          type: QueryTypes.SELECT,
          transaction: sequelizeTransaction
        }
      )

      const insertionData = []

      await Promise.all(baseReport.map(report => {
        insertionData.push({
          timestamp: report.timestamp,
          scRealStakedSum: +report.totalRealBetSum || 0,
          scRealWinSum: +report.totalRealWinSum || 0,
          scTestStakedSum: +report.totalTestBetSum || 0,
          scTestWinSum: +report.totalTestWinSum || 0
        })
        return true
      }))

      if (insertionData.length > 0) await db.DashboardReport.bulkCreate(insertionData, { transaction: sequelizeTransaction })
      await sequelizeTransaction.commit()
    } catch (error) {
      console.log(error)
      await sequelizeTransaction.rollback()
      throw Error('Error while seeding dashboard data')
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
