import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'

export class UserGroup extends ServiceBase {
  async run () {
    try {
      const userGroups = await db.PlayerGroup.findAll({ attributes: ['groupId', 'groupName'] })
      return { success: true, groups: userGroups }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
