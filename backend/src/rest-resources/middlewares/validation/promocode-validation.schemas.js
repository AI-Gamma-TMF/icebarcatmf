
export const promocodePackagesSchema = {
  querySchema: {
    type: 'object',
    properties: {
      promocodeId: { type: 'string', pattern: '^[0-9]*$' },
      pageNo: { type: 'string', pattern: '^[0-9]*$' },
      limit: { type: 'string', pattern: '^[0-9]*$' },
      isArchive: { type: ['string', 'null'] },
      packageId: { type: ['string', 'null'] },
      amount: { type: ['string', 'null'] },
      gcCoin: { type: ['string', 'null'] },
      scCoin: { type: ['string', 'null'] },
      isActive: { type: ['string', 'null'] }
    },
    required: ['promocodeId']
  }
}

export const appliedHistorySchema = {
  querySchema: {
    type: 'object',
    properties: {
      promocodeId: { type: 'string', pattern: '^[0-9]*$' },
      pageNo: { type: 'string', pattern: '^[0-9]*$' },
      limit: { type: 'string', pattern: '^[0-9]*$' },
      isArchive: { type: 'boolean', enum: [true, false] },
      transactionId: { type: 'string', format: 'uuid' },
      packageId: { type: ['integer', 'null'] },
      isFirstDeposit: { type: 'boolean', enum: [true, false] },
      unifiedSearch: { type: ['string', 'null', 'number'] },
      isActive: { type: 'string', enum: ['true', 'false', 'all'] },
      csvDownload: { type: 'boolean' },
      timezone: { type: 'string', minLength: 1 }
    },
    required: ['promocodeId']
  }
}

export const expiredPromocodeSchema = {
  querySchema: {
    type: 'object',
    properties: {
      promocode: { type: 'string' },
      pageNo: { type: 'string', pattern: '^[0-9]*$' },
      limit: { type: 'string', pattern: '^[0-9]*$' }
    },
    required: ['promocode']
  }
}

export const getPromocodeSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: {
        type: ['string', 'null']
      },
      pageNo: {
        type: ['string', 'null']
      },
      promocodeSearch: {
        type: ['string', 'null', 'number']
      },
      status: {
        type: ['string', 'null'], enum: ['0', '1', '2', '3', 'all']
      },
      crmPromocode: {
        type: ['string', 'null']
      },
      name: {
        type: ['string', 'null']
      },
      promotionType: {
        type: ['string', 'null']
      },
      discountPercentage: {
        type: ['string', 'null']
      },
      maxUsersAvailed: {
        type: ['string', 'null']
      },
      validTill: {
        type: ['string', 'null']
      },
      validFrom: {
        type: ['string', 'null']
      },
      timezone: {
        type: ['string', 'null']
      },
      isArchive: { type: 'boolean', enum: [true, false] },
      orderBy: { type: ['string', 'null'] },
      sort: { type: ['string', 'null'] }
    },
    required: []
  }

}

export const createPromocodeSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      promocode: { type: 'string', minLength: 1 },
      maxUsersAvailed: { type: ['integer', 'null'] },
      perUserLimit: { type: 'integer' },
      isDiscountOnAmount: { type: 'boolean', enum: [true, false] },
      discountPercentage: { type: 'number', minimum: 1, maximum: 100 },
      packages: { type: 'array', items: { type: 'integer' } },
      crmPromocode: { type: 'boolean', enum: [true, false] },
      promotionName: { type: ['string', 'null'] },
      promotionType: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      validFrom: { type: ['string', 'null'], format: 'date-time' },
      validTill: { type: ['string', 'null'], format: 'date-time' }
    },
    required: ['promocode', 'discountPercentage', 'perUserLimit']
  }
}

export const updatePromocodeSchema = {
  bodySchema: {
    properties: {
      promocodeId: { type: ['integer', 'null'] },
      promocode: { type: 'string', minLength: 1 },
      validFrom: { type: ['string', 'null'], format: 'date-time' },
      validTill: { type: ['string', 'null'], format: 'date-time' },
      maxUsersAvailed: { type: ['integer', 'null'] },
      perUserLimit: { type: 'integer' },
      isDiscountOnAmount: { type: 'boolean', enum: [true, false] },
      discountPercentage: { type: 'number', minimum: 1, maximum: 100 },
      packages: { type: ['array', 'null'], items: { type: 'integer' } },
      description: { type: ['string', 'null'] },
      promotionName: { type: ['string', 'null'] }
    },
    required: ['promocodeId']
  }
}

export const deletePromocodeSchema = {
  bodySchema: {
    properties: {
      promocodeId: { type: 'integer' },
      promocode: { type: 'string', minLength: 1 }
    },
    required: ['promocode']
  }
}

export const addPromocodesFromCsvSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      timezone: { type: 'string', minLength: 1 },
      file: { type: ['object'] }
    },
    required: ['timezone']
  }
}

export const createReusePromocodeSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      promocodeId: { type: 'integer' },
      validTill: { type: ['string', 'null'], format: 'date-time' },
      validFrom: { type: ['string', 'null'], format: 'date-time' },
      maxUsersAvailed: { type: ['integer', 'null'] },
      perUserLimit: { type: 'integer' }
    },
    required: ['promocodeId', 'validTill', 'validFrom']
  }
}
