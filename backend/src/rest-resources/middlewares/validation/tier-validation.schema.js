export const getAllTierSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: ['string', 'null'] },
      level: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] },
      search: { type: ['string', 'null', 'number'] },
      orderBy: { type: ['string', 'null'] },
      sort: { type: ['string', 'null'], enum: ['ASC', 'DESC'] },
      isActive: { type: ['string', 'null'], enum: ['true', 'false', 'all'] }
    }
  },

  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        tiers: { type: 'object' },
        totalActiveTiers: { type: 'number' }
      },
      required: ['tiers']
    }
  }
}

export const createTierSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      requiredXp: { type: 'string' },
      bonusGc: { type: 'string' },
      bonusSc: { type: 'string' },
      isActive: { type: 'string', enum: ['true', 'false'] },
      weeklyBonusPercentage: { type: 'string' },
      monthlyBonusPercentage: { type: 'string' },
      icon: { type: 'string' },
      isWeekelyBonusActive: { type: 'string', enum: ['true', 'false'] },
      isMonthlyBonusActive: { type: 'string', enum: ['true', 'false'] }
    },
    required: [
      'name',
      'requiredXp',
      'bonusGc',
      'bonusSc',
      'isActive',
      'weeklyBonusPercentage',
      'monthlyBonusPercentage'
    ]
  },

  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['success', 'message']
    }
  }
}

export const updateTierSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tierId: { type: 'string' },
      name: { type: 'string' },
      requiredXp: { type: 'string' },
      bonusGc: { type: 'string' },
      bonusSc: { type: 'string' },
      weeklyBonusPercentage: { type: 'string' },
      monthlyBonusPercentage: { type: 'string' },
      icon: { type: 'string' },
      isWeekelyBonusActive: { type: 'string', enum: ['true', 'false'] },
      isMonthlyBonusActive: { type: 'string', enum: ['true', 'false'] }
    },
    required: [
      'tierId',
      'name',
      'requiredXp',
      'bonusGc',
      'bonusSc',
      'weeklyBonusPercentage',
      'monthlyBonusPercentage'
    ]
  },

  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['success', 'message']
    }
  }
}

export const updateTierStatusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tierId: { type: 'string' },
      isActive: { type: 'boolean' }
    },
    required: ['tierId', 'isActive']
  },

  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['success', 'message']
    }
  }
}

export const getTierUsersSchema = {
  paramsSchema: {
    type: 'object',
    properties: {
      tierId: { type: ['string'] },
      search: { type: ['string', 'null', 'number'] }
    },
    required: ['tierId']
  },

  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        tierUserDetail: { type: 'object' }
      },
      required: ['tierUserDetail']
    }
  }
}

export const getTierDetailSchema = {
  paramsSchema: {
    type: 'object',
    properties: {
      tierId: { type: ['string'] }
    },
    required: ['tierId']
  },

  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        tierDetail: { type: 'object' }
      },
      required: ['tierDetail']
    }
  }
}
