
import ajv from '../libs/ajv'

const exportCenterSchema = {
  type: 'object',
  properties: {
    type: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sortBy: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    status: { type: ['string', 'null'] },
    timezone: { type: 'string' }

  }
}

ajv.addSchema(exportCenterSchema, '/export-center.json')