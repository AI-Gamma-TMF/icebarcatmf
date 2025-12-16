import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getAll } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { filterByName, pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    name: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] }
  }
}

const constraints = ajv.compile(schema)

export class GetCountryListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, name, orderBy, sort } = this.args
    let query, page, size, countries

    try {
      if (pageNo && limit) {
        const values = pageValidation(pageNo, limit)
        page = values.page
        size = values.size
      }

      if (name) query = filterByName(query, name)

      if (page && size) {
        countries = await db.Country.findAndCountAll({
          order: [[orderBy || 'name', sort || 'ASC']],
          limit: size,
          offset: ((page - 1) * size),
          where: query,
          attributes: ['name', 'countryId', 'code']
        })
      } else {
        countries = await getAll({
          model: db.Country,
          data: query,
          order: [[orderBy || 'name', sort || 'ASC']],
          attributes: ['name', 'countryId', 'code']
        })
      }
      return { countries, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
