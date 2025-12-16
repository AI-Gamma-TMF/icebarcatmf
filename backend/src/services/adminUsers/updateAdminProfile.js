import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import { encryptPassword, comparePassword } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      pattern: '^[a-zA-Z0-9]*$'
    },
    lastName: {
      type: 'string',
      pattern: '^[a-zA-Z0-9 ]*$'
    },
    oldPassword: {
      type: 'string'
    },
    newPassword: {
      type: 'string'
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class UpdateAdminProfileUser extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.context.req.body
    const {
      firstName, lastName, oldPassword, newPassword
    } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const query = { adminUserId: id }

      const checkAdminUserExist = await getOne({ model: db.AdminUser, data: query, transaction })

      if (!checkAdminUserExist) return this.addError('AdminNotFoundErrorType')

      if (firstName) {
        await updateEntity({
          model: db.AdminUser,
          values: { adminUserId: id },
          data: { firstName },
          transaction: transaction
        })
      }
      if (lastName) {
        await updateEntity({
          model: db.AdminUser,
          values: { adminUserId: id },
          data: { lastName },
          transaction: transaction
        })
      }
      if (oldPassword && newPassword && oldPassword !== '' && newPassword !== '') {
        if (!(await comparePassword(oldPassword, checkAdminUserExist.password))) {
          return this.addError('InvalidPasswordErrorType')
        }
        if ((await comparePassword(oldPassword, encryptPassword(newPassword)))) {
          return this.addError('InvalidNewPasswordErrorType')
        }
        await updateEntity({
          model: db.AdminUser,
          values: { adminUserId: id },
          data: { password: encryptPassword(newPassword) },
          transaction: transaction
        })
      }
      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
