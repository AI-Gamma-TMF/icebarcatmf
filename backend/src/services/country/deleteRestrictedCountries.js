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
  required: ['itemId', 'type', 'countryIds']
}

const constraints = ajv.compile(schema)

export class DeleteRestrictedCountriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { itemId, type, countryIds } = this.args
    let deletedCountries = 0
    let dataItem, itemIndex

    try {
      let checkRestrictedItemsExists
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

        if (checkCountryExists.restrictedGames || checkCountryExists.restrictedProviders) {
          if (type.toUpperCase() === RESTRICTED_TYPE.PROVIDERS) {
            itemIndex = checkCountryExists.restrictedProviders.indexOf(itemId)

            let restrictedProvidersData = null
            if (checkCountryExists?.restrictedProviders && !checkCountryExists.restrictedProviders.length) {
              restrictedProvidersData = checkCountryExists.restrictedProviders
            }
            if (itemIndex > -1) {
              checkCountryExists.restrictedProviders.splice(itemIndex, 1)
              dataItem = { restrictedProviders: restrictedProvidersData }
            } else continue
          } else if (type.toUpperCase() === RESTRICTED_TYPE.GAMES) {
            itemIndex = checkCountryExists.restrictedGames.indexOf(itemId)
            let restrictedGamesData = null
            if (checkCountryExists?.restrictedGames && !checkCountryExists.restrictedGames.length) {
              restrictedGamesData = checkCountryExists.restrictedGames
            }
            if (itemIndex > -1) {
              checkCountryExists.restrictedGames.splice(itemIndex, 1)
              dataItem = { restrictedGames: restrictedGamesData }
            } else continue
          }
        } else continue

        const updatedCountry = await updateEntity({ model: db.Country, values: { countryId }, data: dataItem })
        deletedCountries += parseInt(updatedCountry)
      }

      return { deletedCountries, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
