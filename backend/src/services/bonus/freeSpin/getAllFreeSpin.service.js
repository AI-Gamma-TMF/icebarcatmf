import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { calculateUTCDateRangeForTimezoneRange, pageValidation } from '../../../utils/common'
import { FREE_SPINS_STATUS } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetAllFreeSpinService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FreeSpinBonusGrant: FreeSpinBonusGrantModel,
        MasterCasinoGame: MasterCasinoGameModel,
        MasterCasinoProvider: MasterCasinoProviderModel
      }
    } = this.context

    const modelName = 'FreeSpinBonusGrant'

    let { limit, pageNo, startDate, endDate, orderBy, sort, status, timezone, freeSpinIdSearch, titleSearch, roundSearch, freeSpinId, providerId, masterCasinoGameId, freeSpinType, providerSearch } = this.args
    let query = {}
    let freeSpinDetails
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
      if (freeSpinIdSearch && /^\d+$/.test(freeSpinIdSearch)) {
        query.freeSpinId = +freeSpinIdSearch
      }

      if (titleSearch) {
        query.title = { [Op.iLike]: `%${titleSearch.trim()}%` }
      }

      if (roundSearch) {
        query.freeSpinRound = +roundSearch
      }

      if (providerSearch) {
        query['$masterCasinoGame.masterCasinoProvider.name$'] = { [Op.iLike]: `%${providerSearch.trim()}%` }
      }

      // filter by provider
      if (providerId) query = { ...query, providerId }
      // filter by Game
      if (masterCasinoGameId) query = { ...query, masterCasinoGameId }
      // filter by freeSpinType
      if (freeSpinType) query = { ...query, freeSpinType }
      //  status filter
      if (status !== 'all' && [FREE_SPINS_STATUS.UPCOMING, FREE_SPINS_STATUS.RUNNING, FREE_SPINS_STATUS.COMPLETED, FREE_SPINS_STATUS.CANCELLED].includes(+status)) query = { ...query, status }
      const { page, size } = pageValidation(pageNo, limit)
      if (pageNo && limit) {
        freeSpinDetails = await FreeSpinBonusGrantModel.findAndCountAll({
          attributes: ['freeSpinId', 'title', 'freeSpinAmount', 'freeSpinRound', 'startDate', 'endDate', 'coinType', 'freeSpinType', 'status', 'daysValidity',
            [Sequelize.col('masterCasinoGame.name'), 'masterCasinoGameName'],
            [Sequelize.col('masterCasinoGame.masterCasinoProvider.name'), 'masterCasinoProviderName']
          ],
          include: [
            {
              model: MasterCasinoGameModel,
              as: 'masterCasinoGame',
              attributes: [],
              include: [
                {
                  model: MasterCasinoProviderModel,
                  as: 'masterCasinoProvider',
                  attributes: []
                }
              ]
            }
          ],
          where: query,
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy || 'freeSpinId' || 'createdAt', sort || 'DESC' || 'ASC']]
        })
      } else if (freeSpinId) {
        freeSpinDetails = await FreeSpinBonusGrantModel.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { freeSpinId: +freeSpinId },
          raw: true
        })

        freeSpinDetails.emailTemplateId = freeSpinDetails?.moreDetails?.emailTemplateId || null
        delete freeSpinDetails.moreDetails
      }
      return { data: freeSpinDetails || [], success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
