import { ELASTIC_MAPPINGS } from '../utils/elastic'
import { getElasticURL } from '../utils/common'
const { Client } = require('@elastic/elasticsearch')

const ELASTIC_INDEX = {
  TRANSACTIONS: 'moneyFactory-game-transactions'
}

let elasticClient
const startElastic = async () => {
  try {
    /* Todo For SSL Elastic connection
    elasticClient = new Client({
      node: process.env.ELASTIC_URL,
      auth: {
        username: process.env.ELASTIC_USER,
        password: process.env.ELASTIC_PASSWORD
      },
      tls: {
        ca: fs.readFileSync(process.env.ELASTIC_HTTP_CRT_PATH),
        rejectUnauthorized: false
      }
     }) */
    const URL = getElasticURL()
    elasticClient = new Client({
      node: URL + ':' + process.env.ELASTIC_PORT
    })

    // Todo check connection
    await elasticClient.cluster.health()

    // Todo check index exist if not then create index
    if (!await elasticClient.indices.exists({ index: ELASTIC_INDEX.TRANSACTIONS })) {
      await elasticClient.indices.create({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS]
      })
    }
  } catch (error) {
    // Todo logger.error('Elastic Connection error : ' + error.message)
  }
}

startElastic()

export { elasticClient, ELASTIC_INDEX }
