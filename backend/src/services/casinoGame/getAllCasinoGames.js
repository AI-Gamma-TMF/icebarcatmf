import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getAll } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { filterByName } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    search: { type: ['string', 'null'] },
    providerId: {
      type: ['string', 'null']
    }
  }
}

const constraints = ajv.compile(schema)

export class GetAllCasinoGamesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let query = { isHidden: false }
    const { providerId, search } = this.args

    try {
      if (providerId) query = { ...query, masterCasinoProviderId: providerId }
      if (search) query = filterByName(query, search)

      const games = await getAll({
        model: db.MasterCasinoGame,
        data: query,
        attributes: ['masterCasinoGameId', 'orderId', 'name', 'masterCasinoProviderId', 'wageringContribution', 'returnToPlayer']
      })

      if (!games) return this.addError('GameNotFoundErrorType')

      return { games, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
