import { v4 as uuid } from 'uuid'
import { plus, round } from 'number-precision'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import WalletEmitter from '../../socket-resources/emmitter/wallet.emmitter'
import { ACTION_TYPE, AMOUNT_TYPE, BONUS_TYPE, RAFFLE_STATUS, TRANSACTION_STATUS } from '../../utils/constants/constant'

export class UserPayoutService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        Wallet: WalletModel,
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel,
        CasinoTransaction: CasinoTransactionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { raffleId, entryIds, scWinAmount, gcWinAmount, isCompleted = false } = this.args
    try {
      const raffle = await RafflesModel.findOne({
        where: {
          raffleId,
          isActive: true,
          status: [RAFFLE_STATUS.UPCOMING, RAFFLE_STATUS.ONGOING]
        },
        raw: true
      })

      if (!raffle) {
        return this.addError('GiveawaysNotExistErrorType')
      }

      if (new Date(raffle.endDate) > new Date()) {
        return this.addError('GiveawaysNotCompletedErrorType')
      }

      for (let i = 0; i < entryIds.length; i++) {
        const entryId = entryIds[i]

        const userEntry = await RafflesEntryModel.findOne({
          where: { raffleId, entryId, isWinner: false },
          include: [
            {
              model: UserModel,
              attributes: ['username', 'email', 'firstName', 'lastName']
            }
          ]
        })

        if (!userEntry) {
          continue
        }

        const userId = userEntry.userId

        const userWallet = await WalletModel.findOne({
          where: { ownerId: userId },
          lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
          transaction
        })

        let balanceObj = {
          beforeScBalance: +round(+plus(+userWallet.scCoin.psc, +userWallet.scCoin.wsc, +userWallet.scCoin.bsc), 2),
          beforeGcBalance: +round(+userWallet.gcCoin, 2)
        }

        userWallet.scCoin = {
          ...userWallet.scCoin,
          bsc: +round(+plus(+userWallet.scCoin.bsc, +scWinAmount), 2)
        }
        userWallet.gcCoin = +round(+plus(userWallet.gcCoin, +gcWinAmount), 2)

        const socketObj = {
          scCoin: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2),
          gcCoin: userWallet.gcCoin
        }

        balanceObj = {
          ...balanceObj,
          afterGcBalance: +round(+userWallet.gcCoin, 2),
          afterScBalance: +round(+plus(+userWallet.scCoin.bsc, +userWallet.scCoin.wsc, +userWallet.scCoin.psc), 2)
        }

        userEntry.isWinner = true
        userEntry.scWin = +scWinAmount
        userEntry.gcWin = +gcWinAmount

        const transactionObj = {
          transactionId: uuid(),
          userId: userId,
          actionType: BONUS_TYPE.RAFFLE_PAYOUT,
          actionId: ACTION_TYPE.CREDIT,
          amount: 0,
          sc: +scWinAmount,
          gc: +gcWinAmount,
          walletId: userWallet.walletId,
          currencyCode: userWallet.currencyCode,
          status: TRANSACTION_STATUS.SUCCESS,
          roundId: 'NULL',
          amountType: AMOUNT_TYPE.SC_GC_COIN,
          moreDetails: balanceObj
        }

        await Promise.all([
          userEntry.save({ transaction }),
          userWallet.save({ transaction }),
          CasinoTransactionModel.create(transactionObj, { transaction })
        ])

        WalletEmitter.emitUserWalletBalance(socketObj, userId)
      }

      if (isCompleted) {
        const raffleObj = {
          wonDate: new Date(),
          status: RAFFLE_STATUS.COMPLETED
        }

        await Promise.all([
          RafflesModel.update(raffleObj, { where: { raffleId, isActive: true }, transaction }),
          RafflesEntryModel.update({ isActive: false }, { where: { raffleId, isActive: true }, transaction })
        ])
      }

      return {
        message: SUCCESS_MSG.UPDATE_SUCCESS,
        success: true
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
