import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import config from '../../configs/app.config'

export class GetAllRafflesService extends ServiceBase {
  async run () {
    const {
      dbModels: { Raffles: RafflesModel }
    } = this.context
    const {
      limit,
      pageNo,
      search,
      wagerBaseAmt,
      orderBy,
      sort,
      isActive,
      status
    } = this.args

    const currentDate = new Date()
    await RafflesModel.update(
      {
        status: Sequelize.literal(`CASE
          WHEN start_date > '${currentDate.toISOString()}' AND status IS NULL THEN 'upcoming'
          WHEN start_date <= '${currentDate.toISOString()}' AND end_date >= '${currentDate.toISOString()}' AND (status IS NULL OR status = 'upcoming') THEN 'ongoing'
          ELSE status
          END`)
      },
      { where: { [Op.or]: [{ startDate: { [Op.gt]: currentDate }, status: null }, { startDate: { [Op.lte]: currentDate }, endDate: { [Op.gte]: currentDate }, [Op.or]: [{ status: null }, { status: 'upcoming' }] }] } }
    )
    let query, raffleDetails

    try {
      if (search) {
        if (/^\d+$/.test(search)) {
          query = { ...query, raffleId: +search }
        } else {
          query = {
            ...query, title: { [Op.iLike]: `%${search}%` }
          }
        }
      }
      if (isActive && isActive !== 'all') query = { ...query, isActive }
      if (wagerBaseAmt) query = { ...query, wagerBaseAmt: wagerBaseAmt }
      if (status && status !== 'all') query = { ...query, status }

      const { page, size } = pageValidation(pageNo, limit)
      if (pageNo && limit) {
        raffleDetails = await RafflesModel.findAndCountAll({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: query,
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy || 'startDate', sort || 'DESC']]
        })
      } else {
        raffleDetails = await RafflesModel.findAndCountAll({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: query,
          order: [[orderBy || 'startDate', sort || 'DESC']]
        })
      }

      Promise.all(
        raffleDetails.rows.map(raffle => {
          return (raffle.dataValues.imageUrl = `${config.get(
            's3.S3_DOMAIN_KEY_PREFIX'
          )}${raffle.imageUrl}`)
        })
      )
      return raffleDetails
        ? { raffleDetails, message: SUCCESS_MSG.GET_SUCCESS }
        : this.addError('GiveawaysNotExistErrorType')
    } catch (error) {
      console.log('error---', error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
