import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    limit: { type: 'string' },
    pageNo: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetEmailCommsDetails extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, limit, pageNo } = this.args
    const { page, size } = pageValidation(pageNo, limit)

    try {
      const user = await getOne({ model: db.User, data: { userId } })
      if (!user) return this.addError('UserNotExistsErrorType')

      const emailCommsDetails = await db.EmailLog.findAndCountAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: ((page - 1) * size)
      })

      return { success: true, emailCommsDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
