import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteEntity, getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    adminId: { type: 'number' }
  },
  required: ['adminId']
}

const constraints = ajv.compile(schema)

export class DeleteAdminUser extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      adminId
    } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const query = { adminUserId: adminId }

      const checkAdminUserExist = await getOne({ model: db.AdminUser, data: query, transaction })

      if (!checkAdminUserExist) return this.addError('AdminNotFoundErrorType')

      const checkChildAdminUserExist = await getOne({ model: db.AdminUser, data: { parentId: adminId, parentType: 'admin' }, transaction })

      if (checkChildAdminUserExist) return this.addError('ActionNotAllowedErrorType')

      await deleteEntity({
        model: db.AdminUserPermission,
        values: { adminUserId: adminId },
        transaction
      })
      await deleteEntity({
        model: db.AdminUser,
        values: { adminUserId: adminId },
        transaction
      })
      return { message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
