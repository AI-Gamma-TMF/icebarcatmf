import ServiceBase from '../../libs/serviceBase'
import { ELASTIC_INDEX } from '../../libs/elasticClient'
const { Client } = require('@elastic/elasticsearch')

export class ElasticHealthCheckService extends ServiceBase {
  async run () {
    try {
      const URL = 'http://' + process.env.ELASTIC_USER + ':' + process.env.ELASTIC_PASSWORD + '@' + process.env.ELASTIC_URL
      const elasticClient = new Client({
        node: URL + ':' + process.env.ELASTIC_PORT
      })
      const ping = await elasticClient.ping()
      const health = await elasticClient.cluster.health()
      const indexExists = await elasticClient.indices.exists({ index: ELASTIC_INDEX.TRANSACTIONS })
      return { success: true, ping, indexExists, health }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
