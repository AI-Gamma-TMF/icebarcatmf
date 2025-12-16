import ajv from '../libs/ajv'

const statusSchema = {
  type: 'object',
  properties: {
    code: { type: 'string' },
    status: { type: 'boolean' },
    cmsPageId: { type: 'number' },
    masterCasinoProviderId: { type: 'number' },
    adminId: { type: 'number' },
    masterGameSubCategoryId: { type: 'number' },
    masterGameCategoryId: { type: 'number' },
    masterCasinoGameId: { type: 'number' },
    bonusId: { type: 'number' },
    userId: { type: 'number' },
    pageBannerId: { type: 'number' },
    reason: { type: 'string' },
    favorite: { type: ['boolean', 'null'] },
    masterGameAggregatorId: { type: 'number' },
    freeSpinAllowed: { type: ['boolean', 'null'] }
  },
  required: ['code', 'status']
}

ajv.addSchema(statusSchema, '/status.json')
