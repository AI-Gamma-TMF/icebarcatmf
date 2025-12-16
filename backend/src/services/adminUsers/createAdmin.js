import ajv from '../../libs/ajv'
import { ROLE_ID } from '../../utils/constants/constant'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { encryptPassword } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    userType: { type: 'string' },
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
    password: { type: 'string', format: 'password' },
    adminUsername: {
      type: 'string',
      maxLength: 50,
      minLength: 3,
      pattern: '^[A-Za-z][A-Za-z0-9_]{2,49}$'
    },
    role: { type: 'string' },
    user: { type: 'object' },
    group: { type: 'string' },
    permission: { type: 'object' },
    adminId: { type: ['number', 'null'] },
    scLimit: { type: ['number', 'null'] },
    gcLimit: { type: ['number', 'null'] }
  },
  required: ['id', 'userType', 'firstName', 'lastName', 'email', 'password', 'adminUsername', 'permission', 'role',
    'user']
}

const constraints = ajv.compile(schema)

export class CreateAdminUser extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { id, firstName, lastName, email, password, adminUsername, permission, role, adminId, user, userType, group, scLimit, gcLimit } = this.args
    let parentId

    if (!+(adminId)) {
      parentId = adminId = id
    }
    const {
      dbModels: {
        AdminUser: AdminUserModel,
        AdminRole: AdminRoleModel,
        AdminUserPermission: AdminUserPermissionModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      email = email.toLowerCase()
      const checkAdminUserExist = await AdminUserModel.findOne({
        where: { email },
        transaction
      })

      if (checkAdminUserExist && checkAdminUserExist.email === email) {
        return this.addError('UserAlreadyExistErrorType')
      }

      const usernameCheck = await AdminUserModel.findOne({
        where: { adminUsername },
        transaction
      })
      if (usernameCheck) return this.addError('UserNameExistsErrorType')

      const adminRole = await AdminRoleModel.findOne({
        where: { name: role },
        transaction
      })
      if (!adminRole) return this.addError('RoleNotFoundErrorType')

      if (+adminRole.roleId === +ROLE_ID.SUPPORT && (+user.roleId === +ROLE_ID.ADMIN || +user.roleId === +ROLE_ID.MANAGER)) {
        if (!adminId) return this.addError('IdRequiredErrorType')
        parentId = adminId
      }

      if (user.roleId > adminRole.roleId) return this.addError('CannotCreateAdminErrorType')

      const adminUser = await AdminUserModel.findOne({
        where: { adminUserId: parentId },
        include: { model: AdminRoleModel },
        transaction
      })

      if (!adminUser) return this.addError('AdminNotFoundErrorType')

      const newAdminUser = {
        firstName,
        lastName,
        email,
        password: encryptPassword(password),
        parentType: userType,
        parentId: parentId,
        adminUsername,
        roleId: adminRole.roleId,
        userPermission: { permission },
        group
      }
      if (scLimit) newAdminUser.scLimit = scLimit
      if (gcLimit) newAdminUser.gcLimit = gcLimit
      const createAdminUser = await AdminUserModel.create(newAdminUser, {
        include: { model: AdminUserPermissionModel, as: 'userPermission' },
        transaction
      })
      delete createAdminUser.password

      return { createAdminUser, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
