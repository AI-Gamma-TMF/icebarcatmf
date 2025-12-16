import { BONUS_TYPE } from '../../../utils/constants/constant'

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
      bonusType: {
        enum: [
          'sc',
          'freespin',
          'gc',
          'both',
          'daily bonus',
          'welcome bonus',
          'postal-code-bonus'
        ]
      }
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

/* const createBonusObject = {
  type: 'object',
  properties: {
    bonusName: { type: 'string' },
    day: { type: 'number' },
    startDate: { type: 'string' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    fsAmount: { type: 'number' },
    description: { type: 'string' },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    }
  },
  required: ['bonusName', 'startDate', 'description', 'isActive']
} */

export const createBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusType: { enum: Object.values(BONUS_TYPE) },
      bonuses: { type: ['string', 'object', 'array'] },
      day_1_images: { type: ['object'] },
      day_2_images: { type: ['object'] },
      day_3_images: { type: ['object'] },
      day_4_images: { type: ['object'] },
      day_5_images: { type: ['object'] },
      day_6_images: { type: ['object'] },
      day_7_images_cc: { type: ['object'] },
      day_7_images_gc: { type: ['object'] }
    },
    required: ['bonusType']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        error: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const updateBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      bonusId: { type: 'string' },
      bonusName: { type: 'string' },
      bonusType: { enum: Object.values(BONUS_TYPE) },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      gcAmount: { type: 'number' },
      scAmount: { type: 'number' },
      fsAmount: { type: 'number' },
      isActive: { type: 'boolean' },
      isUnique: { type: 'boolean' },
      minimumPurchase: { type: 'string' },
      percentage: { type: 'string' },
      description: { type: 'string' },
      numberOfUser: { type: 'number' },
      day: { type: 'number' },
      bonusImg: { type: 'string' },
      btnText: { type: 'string' },
      termCondition: { type: 'string' },
      scSpinLimit: { type: 'string' },
      gcSpinLimit: { type: 'string' },
      postalCodeIntervalInMinutes: { type: 'integer' },
      postalCodeValidityInDays: { type: 'integer' },
      scratchCardId: { type: ['string', 'null'] },
      freeSpinId: { type: ['string', 'null'] }
    },
    required: []
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

export const updateSpinWheelSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      wheelDivisionId: { type: 'string' },
      sc: { type: 'number', minimum: 0 },
      gc: { type: 'number', minimum: 0 },
      isAllow: { type: 'boolean' },
      playerLimit: { type: ['integer', 'null'] },
      priority: { type: 'integer' }
    },
    required: ['wheelDivisionId']
  }
}

export const createStreakDailyBonusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      bonusName: { type: 'string' },
      startDate: { type: 'string' },
      gcAmount: { type: 'string' },
      scAmount: { type: 'string' },
      description: { type: 'string' },
      day: { type: ['string', 'null'] },
      btnText: { type: ['string', 'null'] },
      termCondition: { type: ['string', 'null'] },
      isActive: { type: 'string', enum: ['true', 'false'] }
    },
    required: ['day', 'scAmount', 'gcAmount', 'description', 'bonusName']
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

// Scratch Card
export const createScratchCardSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      scratchCardId: { type: ['integer', 'null'] },
      scratchCardName: { type: 'string', minLength: 1, pattern: '^(?!\\s*$).+' },
      message: { type: ['string', 'null'] },
      isActive: { type: 'boolean' },
      budgets: {
        type: ['array', 'null'],
        items: {
          type: 'object',
          properties: {
            budgetAmount: { type: 'number' },
            budgetType: { type: 'string' },
            periodStart: { type: 'string', format: 'date-time' },
            periodEnd: { type: 'string', format: 'date-time' },
            isActive: { type: 'boolean' }
          }
        }
      },
      config: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: ['integer', 'null'] },
            rewardType: { type: 'string' },
            minReward: { type: 'number', maximum: 9999999999 },
            maxReward: { type: 'number', maximum: 9999999999 },
            percentage: { type: 'integer', minimum: 1 },
            playerLimit: { type: ['integer', 'null'], maximum: 9999999999 },
            isActive: { type: 'boolean' },
            imageUrl: { type: ['string', 'null'] },
            message: { type: ['string', 'null'] }
          },
          required: ['rewardType', 'minReward', 'maxReward', 'percentage']
        }
      }
    },
    required: ['scratchCardName']
  }
}

export const updateScratchCardSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      scratchCardId: { type: 'integer' },
      configId: { type: ['integer', 'null'] },
      scratchCardName: { anyOf: [{ type: 'string', minLength: 1, pattern: '^(?!\\s*$).+' }, { type: 'null' }] },
      minReward: { type: ['number', 'null'], maximum: 9999999999 },
      maxReward: { type: ['number', 'null'], maximum: 9999999999 },
      rewardType: { type: ['string', 'null'] },
      playerLimit: { type: ['integer', 'null'], maximum: 9999999999 },
      percentage: { type: ['integer', 'null'], minimum: 1 },
      isActive: { type: ['boolean', 'null'] },
      image: { type: ['object', 'null'] },
      imageUrl: { type: ['string', 'null'], format: 'uri', minLength: 1 },
      message: { type: ['string', 'null'] }
    },
    required: ['scratchCardId']
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

export const createBudgetsSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      scratchCardId: { type: 'integer' },
      budgetAmount: { type: ['number', 'null'], maximum: 9999999999 },
      budgetType: { type: 'string' },
      isActive: { type: ['boolean', 'null'] }
    },
    required: ['scratchCardId']
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

export const updateOrResetBudgetsSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      scratchCardId: { type: 'integer' },
      budgetId: { type: 'integer' },
      budgetAmount: { type: ['number', 'null'], maximum: 9999999999 },
      actionType: { type: 'string' }
    },
    required: ['scratchCardId', 'budgetId']
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
