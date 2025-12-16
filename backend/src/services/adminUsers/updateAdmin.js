import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { encryptPassword } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    adminId: { type: 'number' },
    firstName: {
      type: 'string',
      maxLength: 50,
      minLength: 3,
      pattern: '^[a-zA-Z0-9]*$'
    },
    lastName: {
      type: 'string',
      maxLength: 50,
      pattern: '^[a-zA-Z0-9 ]*$'
    },
    email: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    adminUsername: {
      type: 'string',
      pattern: '^[A-Za-z][A-Za-z0-9_]{3,50}$'
    },
    scLimit: { type: ['number', 'null'] },
    gcLimit: { type: ['number', 'null'] },
    group: { type: 'string' },
    permission: { type: 'object' },
    password: { type: 'string', format: 'password' }
  },
  required: ['adminId', 'firstName', 'lastName', 'email', 'adminUsername']
}

const constraints = ajv.compile(schema)

export class UpdateAdminUser extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { adminId, firstName, lastName, email, password, adminUsername, permission, group, scLimit, gcLimit } = this.args
    const {
      dbModels: {
        AdminUser: AdminUserModel,
        AdminUserPermission: AdminUserPermissionModel,
        UserInternalRating: UserInternalRatingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const query = { adminUserId: adminId }

      const checkAdminUserExist = await AdminUserModel.findOne({
        where: query,
        transaction
      })
      if (!checkAdminUserExist) return this.addError('AdminNotFoundErrorType')
      if ((checkAdminUserExist.email !== email) || (checkAdminUserExist.adminUsername !== adminUsername)) {
        email = email.toLowerCase()
        const emailOrUsernameExist = await AdminUserModel.findOne({
          attributes: ['email', 'adminUsername'],
          where: { [Op.or]: { email, adminUsername }, [Op.not]: { adminUserId: adminId } }
        })

        if (emailOrUsernameExist) {
          if (emailOrUsernameExist.email === email) {
            return this.addError('AdminEmailAlreadyExistsErrorType')
          }
          return this.addError('UserNameExistsErrorType')
        }
      }
      scLimit = scLimit || null
      gcLimit = gcLimit || null
      const updatePayload = { firstName, lastName, email, adminUsername, group, scLimit, gcLimit }
      if (password) {
        updatePayload.password = encryptPassword(password)
      }
      const updatedAdminUser = await AdminUserModel.update(updatePayload, {
        where: { adminUserId: adminId },
        transaction
      })

      let updatedPermissions
      if (permission) {
        updatedPermissions = await AdminUserPermissionModel.update(
          { permission },
          {
            where: { adminUserId: adminId },
            transaction
          }
        )
      }
      if (permission && !Object.keys(permission).includes('VipManagedBy')) {
        await UserInternalRatingModel.update(
          { managedBy: null },
          {
            where: { managedBy: adminId },
            transaction
          }
        )
      }

      return { adminDetail: { updatedAdminUser, updatedPermissions }, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
