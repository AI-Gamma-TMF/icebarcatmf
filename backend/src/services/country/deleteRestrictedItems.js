import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { RESTRICTED_TYPE } from '../../utils/constants/constant'
import { getOne, updateEntity } from '../../utils/crud'
import { removeItems } from './../../utils/common'

const schema = {
  type: 'object',
  properties: {
    itemIds: { type: 'array' },
    countryId: { type: 'number' },
    type: {
      type: 'string',
      enum: ['providers', 'games', 'Providers', 'Games', 'PROVIDERS', 'GAMES']
    }
  },
  required: ['itemIds', 'type']
}

const constraints = ajv.compile(schema)

export class DeleteRestrictedItemsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { itemIds, type, countryId } = this.args
    let dataItem = 0

    try {
      if (!countryId) return this.addError('CountryIdNotFoundErrorType')
      const checkCountryExists = await getOne({ model: db.Country, data: { countryId } })
      if (!checkCountryExists) return this.addError('CountryNotFoundErrorType')

      if (!checkCountryExists.restrictedProviders && !checkCountryExists.restrictedGames) {
        return this.addError('ItemsNotFoundErrorType')
      }

      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        dataItem = { restrictedProviders: removeItems(checkCountryExists.restrictedProviders, itemIds) }
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        dataItem = { restrictedGames: removeItems(checkCountryExists.restrictedGames, itemIds) }
      }

      const updatedCountry = await updateEntity({ model: db.Country, values: { countryId }, data: dataItem })
      return { updatedCountry, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
