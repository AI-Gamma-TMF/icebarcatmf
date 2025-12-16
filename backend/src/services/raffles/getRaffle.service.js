import { Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

export class GetRaffleService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel,
        User: UserModel
      }
    } = this.context
    const { raffleId, sort, orderBy, pageNo, limit } = this.args
    try {
      const raffle = await RafflesModel.findOne({
        where: { raffleId }
      })
      if (!raffle) {
        return this.addError('GiveawaysNotExistErrorType')
      }

      let pagination = {}
      if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)
        pagination = {
          limit: (page - 1) * size,
          size: size
        }
      }
      const userRaffleEntry = await UserModel.findAll({
        attributes: ['userId', 'username', 'email', 'firstName', 'lastName',
          [Sequelize.literal(`(SELECT COUNT(*) FROM "raffles_entry" WHERE "raffles_entry"."user_id" = "User"."user_id" AND "raffles_entry"."raffle_id" = ${raffleId})`), 'totalEntries']
        ],
        include: [
          {
            model: RafflesEntryModel,
            where: { raffleId },
            as: 'RafflesEntry',
            attributes: ['raffleId', 'entryId'],
            required: true
          }
        ],
        group: ['User.user_id', 'RafflesEntry.entry_id'],
        ...pagination,
        order: [[orderBy || 'createdAt', sort || 'DESC']]
      })

      return {
        userRaffleEntry: userRaffleEntry,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
