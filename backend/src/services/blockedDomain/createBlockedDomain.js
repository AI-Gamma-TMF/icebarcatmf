import ajv from '../../libs/ajv'
import redisClient from '../../libs/redisClient'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    domainName: { type: 'string' }
  },
  required: ['domainName']
}

const constraints = ajv.compile(schema)
export class CreateBlockedDomainsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlockedDomains: BlockedDomainsModel },
      sequelizeTransaction: transaction
    } = this.context
    const {
      domainName
    } = this.args

    try {
      const blockedDomain = await BlockedDomainsModel.findOne({
        where: {
          domainName
        }
      })

      if (blockedDomain) return this.addError('BlockedDomainExistsErrorType')

      await BlockedDomainsModel.create({
        domainName
      }, {
        transaction
      })

      await redisClient.client.del('blocked-domains')

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
