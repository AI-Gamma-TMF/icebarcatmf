import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { getAll } from '../../utils/crud'
import db from '../../db/models'
import { Op } from 'sequelize'

export class GetCityService extends ServiceBase {
  async run () {
    const {
      search = '', stateId = ''
    } = this.args
    let data = {}
    if (stateId !== '') {
      data = { stateId }
    }
    if (search !== '') {
      data = { ...data, name: { [Op.iLike]: `%${search}%` } }
    }
    const city = await getAll({
      attributes: ['name', 'city_id'],
      model: db.City,
      data: data
    })

    return { success: true, data: city, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
