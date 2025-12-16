import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { AMOUNT_TYPE } from '../../utils/constants/constant'

export class GetBiggestWinnerLooserService extends ServiceBase {
  async run () {
    try {
      const { dbModels: { BiggestWinnersLosers: BiggestWinnersLosersModel } } = this.context
      const allResults = await BiggestWinnersLosersModel.findAll({
        where: {
          amount_type: AMOUNT_TYPE.SC_COIN
        },
        attributes: ['userId', 'netAmount', 'firstName', 'lastName', 'totalWinAmount', 'totalBetAmount', 'totalRollbackAmount', 'type'],
        order: [['netAmount', 'DESC']]
      })

      const topWinners = allResults
        .filter(row => row.type === 'winner')
        .sort((a, b) => b.netAmount - a.netAmount) // highest positive first
        .slice(0, 7)

      const topLooser = allResults
        .filter(row => row.type === 'loser')
        .sort((a, b) => a.netAmount - b.netAmount) // most negative first
        .slice(0, 7)

      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        data: {
          topLooser,
          topWinners
        }
      }
    } catch (error) {
      console.log('error', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
