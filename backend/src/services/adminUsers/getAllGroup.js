import db from '../../db/models'
import { getAll } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllGroupService extends ServiceBase {
  async run () {
    try {
      const groupNames = await getAll({
        model: db.AdminUser,
        attributes: ['group'],
        group: ['group'],
        order: [['group', 'ASC']]
      })

      if (!groupNames) return this.addError('GroupNotFoundErrorType')

      let responseList = []
      groupNames.forEach(group => { responseList.push(group.group) })
      responseList = responseList.filter(function (el) {
        return el != null
      })
      return { groupNames: responseList, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
