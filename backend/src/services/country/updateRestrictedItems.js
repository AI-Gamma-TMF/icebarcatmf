import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { RESTRICTED_TYPE } from '../../utils/constants/constant'
import { getOne, updateEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    itemId: { type: 'number' },
    countryIds: { type: 'array' },
    type: {
      type: 'string',
      enum: ['providers', 'games', 'Providers', 'Games', 'PROVIDERS', 'GAMES']
    }
  },
  required: ['type', 'countryIds']
}

const constraints = ajv.compile(schema)

export class UpdateRestrictedItemsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { itemId, type, countryIds } = this.args
    let checkRestrictedItemsExists
    let updatedItems = 0
    let dataItem = 0

    try {
      if (!itemId) return this.addError('ItemsIdNotFoundErrorType')
      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoProvider,
          data: { masterCasinoProviderId: itemId }
        })
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        checkRestrictedItemsExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: itemId }
        })
      }

      if (!checkRestrictedItemsExists) return this.addError('ItemsNotFoundErrorType')

      for (const countryId of countryIds) {
        const checkCountryExists = await getOne({ model: db.Country, data: { countryId } })
        if (!checkCountryExists) return this.addError('CountryNotFoundErrorType')

        if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
          if (checkCountryExists.restrictedProviders) checkCountryExists.restrictedProviders.push(itemId)
          else checkCountryExists.restrictedProviders = [itemId]

          dataItem = { restrictedProviders: [...new Set(checkCountryExists.restrictedProviders)] }
        } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
          if (checkCountryExists.restrictedGames) checkCountryExists.restrictedGames.push(itemId)
          else checkCountryExists.restrictedGames = [itemId]

          dataItem = { restrictedGames: [...new Set(checkCountryExists.restrictedGames)] }
        }

        const updatedCountry = await updateEntity({ model: db.Country, values: { countryId }, data: dataItem })
        updatedItems += parseInt(updatedCountry)
      }

      return { updatedItems, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
