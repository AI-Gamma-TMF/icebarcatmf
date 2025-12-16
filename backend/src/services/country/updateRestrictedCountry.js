import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import { RESTRICTED_TYPE } from '../../utils/constants/constant'
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

export class UpdateRestrictedCountryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { countryId, type, itemIds } = this.args
    let dataItem

    try {
      if (!+(countryId)) return this.addError('CountryIdNotFoundErrorType')
      const checkCountryExists = await getOne({ model: db.Country, data: { countryId } })
      if (!checkCountryExists) return this.addError('CountryNotFoundErrorType')

      if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
        if (checkCountryExists.restrictedProviders) checkCountryExists.restrictedProviders.push(...itemIds)
        else checkCountryExists.restrictedProviders = itemIds

        dataItem = { restrictedProviders: [...new Set(checkCountryExists.restrictedProviders)] }
      } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
        if (checkCountryExists.restrictedGames) checkCountryExists.restrictedGames.push(...itemIds)
        else checkCountryExists.restrictedGames = itemIds

        dataItem = { restrictedGames: [...new Set(checkCountryExists.restrictedGames)] }
      }
      const updatedCountry = await updateEntity({ model: db.Country, values: { countryId }, data: dataItem })
      return { updatedCountry, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
