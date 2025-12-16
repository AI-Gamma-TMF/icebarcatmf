import sequelize, { Op } from 'sequelize'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import {
  AMOUNT_TYPE,
  PACKAGE_USER_FILTER,
  TRANSACTION_STATUS
} from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { divide, minus, round, times, plus } from 'number-precision'
import { Readable } from 'stream'
import { Parser } from 'json2csv'

export class GetPlayerIdsPerFilterService extends ServiceBase {
  async run () {
    const { type, value, operator, csvDownload } = this.args

    const playerIds = []
    let usersTransaction

    try {
      switch (type) {
        case PACKAGE_USER_FILTER.NGR:
          const usersPurchaseDetail = await this.getUsersPurchaseDetails()

          await Promise.all(
            usersPurchaseDetail.map(async user => {
              let ngr = +round(
                +minus(+user.depositAmount, +user.redeemAmount),
                2
              )

              const pendingRedemptionAmount = await db.WithdrawRequest.findOne({
                where: {
                  userId: +user.actioneeId,
                  [Op.or]: [
                    { status: TRANSACTION_STATUS.INPROGRESS },
                    { status: TRANSACTION_STATUS.PENDING }
                  ]
                },
                attributes: [
                  [
                    sequelize.fn('SUM', sequelize.col('amount')),
                    'pendingAmount'
                  ]
                ],
                raw: true
              })

              if (pendingRedemptionAmount?.pendingAmount) {
                ngr = +round(
                  +minus(+ngr, +pendingRedemptionAmount.pendingAmount),
                  2
                )
              }

              const userWallet = await db.Wallet.findOne({
                where: { ownerId: +user.actioneeId },
                attributes: ['scCoin'],
                raw: true
              })

              let currentScBalance
              if (userWallet) {
                currentScBalance = +round(
                  +plus(
                    +userWallet.scCoin.bsc,
                    +userWallet.scCoin.psc,
                    +userWallet.scCoin.wsc
                  ),
                  2
                )
                ngr = +round(+minus(+ngr, +currentScBalance), 2)
              }

              if (this.compareValues(+ngr, operator, +value)) {
                const userObj = {
                  userId: +user.actioneeId,
                  value: +ngr,
                  email: user['transactionUser.email'],
                  username: user['transactionUser.username'],
                  isActive: user['transactionUser.isActive']
                }
                playerIds.push(userObj)
              }
            })
          )

          break

        case PACKAGE_USER_FILTER.GGR:
          usersTransaction = await this.getUsersScTransaction()

          await Promise.all(
            usersTransaction.map(async user => {
              const ggr = +round(+minus(+user.scBet, +user.scWin), 2)

              if (this.compareValues(ggr, operator, +value)) {
                const userObj = {
                  userId: +user.userId,
                  value: +ggr,
                  email: user['User.email'],
                  username: user['User.username'],
                  isActive: user['User.isActive']
                }
                playerIds.push(userObj)
              }
            })
          )

          break

        case PACKAGE_USER_FILTER.DEPOSIT:
          const usersTotalPurchase = await this.getUsersPurchaseDetails()

          await Promise.all(
            usersTotalPurchase.map(async user => {
              if (this.compareValues(+user.depositAmount, operator, +value)) {
                const userObj = {
                  userId: +user.actioneeId,
                  value: +user.depositAmount,
                  email: user['transactionUser.email'],
                  username: user['transactionUser.username'],
                  isActive: user['transactionUser.isActive']
                }
                playerIds.push(userObj)
              }
            })
          )

          break

        case PACKAGE_USER_FILTER.RTP:
          usersTransaction = await this.getUsersScTransaction()

          await Promise.all(
            usersTransaction.map(async user => {
              const rtp = +round(
                +times(+divide(+user.scWin, +user.scBet), 100),
                2
              )

              if (this.compareValues(rtp, operator, +value)) {
                const userObj = {
                  userId: +user.userId,
                  value: +rtp,
                  email: user['User.email'],
                  username: user['User.username'],
                  isActive: user['User.isActive']
                }
                playerIds.push(userObj)
              }
            })
          )

          break

        case PACKAGE_USER_FILTER.HOUSE_EDGE:
          usersTransaction = await this.getUsersScTransaction()

          await Promise.all(
            usersTransaction.map(async user => {
              const rtp = +round(
                +times(+divide(+user.scWin, +user.scBet), 100),
                2
              )
              const houseEdge = +round(+minus(100, +rtp), 2)

              if (this.compareValues(houseEdge, operator, +value)) {
                const userObj = {
                  userId: +user.userId,
                  value: +houseEdge,
                  email: user['User.email'],
                  username: user['User.username'],
                  isActive: user['User.isActive']
                }
                playerIds.push(userObj)
              }
            })
          )

          break
      }

      if (csvDownload === 'true') {
        const stream = await this.createStream({ playerIds })
        return { stream }
      }

      return { message: SUCCESS_MSG.GET_SUCCESS, playerIds }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }

  async createStream ({ playerIds }) {
    const stream = new Readable({ objectMode: true })

    stream._read = () => {
      if (playerIds.length > 0) {
        const modifiedChunk = playerIds.map(item => {
          return {
            'User Id': item.userId,
            'User email': item.email,
            Username: item.username,
            Value: item.value,
            'Is Active': item.isActive
          }
        })

        const json2csv = new Parser()
        const csv = json2csv.parse(modifiedChunk)
        stream.push(csv + '\n')
        playerIds.length = 0
      } else {
        stream.push(null)
      }
    }
    return stream
  }

  async getUsersScTransaction () {
    const usersTransaction = await db.CasinoTransaction.findAll({
      where: {
        amountType: AMOUNT_TYPE.SC_COIN,
        status: TRANSACTION_STATUS.SUCCESS
      },
      include: {
        model: db.User,
        attributes: ['email', 'username', 'isActive']
      },
      attributes: [
        'userId',
        [
          sequelize.literal(
            'SUM(CASE WHEN action_type = \'bet\' THEN amount ELSE 0 END)'
          ),
          'scBet'
        ],
        [
          sequelize.literal(
            'SUM(CASE WHEN action_type = \'win\' THEN amount ELSE 0 END)'
          ),
          'scWin'
        ]
      ],
      group: ['CasinoTransaction.user_id', 'User.user_id'],
      raw: true
    })

    return usersTransaction
  }

  async getUsersPurchaseDetails () {
    const usersPurchase = await db.TransactionBanking.findAll({
      where: {
        status: TRANSACTION_STATUS.SUCCESS
      },
      include: {
        model: db.User,
        as: 'transactionUser',
        attributes: ['email', 'username', 'isActive']
      },
      attributes: [
        'actioneeId',
        [
          sequelize.literal('SUM(CASE WHEN transaction_type = \'deposit\' THEN amount ELSE 0 END)'
          ),
          'depositAmount'
        ],
        [
          sequelize.literal('SUM(CASE WHEN transaction_type = \'redeem\' THEN amount ELSE 0 END)'),
          'redeemAmount'
        ]
      ],
      group: ['TransactionBanking.actionee_id', 'transactionUser.user_id'],
      raw: true
    })

    return usersPurchase
  }

  compareValues (amount, operator, value) {
    switch (operator) {
      case '>':
        return amount > value
      case '>=':
        return amount >= value
      case '<':
        return amount < value
      case '<=':
        return amount <= value
      case '=':
        return amount === value
    }
  }
}
