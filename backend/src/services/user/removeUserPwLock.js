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
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['userId', 'reason']
}

const constraints = ajv.compile(schema)

export class RemoveUserPwLock extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, reason, userId, favorite } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const userExist = await getOne({
        model: db.User,
        data: { userId },
        attributes: ['passwordAttempt', 'uniqueId', 'userId']
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      if (userExist.passwordAttempt < 5) return this.addError('UserNotLockedErrorType')

      await updateEntity({
        model: db.User,
        data: { passwordAttempt: 0 },
        values: { uniqueId: userExist.uniqueId, userId: userExist.userId },
        transaction
      })

      await activityLog({ user, userId, fieldChanged: 'Password Attempt Count', originalValue: userExist.passwordAttempt, changedValue: 0, remark: reason, favorite, transaction })

      return { message: SUCCESS_MSG.UNLOCK_PLAYER_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
