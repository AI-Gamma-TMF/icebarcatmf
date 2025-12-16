import ajv from '../../libs/ajv'
import redisClient from '../../libs/redisClient'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    domainId: { type: 'number' }
  },
  required: ['domainId']
}

const constraints = ajv.compile(schema)
export class DeleteBlockedDomainService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { BlockedDomains: BlockedDomainsModel },
      sequelizeTransaction
    } = this.context

    const { domainId } = this.args

    const blockedDomain = await BlockedDomainsModel.findOne({
      where: {
        domainId
      }
    })

    if (!blockedDomain) return this.addError('BlockedDomainNotFoundErrorType')

    await BlockedDomainsModel.destroy({
      where: { domainId },
      transaction: sequelizeTransaction
    })

    await redisClient.client.del('blocked-domains')

    return {
      success: true,
      message: SUCCESS_MSG.DELETE_SUCCESS
    }
  }
}
