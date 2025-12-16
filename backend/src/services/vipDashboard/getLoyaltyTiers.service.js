import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'], enum: ['ASC', 'DESC'] },
    isActive: { type: ['string', 'null'], enum: ['true', 'false', 'all'] }
  },
  required: []
}
const constraints = ajv.compile(schema)
export class GetAllLoyaltyTiersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Tier: TierModel }
    } = this.context

    try {
      let query = {}

      const { limit, pageNo, search, isActive, orderBy, sort } = this.args

      const { page, size } = pageValidation(pageNo, limit)

      if (isActive && isActive !== 'all') query = { ...query, isActive }

      if (search) query = { ...query, name: { [Op.iLike]: `%${search.trim()}%` } }

      let tiers = []
      if (pageNo && limit) {
        tiers = await TierModel.findAndCountAll({
          attributes: ['tierId', 'name'],
          where: { ...query, isActive: true },
          limit: size,
          offset: (page - 1) * size,
          order: [[orderBy || 'level', sort || 'ASC']]
        })
      } else {
        tiers = await TierModel.findAndCountAll({
          attributes: ['tierId', 'name'],
          where: { ...query, isActive: true },
          order: [[orderBy || 'level', sort || 'ASC']]
        })
      }
      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        tiers
      }
    } catch (error) {
      console.log('error', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
