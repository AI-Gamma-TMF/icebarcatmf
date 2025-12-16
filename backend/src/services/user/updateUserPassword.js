import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getOne, updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { validatePassword, encryptPassword, activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    reason: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['userId', 'password', 'reason']
}

const constraints = ajv.compile(schema)

export class UpdateUserPassword extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, reason, password, user } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      if (!validatePassword(password)) return this.addError('PasswordValidationFailedError')

      const userExist = await getOne({ model: db.User, data: { userId }, attributes: ['userId', 'uniqueId'] })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      await updateEntity({
        model: db.User,
        data: { password: encryptPassword(password) },
        values: { uniqueId: userExist.uniqueId, userId: userExist.userId },
        transaction
      })

      await activityLog({ user, userId, fieldChanged: 'password', remark: reason, transaction })

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
