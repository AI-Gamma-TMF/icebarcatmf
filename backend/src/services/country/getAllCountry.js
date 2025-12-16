import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllCountriesService extends ServiceBase {
  async run () {
    try {
      const countries = await db.Country.findAndCountAll({
        order: [['name', 'ASC']],
        attributes: ['name', 'countryId', 'code']
      })
      return { countries, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
