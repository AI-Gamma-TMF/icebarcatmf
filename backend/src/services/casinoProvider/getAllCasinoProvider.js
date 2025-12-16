import { Op } from 'sequelize'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation, prepareImageUrl } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
export class GetMasterCasinoProvidersService extends ServiceBase {
  async run () {
    const { limit, pageNo, orderBy, sort, search, masterGameAggregatorId, isActive } = this.args
    let casinoProvider, query
    try {
      let aggregatorWhere
      if (masterGameAggregatorId && masterGameAggregatorId > 0) {
        aggregatorWhere = {
          masterGameAggregatorId: masterGameAggregatorId
        }
      }
      const include = [
        {
          model: db.MasterGameAggregator,
          attributes: ['name'],
          where: aggregatorWhere
        }
      ]

      if (search) {
        if (/^\d+$/.test(search)) {
          query = { masterCasinoProviderId: +search }
        } else {
          query = {
            ...query,
            name: { [Op.iLike]: `%${search.trim().toUpperCase()}%` }
          }
        }
      }

      if (isActive && isActive !== 'all') query = { ...query, isActive }

      query = {
        ...query,
        isHidden: false
      }

      const { page, size } = pageValidation(pageNo, limit)
      if (pageNo && limit) {
        casinoProvider = await db.MasterCasinoProvider.findAndCountAll({
          where: query,
          order: [[orderBy || 'masterCasinoProviderId', sort || 'ASC']],
          include,
          limit: size,
          offset: (page - 1) * size
        })
      } else {
        casinoProvider = await db.MasterCasinoProvider.findAndCountAll({
          where: query,
          order: [[orderBy || 'masterCasinoProviderId', sort || 'ASC']],
          include
        })
      }
      if (!casinoProvider) return this.addError('CasinoProviderNotFoundErrorType')

      Promise.all(
        casinoProvider.rows.map(provider => {
          return (provider.dataValues.thumbnailUrl = prepareImageUrl(provider.thumbnailUrl))
        })
      )
      return { casinoProvider, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
