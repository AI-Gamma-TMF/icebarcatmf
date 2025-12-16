import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import config from '../../configs/app.config'
import { Sequelize } from 'sequelize'
const s3Config = config.getProperties().s3

export class GetRafflePayoutService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel
      }
    } = this.context
    const { raffleId } = this.args
    try {
      const raffle = await RafflesModel.findOne({
        where: { raffleId, isActive: true },
        raw: true
      })

      if (!raffle) {
        return this.addError('GiveawaysNotExistErrorType')
      }

      let { gameId, status, ...raffleObj } = raffle

      const entryRequiredDetails = await RafflesEntryModel.findOne({
        attributes: [
          [
            Sequelize.fn('count', Sequelize.col('entry_id')),
            'totalNoOfEntryTickets'
          ],
          [Sequelize.fn('min', Sequelize.col('entry_id')), 'firstTicketId'],
          [Sequelize.fn('max', Sequelize.col('entry_id')), 'lastTicketId'],
          [
            Sequelize.fn(
              'count',
              Sequelize.fn('DISTINCT', Sequelize.col('user_id'))
            ),
            'totalNoOfUsers'
          ]
        ],
        where: {
          raffleId: raffleId
        },
        raw: true
      })

      raffleObj.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${raffleObj.imageUrl}`

      raffleObj.entryRequiredDetails = entryRequiredDetails
      return {
        rafflePayout: raffleObj,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
