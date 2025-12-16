import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { calculateUTCDateRangeForTimezoneRange, pageValidation } from '../../utils/common'
import { TOURNAMENT_STATUS } from '../../utils/constants/constant'

export class GetAllTournamentService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tournament: TournamentModel
      }
    } = this.context
    const modelName = 'Tournament'
    let { limit, pageNo, startDate, endDate, entryAmount, orderBy, sort, status, timezone, unifiedSearch } = this.args
    let query, tournamentDetails
    if (startDate && endDate && timezone) {
      const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
      startDate = result?.startDateUTC
      endDate = result?.endDateUTC
      query = {
        ...query,
        [Op.and]: [
          Sequelize.where(Sequelize.col(`${modelName}.start_date`), '>=', startDate),
          Sequelize.where(Sequelize.col(`${modelName}.end_date`), '<=', endDate)
        ]
      }
    }
    try {
      if (unifiedSearch) {
        if (/^\d+$/.test(unifiedSearch)) {
          query = { tournamentId: +unifiedSearch }
        } else {
          query = {
            [Op.or]: [
              { title: { [Op.iLike]: `%${unifiedSearch}%` } },
              { entryCoin: { [Op.iLike]: `%${unifiedSearch}%` } }
            ]
          }
        }
      }
      if (entryAmount) query = { ...query, entryAmount }
      if (status !== 'all' && [TOURNAMENT_STATUS.UPCOMING, TOURNAMENT_STATUS.RUNNING, TOURNAMENT_STATUS.COMPLETED, TOURNAMENT_STATUS.CANCELLED].includes(+status)) query = { ...query, status }

      const { page, size } = pageValidation(pageNo, limit)
      if (pageNo && limit) {
        tournamentDetails = await TournamentModel.findAndCountAll({
          attributes: ['tournamentId', 'title', 'entryAmount', 'entryCoin', 'startDate', 'endDate', 'status', 'orderId'],
          where: query,
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy || 'tournamentId' || 'orderId', sort || 'DESC' || 'ASC']]
        })
      } else {
        if (status === 'all') {
          query = { ...query, status: { [Op.notIn]: [`${TOURNAMENT_STATUS.CANCELLED}`, `${TOURNAMENT_STATUS.COMPLETED}`] } }
        }
        tournamentDetails = await TournamentModel.findAndCountAll({
          attributes: ['tournamentId', 'title', 'status', 'entryCoin'],
          where: { ...query },
          order: [[orderBy || 'orderId' || 'startDate', sort || 'ASC' || 'DESC']]
        })
      }
      return {
        data: tournamentDetails || [],
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
