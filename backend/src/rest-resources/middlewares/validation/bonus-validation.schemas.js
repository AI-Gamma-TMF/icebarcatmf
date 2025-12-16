export const getBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      search: { type: ['string', 'null'] },
      isActive: { enum: ['true', 'false', 'null'] },
      sort: { type: ['string', 'null'] },
      orderBy: { type: ['string', 'null'] },
      bonusId: { type: ['string', 'null'] },
      bonusType: { enum: ['sc', 'freespin', 'gc', 'both', 'daily bonus', 'welcome bonus', 'monthly bonus'] }
    }
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        bonus: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        },
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message', 'bonus', 'success']
    }
  }
}

export const createBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusName: { type: 'string' },
      bonusType: { enum: ['sc', 'freespin', 'gc', 'both', 'daily bonus', 'welcome bonus', 'monthly bonus'] },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      gcAmount: { type: 'number' },
      scAmount: { type: 'number' },
      fsAmount: { type: 'number' },
      description: { type: 'string' },
      isActive: { type: 'boolean' },
      isUnique: { type: 'boolean' },
      numberOfUser: { type: 'number' }
    },
    required: ['bonusName', 'bonusType', 'startDate', 'endDate', 'description', 'isActive', 'numberOfUser', 'isUnique']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}

export const updateBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'number' },
      bonusName: { type: 'string' },
      bonusType: { enum: ['sc', 'freespin', 'gc', 'both', 'daily bonus', 'welcome bonus', 'monthly bonus'] },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      gcAmount: { type: 'number' },
      scAmount: { type: 'number' },
      fsAmount: { type: 'number' },
      isUnique: { type: 'boolean' },
      description: { type: 'string' },
      numberOfUser: { type: 'number' }
    },
    required: ['bonusId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}

export const deleteBonusSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'string' }
    },
    required: ['bonusId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const statusBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'number' },
      isActive: { enum: [true, false] }
    },
    required: ['isActive', 'bonusId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}
