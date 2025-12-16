'use strict'
const { default: db } = require('../models')
const { BONUS_TYPE, BONUS_STATUS, TRANSACTION_STATUS } = require('../../utils/constants/constant')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const tierIds = (await db.Tier.findAll({
        attributes: ['tierId'],
        order: [['level', 'ASC']],
        raw: true,
        transaction
      })).map(tier => +(tier.tierId)).slice(1)

      const casinoTierBonusData = await db.CasinoTransaction.findAll({
        attributes: ['userId', 'actionType', 'sc', 'gc', 'createdAt'],
        where: {
          actionType: BONUS_TYPE.TIER_BONUS,
          status: TRANSACTION_STATUS.SUCCESS
        },
        order: [
          ['userId', 'ASC'],
          ['createdAt', 'ASC']
        ],
        raw: true,
        transaction
      })

      const bonusData = await db.Bonus.findOne({
        attributes: ['bonusId'],
        where: {
          bonusType: BONUS_TYPE.TIER_BONUS
        },
        raw: true,
        transaction
      })

      const groupedTransactions = casinoTierBonusData.reduce((acc, data) => {
        if (!acc[data.userId]) {
          acc[data.userId] = []
        }
        acc[data.userId].push(data)
        return acc
      }, {})

      const userBonusData = []
      for (const userId in groupedTransactions) {
        const userTierTransactions = groupedTransactions[userId]
        userTierTransactions.forEach((tierTransaction, index) => {
          const tierId = tierIds[index % tierIds.length]

          userBonusData.push({
            userId: tierTransaction.userId,
            bonusId: bonusData.bonusId,
            bonusType: BONUS_TYPE.TIER_BONUS,
            scAmount: +tierTransaction.sc,
            gcAmount: +tierTransaction.gc,
            createdAt: tierTransaction.createdAt,
            updatedAt: tierTransaction.updatedAt,
            claimedAt: tierTransaction.createdAt,
            tierId: +tierId,
            status: BONUS_STATUS.CLAIMED
          })
        })
      }

      // Save all data to the UserBonus table
      await db.UserBonus.bulkCreate(userBonusData, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('Error in seeder user reports:', error)
      // throw error
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
