'use strict'

import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'
import db from '../models'

function getDataSet (depositData) {
  const requiredData = []

  depositData.forEach((index) => {
    if (index?.moreDetails) {
      if (typeof index.moreDetails === 'string') {
        index.moreDetails = JSON.parse(index.moreDetails)
      }
      if (index?.moreDetails?.paymentType === 'CARD' || index?.moreDetails?.data?.paymentType === 'CARD') {
        requiredData.push(index)
      }
    }
  })

  return requiredData
}

const groupByActioneeId = (data) => {
  return data.reduce((acc, transaction) => {
    const { actioneeId } = transaction
    if (!acc[actioneeId]) {
      acc[actioneeId] = []
    }
    acc[actioneeId].push(transaction)
    return acc
  }, {})
}

const aggregateTransactions = (transactions) => {
  const aggregatedResults = []

  for (const actioneeId in transactions) {
    const cardMap = {}

    transactions[actioneeId].forEach((txn) => {
      const moreDetails = txn.moreDetails
      const cardDetails = moreDetails.data?.card || moreDetails.card

      const lastDigits = cardDetails?.lastDigits

      if (lastDigits) {
        if (!cardMap[lastDigits]) {
          cardMap[lastDigits] = {
            userId: parseInt(actioneeId),
            transactionId: txn.transactionId,
            amount: 0,
            cardLastDigits: lastDigits,
            expiryMonth: parseInt(cardDetails?.cardExpiry?.month) || null,
            expiryYear: parseInt(cardDetails?.cardExpiry?.year) || null,
            holderName: cardDetails?.holderName || null,
            status: cardDetails?.status || null,
            cardType: cardDetails?.cardType || null,
            cardBin: parseInt(cardDetails?.cardBin) || null,
            cardCategory: cardDetails?.cardCategory || null,
            issuingCountry: cardDetails?.issuingCountry || null
          }
        }
        cardMap[lastDigits].amount += txn.amount
      }
    })

    aggregatedResults.push(...Object.values(cardMap))
  }

  return aggregatedResults
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const depositDetails = await db.TransactionBanking.findAll({
      where: {
        status: TRANSACTION_STATUS.SUCCESS,
        transactionType: TRANSACTION_TYPE.DEPOSIT
      },
      attributes: ['actioneeId', 'moreDetails', 'transactionId', 'amount'],
      raw: true
    })

    const dataSet = getDataSet(depositDetails)

    const groupedByUserId = groupByActioneeId(dataSet)

    const finalDateSet = aggregateTransactions(groupedByUserId)

    await db.PaymentCard.bulkCreate(finalDateSet)
  },

  async down (queryInterface, DataTypes) {
  }
}
