import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    search: { type: ['string'] },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetBlockedDomainsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlockedDomains: BlockedDomainsModel }
    } = this.context
    let query
    const { limit, pageNo, search, sort, orderBy } = this.args
    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { domainName: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }

      query = { ...query }

      const blockedDomains = await BlockedDomainsModel.findAndCountAll({
        order: [[orderBy || 'createdAt', sort || 'DESC']],
        where: query,
        limit: size,
        offset: (page - 1) * size
      })
      return { blockedDomains, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
