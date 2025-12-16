import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { activityLog } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: 'boolean' }
  },
  required: ['user', 'userId', 'reason', 'favorite']
}

const constraints = ajv.compile(schema)

export class AddCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, reason, favorite, user } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      await activityLog({ user, userId, remark: reason, favorite, transaction })

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
