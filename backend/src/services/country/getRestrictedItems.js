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
    countryId: { type: 'string' },
    type: {
      type: 'string',
      enum: ['providers', 'games', 'Providers', 'Games', 'PROVIDERS', 'GAMES']
    }
  },
  required: ['limit', 'pageNo', 'type']
}

const constraints = ajv.compile(schema)

export class GetRestrictedItemsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { countryId, type, limit, pageNo } = this.args
    let restrictedItems

    try {
      if (!+(countryId)) return this.addError('CountryIdNotFoundErrorType')
      const { page, size } = pageValidation(pageNo, limit)
      const checkCountryExist = await getOne({ model: db.Country, data: { countryId } })

      if (!checkCountryExist) return this.addError('CountryNotFoundErrorType')

      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        const providers = await db.MasterCasinoProvider.findAndCountAll({
          order: [['createdAt', 'DESC']],
          limit: size,
          offset: ((page - 1) * size),
          where: { masterCasinoProviderId: checkCountryExist.restrictedProviders }
        })
        restrictedItems = { providers }
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        const games = await db.MasterCasinoGame.findAndCountAll({
          order: [['createdAt', 'DESC']],
          limit: size,
          offset: ((page - 1) * size),
          where: { masterCasinoGameId: checkCountryExist.restrictedGames },
          attributes: ['masterCasinoGameId', 'name', 'thumbnailUrl', 'operatorStatus', 'isActive', 'masterCasinoProviderId']
        })
        restrictedItems = { games }
      }
      return { restrictedItems, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
