import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getAll, getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetUserDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId } = this.args
    if (!(+userId)) {
      return this.addError('InvalidIdErrorType')
    }
    const query = { userId }

    try {
      const userExist = await getOne({ model: db.User, data: query })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      const userDocument = await getAll({
        model: db.UserDocument,
        data: { userId: userExist.userId },
        order: [['createdAt', 'DESC']]
      })

      return { userDocument, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
