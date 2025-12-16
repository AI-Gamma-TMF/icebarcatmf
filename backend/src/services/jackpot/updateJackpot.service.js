import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { divide, plus, round, times } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { jackpotWinningTicketRnG } from '../../utils/common'
import { JACKPOT_STATUS } from '../../utils/constants/constant'

export class UpdateJackpotService extends ServiceBase {
  async run () {
    const {
      dbModels: { Jackpot: JackpotModel },
      sequelizeTransaction: transaction
    } = this.context

    const { jackpotId, jackpotName, maxTicketSize, seedAmount, entryAmount, adminShare, poolShare, winningTicket } = this.args

    const checkJackpotId = await JackpotModel.findOne({ where: { jackpotId }, transaction })

    if (!checkJackpotId) return this.addError('JackpotNotExistErrorType')

    if (checkJackpotId.status !== JACKPOT_STATUS.UPCOMING) return this.addError('JackpotNotUpcomingErrorType')

    if (+plus(+adminShare, +poolShare) !== 100) return this.addError('InvalidJackpotShareErrorType')

    const checkIfWinningTicketIsGood = this.checkJackpotWinningTicket(seedAmount, maxTicketSize, +round(+times(+checkJackpotId.adminShare, +checkJackpotId.entryAmount), 2), winningTicket)

    if (checkIfWinningTicketIsGood === 'NO_JACKPOT_BREAK_EVEN') return this.addError('JackpotBreakEvenErrorType')

    await JackpotModel.update(
      {
        jackpotName,
        maxTicketSize,
        seedAmount,
        entryAmount,
        adminShare: +round(+divide(+adminShare, 100), 2),
        poolShare: +round(+divide(+poolShare, 100), 2),
        winningTicket
      },
      { where: { jackpotId }, transaction }
    )

    if (+maxTicketSize !== +checkJackpotId.maxTicketSize || +seedAmount !== +checkJackpotId.seedAmount || +entryAmount !== +checkJackpotId.entryAmount) {
      const jackpots = await JackpotModel.findAll({ where: { jackpotId: { [Op.gt]: jackpotId } }, order: [['createdAt', 'ASC']], transaction })

      const promises = []
      jackpots.map(async jackpot => {
        const winningTicket = jackpotWinningTicketRnG(+jackpot.seedAmount, +jackpot.maxTicketSize, +round(+times(+jackpot.adminShare, +jackpot.entryAmount), 2))

        if (winningTicket === 'NO_JACKPOT_BREAK_EVEN') return this.addError('JackpotBreakEvenErrorType')

        promises.push(JackpotModel.update({ winningTicket: +winningTicket }, { where: { jackpotId: jackpot.jackpotId }, transaction }))
      })

      await Promise.all(promises)
    }

    return {
      success: true,
      message: SUCCESS_MSG.UPDATE_SUCCESS
    }
  }

  checkJackpotWinningTicket (seedAmount, maxTicketSize, adminShare, winningTicket) {
    let minTickets = +Math.ceil(+divide(+seedAmount, +adminShare || 1))

    if (+minTickets >= +maxTicketSize) return 'NO_JACKPOT_BREAK_EVEN'

    if (+divide(+maxTicketSize, 2) > +minTickets) minTickets = +Math.ceil(+divide(+maxTicketSize, 2))

    const min = minTickets + 1
    const max = +maxTicketSize

    if (max <= min) return 'NO_JACKPOT_BREAK_EVEN'

    if (+winningTicket < +min || +winningTicket > +max) return 'NO_JACKPOT_BREAK_EVEN'

    return true
  }
}
