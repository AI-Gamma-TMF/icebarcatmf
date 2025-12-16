import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { divide, plus, round, times } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { jackpotWinningTicketRnG } from '../../utils/common'
import { JACKPOT_STATUS } from '../../utils/constants/constant'

export class CreateJackpotService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Jackpot: JackpotModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { jackpotName, maxTicketSize, seedAmount, entryAmount, adminShare, poolShare } = this.args

    if (+plus(+adminShare, +poolShare) !== 100) return this.addError('InvalidJackpotShareErrorType')

    const winningTicket = jackpotWinningTicketRnG(seedAmount, maxTicketSize, +round(+times(+divide(+adminShare, 100), +entryAmount), 2))

    if (winningTicket === 'NO_JACKPOT_BREAK_EVEN') return this.addError('JackpotBreakEvenErrorType')

    await JackpotModel.create({
      jackpotName,
      maxTicketSize,
      seedAmount,
      entryAmount,
      jackpotPoolAmount: +seedAmount,
      jackpotPoolEarning: 0,
      adminShare: +round(+divide(+adminShare, 100), 2),
      poolShare: +round(+divide(+poolShare, 100), 2),
      winningTicket: +winningTicket,
      status: JACKPOT_STATUS.UPCOMING,
      ticketSold: 0
    }, { transaction })

    const availableJackpotCount = await JackpotModel.count({ where: { status: { [Op.in]: [JACKPOT_STATUS.UPCOMING, JACKPOT_STATUS.RUNNING] } }, transaction })

    // Create one more jackpot as safety net.
    if (availableJackpotCount === 1) {
      const nextWinningTicket = jackpotWinningTicketRnG(seedAmount, maxTicketSize, entryAmount)
      await JackpotModel.create({
        jackpotName,
        maxTicketSize,
        seedAmount,
        entryAmount,
        jackpotPoolAmount: +seedAmount,
        jackpotPoolEarning: 0,
        adminShare: +round(+divide(+adminShare, 100), 2),
        poolShare: +round(+divide(+poolShare, 100), 2),
        winningTicket: +nextWinningTicket,
        ticketSold: 0,
        status: JACKPOT_STATUS.UPCOMING
      }, { transaction })
    }

    return {
      success: true,
      message: SUCCESS_MSG.CREATE_SUCCESS
    }
  }
}
