export const getAdminCreditCoinsSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      pageNo: { type: 'string' },
      limit: { type: 'string' },
      search: { type: 'string' },
      sort: { type: ['string', 'null'] },
      orderBy: { type: ['string', 'null'] }
    },
    required: ['pageNo', 'limit']
  }
}

export const getAdminCreditUserSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      pageNo: { type: 'string' },
      limit: { type: 'string' },
      search: { type: 'string' },
      sort: { type: ['string', 'null'] },
      orderBy: { type: ['string', 'null'] },
      adminUserId: { type: 'string' },
      emailSearch: { type: ['string', 'null'] },
      idSearch: { type: ['string', 'null'] },
      firstNameSearch: { type: ['string', 'null'] }
    },
    required: ['adminUserId']
  }
}
