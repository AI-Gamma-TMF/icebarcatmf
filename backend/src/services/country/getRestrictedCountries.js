import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import { RESTRICTED_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    itemId: { type: 'string' },
    type: {
      type: 'string',
      enum: ['providers', 'games', 'Providers', 'Games', 'PROVIDERS', 'GAMES']
    }
  },
  required: ['limit', 'pageNo', 'type']
}

const constraints = ajv.compile(schema)

export class GetRestrictedCountriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { itemId, type, limit, pageNo } = this.args
    let checkRestrictedItemsExists, dataItem

    try {
      const { page, size } = pageValidation(pageNo, limit)
      itemId = parseInt(itemId)
      if (!itemId) return this.addError('ItemsIdNotFoundErrorType')

      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoProvider,
          data: { masterCasinoProviderId: itemId }
        })
        dataItem = { restrictedProviders: { [Op.contains]: itemId } }
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: itemId }
        })
        dataItem = { restrictedGames: { [Op.contains]: itemId } }
      }

      if (!checkRestrictedItemsExists) return this.addError('ItemsNotFoundErrorType')

      const restrictedCountries = await db.Country.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: ((page - 1) * size),
        where: dataItem,
        attributes: ['countryId', 'code', 'name']
      })

      return { restrictedCountries, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
