import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ACTION_TYPE, AMOUNT_TYPE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetUserCasinoDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, startDate, endDate } = this.args
    if (!(+userId)) {
      return this.addError('InvalidIdErrorType')
    }
    const query = { userId }

    const userExist = await getOne({ model: db.User, data: query })
    if (!userExist) return this.addError('UserNotExistsErrorType')

    let totalPurchaseAmountSum, approvalRedemptionTotalSum, redeemingPlayer, playingPlayer, scCreditedPurchaseSum, scCreditedTotalSum, pendingRedemptionTotalSum
    let manualAddedScSum, manualAddedGcSum, manualDeductedGcSum, manualDeductedScSum, scStackedSum, scWinSum, roundsCount
    try {
      if (startDate && endDate) {
        totalPurchaseAmountSum = await db.TransactionBanking.sum(
          'amount',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT
            }
          })
        approvalRedemptionTotalSum = await db.TransactionBanking.sum(
          'amount',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.WITHDRAW
            }
          })

        redeemingPlayer = await db.TransactionBanking.count({
          col: 'transaction_banking_id',
          where: {
            actioneeId: userId,
            createdAt: {
              [Op.and]: {
                [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
              }
            },
            transactionType: TRANSACTION_TYPE.WITHDRAW,
            status: TRANSACTION_STATUS.SUCCESS
          }
        })

        playingPlayer = await db.TransactionBanking.count({
          col: 'transaction_banking_id',
          where: {
            actioneeId: userId,
            createdAt: {
              [Op.and]: {
                [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
              }
            },
            transactionType: TRANSACTION_TYPE.DEPOSIT,
            status: TRANSACTION_STATUS.SUCCESS
          }
        })

        scCreditedPurchaseSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT
            }
          })

        scCreditedTotalSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: { [Op.in]: [TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.BONUS] }
            }
          })

        manualAddedScSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.ADD_SC
            }
          })

        manualAddedGcSum = await db.TransactionBanking.sum(
          'gc_coin',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.ADD_GC
            }
          })

        manualDeductedScSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.REMOVE_SC
            }
          })

        manualDeductedGcSum = await db.TransactionBanking.sum(
          'gc_coin',
          {
            where: {
              actioneeId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.REMOVE_GC
            }
          })

        scStackedSum = await db.CasinoTransaction.sum(
          'amount',
          {
            where: {
              userId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              amountType: AMOUNT_TYPE.SC_COIN,
              actionId: ACTION_TYPE.DEBIT
            }
          })

        scWinSum = await db.CasinoTransaction.sum(
          'amount',
          {
            where: {
              userId: userId,
              createdAt: {
                [Op.and]: {
                  [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                  [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
                }
              },
              amountType: AMOUNT_TYPE.SC_COIN,
              actionId: ACTION_TYPE.CREDIT
            }
          })
        roundsCount = await db.CasinoTransaction.count({
          col: 'casino_transaction_id',
          where: {
            userId: userId,
            createdAt: {
              [Op.and]: {
                [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
                [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
              }
            },
            amountType: AMOUNT_TYPE.SC_COIN,
            actionId: ACTION_TYPE.DEBIT
          }
        })
      } else {
        totalPurchaseAmountSum = await db.TransactionBanking.sum(
          'amount',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT
            }
          })
        approvalRedemptionTotalSum = await db.TransactionBanking.sum(
          'amount',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.WITHDRAW
            }
          })

        pendingRedemptionTotalSum = await db.WithdrawRequest.sum(
          'amount',
          {
            where: {
              userId,
              status: TRANSACTION_STATUS.PENDING
            }
          })

        redeemingPlayer = await db.TransactionBanking.count({
          col: 'transaction_banking_id',
          where: {
            actioneeId: userId,
            transactionType: TRANSACTION_TYPE.WITHDRAW,
            status: TRANSACTION_STATUS.SUCCESS
          }
        })

        playingPlayer = await db.TransactionBanking.count({
          col: 'transaction_banking_id',
          where: {
            actioneeId: userId,
            transactionType: TRANSACTION_TYPE.DEPOSIT,
            status: TRANSACTION_STATUS.SUCCESS
          }
        })

        scCreditedPurchaseSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT
            }
          })

        scCreditedTotalSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: { [Op.in]: [TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.BONUS] }
            }
          })

        manualAddedScSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.ADD_SC
            }
          })

        manualAddedGcSum = await db.TransactionBanking.sum(
          'gc_coin',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.ADD_GC
            }
          })

        manualDeductedScSum = await db.TransactionBanking.sum(
          'sc_coin',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.REMOVE_SC
            }
          })

        manualDeductedGcSum = await db.TransactionBanking.sum(
          'gc_coin',
          {
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.REMOVE_GC
            }
          })

        scStackedSum = await db.CasinoTransaction.sum(
          'amount',
          {
            where: {
              userId: userId,
              amountType: AMOUNT_TYPE.SC_COIN,
              actionId: ACTION_TYPE.DEBIT
            }
          })

        scWinSum = await db.CasinoTransaction.sum(
          'amount',
          {
            where: {
              userId: userId,
              amountType: AMOUNT_TYPE.SC_COIN,
              actionId: ACTION_TYPE.CREDIT
            }
          })

        roundsCount = await db.CasinoTransaction.count({
          col: 'casino_transaction_id',
          where: {
            userId: userId,
            amountType: AMOUNT_TYPE.SC_COIN,
            actionId: ACTION_TYPE.DEBIT
          }
        })
      }

      const totalPurchaseAmountLifetimeSum = await db.TransactionBanking.sum(
        'amount',
        {
          where: {
            actioneeId: userId,
            status: TRANSACTION_STATUS.SUCCESS,
            transactionType: TRANSACTION_TYPE.DEPOSIT
          }
        })

      const approvalRedemptionTotalLifetimeSum = await db.TransactionBanking.sum(
        'amount',
        {
          where: {
            actioneeId: userId,
            status: TRANSACTION_STATUS.SUCCESS,
            transactionType: TRANSACTION_TYPE.WITHDRAW
          }
        })

      const userRscBalance = await db.Wallet.findOne({
        where: { ownerId: userId },
        attributes: ['scCoin']
      })

      const userCasinoDetail = {
        totalPurchaseAmount: totalPurchaseAmountSum || 0,
        approvedRedemptionTotal: approvalRedemptionTotalSum || 0,
        pendingRedemptionTotal: pendingRedemptionTotalSum || 0,
        redeemingPlayer: (redeemingPlayer > 0) ? 'yes' : 'no',
        playingPlayer: (playingPlayer > 0) ? 'yes' : 'no',
        scCreditedTotal: scCreditedTotalSum || 0,
        scCreditedPurchase: scCreditedPurchaseSum || 0,
        manualAddedSc: manualAddedScSum || 0,
        manualAddedGc: manualAddedGcSum || 0,
        manualDeductedSc: manualDeductedScSum || 0,
        manualDeductedGc: manualDeductedGcSum || 0,
        scStacked: scStackedSum || 0,
        scWins: scWinSum || 0,
        netGaming: (totalPurchaseAmountLifetimeSum - approvalRedemptionTotalLifetimeSum) - parseFloat(userRscBalance.scCoin.wsc),
        GgrSc: scStackedSum - scWinSum,
        rounds: roundsCount
      }
      return { userCasinoDetail, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
