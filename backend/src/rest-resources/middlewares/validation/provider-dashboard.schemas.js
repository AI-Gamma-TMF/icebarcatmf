export const getProviderRateSchema = {
  querySchema: {
    type: 'object',
    properties: {
      providerId: { type: 'string', pattern: '^[0-9]*$' },
      pageNo: { type: 'string', pattern: '^[0-9]*$' },
      limit: { type: 'string', pattern: '^[0-9]*$' },
      rateId: { type: 'string', pattern: '^[0-9]*$' },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      orderBy: { type: 'string', enum: ['rateId', 'ggrMinimum', 'ggrMaximum', 'rate'] }
    },
    required: []
  }
}

export const createProviderRateSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      aggregatorId: { type: 'number' },
      providerId: { type: 'number' },
      rateEntries: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ggrMinimum: { type: 'number' },
            ggrMaximum: { type: ['number', 'null'] },
            rate: { type: 'number' }
          },
          required: ['ggrMinimum', 'ggrMaximum', 'rate']
        },
        minItems: 1
      }
    },
    required: ['aggregatorId', 'providerId', 'rateEntries']
  }
}

export const updateProviderRateSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      aggregatorId: { type: 'number' },
      providerId: { type: 'number' },
      rateEntries: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ggrMinimum: { type: 'number' },
            ggrMaximum: { type: ['number', 'null'] },
            rate: { type: 'number' }
          },
          required: ['ggrMinimum', 'ggrMaximum', 'rate']
        },
        minItems: 1
      }
    },
    required: ['aggregatorId', 'providerId', 'rateEntries']
  }
}

export const deleteProviderRateSchema = {
  bodySchema: {
    properties: {
      providerId: { type: 'number' }
    },
    required: ['providerId']
  }
}

export const getProviderDashboardDetailSchema = {
  querySchema: {
    type: 'object',
    properties: {
      masterCasinoProviderId: { type: ['string', 'null'] },
      masterGameAggregatorId: { type: ['string', 'null'] },
      startDate: { type: ['string', 'null'] },
      endDate: { type: ['string', 'null'] },
      timezone: { type: ['string', 'null'] }
    },
    required: []
  }
}
