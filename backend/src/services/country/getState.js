import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import db from '../../db/models'
import { getAll } from '../../utils/crud'
import { Op } from 'sequelize'

export class GetStateService extends ServiceBase {
  async run () {
    const {
      countryCodes = ['US', 'IN'],
      search = ''
    } = this.args
    let whereClause = {}

    if (countryCodes.length > 0) {
      const countries = await db.Country.findAll({
        where: {
          code: { [Op.in]: countryCodes }
        },
        attributes: ['countryId']
      })
      const countryIds = countries.map(country => country.countryId)

      whereClause.countryId = { [Op.in]: countryIds }
    }

    if (search !== '') {
      whereClause = { ...whereClause, name: { [Op.iLike]: `%${search}%` } }
    }

    const states = await getAll({
      attributes: ['name', 'stateCode', 'state_id'],
      model: db.State,
      data: whereClause
    })

    return { success: true, data: states, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
