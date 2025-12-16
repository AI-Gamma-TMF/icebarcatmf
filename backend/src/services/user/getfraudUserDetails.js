import db from "../../db/models";
import ServiceBase from "../../libs/serviceBase";
import ajv from "../../libs/ajv";
import { pageValidation } from "../../utils/common";

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    email: { type: 'string' },
    seonId: { type: 'string'}
  },
  required: ['limit', 'pageNo']
}
const constraints = ajv.compile(schema)

export class GetfraudUserDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { FraudLog: FraudLogModel }
    } = this.context
    const { limit, pageNo, email, seonId } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)
      
      let query = {} 
      if (email) query = { ...query, email }
      if (seonId) query = { ...query ,seonId }

      const fraudUserData = await FraudLogModel.findAndCountAll({
        where: query ,
        limit: size,
        offset: (page - 1) * size,
        order: [['createdAt', 'DESC']]
      })

      return { success: true, fraudUserData } 
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}