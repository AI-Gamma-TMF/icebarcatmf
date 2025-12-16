import db from '../../db/models'
import ajv from '../../libs/ajv'
import { updateEntity, getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' }
  },
  required: ['id']
}

const constraints = ajv.compile(schema)

export class DisableAuthService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const userExist = await getOne({
        model: db.AdminUser,
        data: { adminUserId: +id },
        transaction
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      await updateEntity({
        model: db.AdminUser,
        values: { adminUserId: +id },
        data: { authEnable: false },
        transaction: transaction
      })
      return { result: { authEnable: false }, success: true, message: SUCCESS_MSG.AUTH_DISABLE }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
