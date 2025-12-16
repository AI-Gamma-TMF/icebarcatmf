import db from '../../db/models'
import { getAll } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { ERRORS, ERROR_MSG } from '../../utils/constants/errors'

export class GetRolesService extends ServiceBase {
  async run () {
    try {
      let roles = await getAll({ model: db.AdminRole })

      if (!roles) return this.addError(ERRORS.NOT_FOUND, ERROR_MSG.NOT_FOUND)

      roles = roles.filter(role => role.name !== 'Affiliate' && role.id !== 4) 
      
      return { roles, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error)
    }
  }
}
