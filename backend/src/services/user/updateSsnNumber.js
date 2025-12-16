import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { activityLog } from '../../utils/common'
import { getOne, updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    ssn: { type: 'string' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['userId', 'ssn', 'reason']
}

const constraints = ajv.compile(schema)

export class UpdateUserSsnNumber extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, reason, ssn, favorite, user } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      if (ssn.length !== 9) return this.addError('InvalidSsnLengthError')

      const userExist = await getOne({ model: db.User, data: { userId }, attributes: ['userId', 'ssn', 'uniqueId'] })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      await updateEntity({
        model: db.User,
        data: { ssn: ssn },
        values: { uniqueId: userExist.uniqueId, userId: userExist.userId },
        transaction
      })

      await activityLog({ user, userId, fieldChanged: 'ssn', originalValue: userExist.ssn, changedValue: ssn, remark: reason, favorite, transaction })

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
