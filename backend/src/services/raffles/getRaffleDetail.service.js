import { Sequelize } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const s3Config = config.getProperties().s3

export class GetRaffleDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Raffles: RafflesModel,
        RafflesEntry: RafflesEntryModel,
        User: UserModel
      }
    } = this.context
    const { raffleId, pageNo, limit, sort, orderBy } = this.args
    try {
      const raffle = await RafflesModel.findOne({
        where: { raffleId }
      })
      if (!raffle) {
        return this.addError('GiveawaysNotExistErrorType')
      }
      const currentTime = new Date()
      currentTime.setMinutes(currentTime.getMinutes() + 5)
      raffle.dataValues.isEditable = true

      let pagination = {}
      if (pageNo && limit) {
        const { page, size } = pageValidation(pageNo, limit)
        pagination = {
          limit: (page - 1) * size,
          size: size
        }
      }

      if (raffle.startDate >= currentTime) raffle.dataValues.isEditable = false

      const winnerData = await RafflesEntryModel.findAll({
        where: { isWinner: true, raffleId },
        include: [
          {
            model: UserModel,
            attributes: ['userId', 'username', 'email'],
            required: true
          }
        ]
      })

      raffle.dataValues.winnerObj = winnerData

      raffle.dataValues.userEntry = await RafflesEntryModel.findAll({
        attributes: [
          'userId',
          [Sequelize.fn('ARRAY_AGG', Sequelize.col('entry_id')), 'raffleEntry'],
          [Sequelize.fn('COUNT', Sequelize.col('entry_id')), 'entryCount'],
          [Sequelize.literal('(SELECT CASE WHEN users.is_active = false OR is_restrict = true or is_ban = true THEN false ELSE true END FROM users WHERE users.user_id = "RafflesEntry"."user_id")'), 'isAllowed']
        ],
        where: {
          raffleId
        },
        ...pagination,
        order: [[orderBy || 'userId', sort || 'ASC']],
        group: ['userId']
      })

      raffle.dataValues.imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${raffle.dataValues.imageUrl}`
      return { getRaffleDetail: raffle, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
