'use strict'

import { AMOUNT_TYPE, TRANSACTION_STATUS } from '../../utils/constants/constant'
import db from '../models'
import { Op } from 'sequelize'
import { minus } from 'number-precision'
import { round } from 'lodash'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const users = await db.User.findAll({
        attributes: ['userId'],
        raw: true
      })

      const userReportsData = []

      await Promise.all(
        users.map(async user => {
          const userId = user.userId
          let ggr = 0

          const [totalPurchaseAmount, pendingRedemptionAmount, totalScAmount] =
            await Promise.all([
              db.TransactionBanking.findOne({
                where: {
                  status: TRANSACTION_STATUS.SUCCESS,
                  actioneeId: userId
                },
                attributes: [
                  [
                    Sequelize.literal(
                      "TRUNC(SUM(CASE WHEN transaction_type = 'deposit' THEN amount ELSE 0 END)::numeric, 2)"
                    ),
                    'totalDepositAmount'
                  ],
                  [
                    Sequelize.literal(
                      "TRUNC(SUM(CASE WHEN transaction_type = 'redeem' THEN amount ELSE 0 END)::numeric, 2)"
                    ),
                    'totalRedeemAmount'
                  ],
                  [
                    Sequelize.fn(
                      'COUNT',
                      Sequelize.literal(
                        "CASE WHEN transaction_type = 'deposit' THEN 1 END"
                      )
                    ),
                    'purchaseCount'
                  ],
                  [
                    Sequelize.fn(
                      'COUNT',
                      Sequelize.literal(
                        "CASE WHEN transaction_type = 'redeem' THEN 1 END"
                      )
                    ),
                    'redemptionCount'
                  ]
                ],
                raw: true
              }),
              db.WithdrawRequest.findOne({
                where: {
                  userId: userId,
                  [Op.or]: [
                    { status: TRANSACTION_STATUS.CANCELED },
                    { status: TRANSACTION_STATUS.PENDING }
                  ]
                },
                attributes: [
                  [
                    Sequelize.literal(
                      'TRUNC(SUM(CASE WHEN status = 0 THEN amount ELSE 0 END)::numeric, 2)'
                    ),
                    'totalPendingRedemptionAmount'
                  ],
                  [
                    Sequelize.fn(
                      'COUNT',
                      Sequelize.literal('CASE WHEN status = 0 THEN 1 END')
                    ),
                    'pendingRedemptionCount'
                  ],
                  [
                    Sequelize.fn(
                      'COUNT',
                      Sequelize.literal('CASE WHEN status = 2 THEN 1 END')
                    ),
                    'cancelledRedemptionCount'
                  ]
                ],
                raw: true
              }),
              db.CasinoTransaction.findOne({
                attributes: [
                  [
                    Sequelize.literal(
                      "TRUNC(SUM(CASE WHEN action_type = 'bet' THEN amount ELSE 0 END)::numeric, 2)"
                    ),
                    'totalScBetAmount'
                  ],
                  [
                    Sequelize.literal(
                      "TRUNC(SUM(CASE WHEN action_type = 'win' THEN amount ELSE 0 END)::numeric, 2)"
                    ),
                    'totalScWinAmount'
                  ]
                ],
                where: {
                  userId: userId,
                  amountType: AMOUNT_TYPE.SC_COIN,
                  status: TRANSACTION_STATUS.SUCCESS
                },
                raw: true
              })
            ])

          ggr = +round(
            +minus(
              +totalScAmount.totalScBetAmount,
              +totalScAmount.totalScWinAmount
            ),
            2
          )

          userReportsData.push({
            user_id: userId,
            ggr: +ggr || null, //
            total_purchase_amount:
              totalPurchaseAmount.totalDepositAmount || null,
            purchase_count: totalPurchaseAmount.purchaseCount || null,
            total_redemption_amount:
              totalPurchaseAmount.totalRedeemAmount || null,
            redemption_count: totalPurchaseAmount.redemptionCount || null,
            total_pending_redemption_amount:
              pendingRedemptionAmount.totalPendingRedemptionAmount || null,
            pending_redemption_count:
              pendingRedemptionAmount.pendingRedemptionCount || null,
            total_sc_bet_amount: totalScAmount.totalScBetAmount || null,
            total_sc_win_amount: totalScAmount.totalScWinAmount || null,
            cancelled_redemption_count:
              pendingRedemptionAmount.cancelledRedemptionCount || null,
            created_at: new Date(),
            updated_at: new Date()
          })
        })
      )

      if (userReportsData.length > 0) await queryInterface.bulkInsert('user_reports', userReportsData)
    } catch (error) {
      console.error('Error in seeder user reports:', error)
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {
    // This will delete all data from the user_reports table during rollback
    await queryInterface.bulkDelete('user_reports', null, {})
  }
}
