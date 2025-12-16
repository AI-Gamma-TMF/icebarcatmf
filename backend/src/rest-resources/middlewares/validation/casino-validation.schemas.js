export const casinoProviderCreateSchemas = {
  bodySchema: {
    $ref: '/casino-provider-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createCasinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoProviderUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-provider-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateCasinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoProviderDeleteSchemas = {
  bodySchema: {
    $ref: '/casino-provider-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}

export const casinoProviderGetAllSchemas = {
  bodySchema: {
    $ref: '/casino-provider-get.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        casinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const casinoCategoryCreateSchemas = {
  bodySchema: {
    $ref: '/casino-category-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createCategory: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-category-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateCategory: { type: 'array' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryGetAllSchemas = {
  bodySchema: {
    $ref: '/casino-category-get.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        casinoProvider: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoCategoryOrderUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-category-order-update.json'
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
export const casinoCategoryDeleteSchemas = {
  bodySchema: {
    $ref: '/casino-category-delete.json'
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
export const getSubCategorySchemas = {
  querySchema: {
    $ref: '/get-sub-category.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        subCategory: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: { type: 'array' }
          }
        }
      },
      required: ['message', 'success', 'subCategory']
    }
  }
}

export const createSubCategorySchemas = {
  bodySchema: {
    $ref: '/create-sub-category.json'
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

export const updateSubCategorySchemas = {
  bodySchema: {
    $ref: '/update-sub-category.json'
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

export const orderSubCategorySchemas = {
  bodySchema: {
    $ref: '/order-sub-category.json'
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

export const deleteSubCategorySchemas = {
  bodySchema: {
    $ref: '/delete-sub-category.json'
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
export const casinoGameCreateSchemas = {
  bodySchema: {
    $ref: '/casino-game-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}

export const addCasinoGameSchemas = {
  bodySchema: {
    $ref: '/add-casino-game.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}

export const casinoGameUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-game-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createGame: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const casinoGameDeleteSchemas = {
  bodySchema: {
    $ref: '/casino-game-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const casinoGameOrderUpdateSchemas = {
  bodySchema: {
    $ref: '/casino-game-order-update.json'
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
export const getCasinoTransactionsSchemas = {
  querySchema: {
    $ref: '/get-casino-transactions.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        transactionDetail: { type: 'object' }
      },
      required: []
    }
  }
}

export const getAggregatorSchemas = {
  querySchema: {
    $ref: '/get-aggregator-schema.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        casinoAggregator: { type: 'object' }
      },
      required: []
    }
  }
}

export const updateAggregatorSchemas = {
  bodySchema: {
    $ref: '/update-aggregator-schema.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: []
    }
  }
}

export const providerOrderSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      order: { type: 'array' }
    },
    required: ['order']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}

export const getGamesSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      masterCasinoGameId: { type: 'string', pattern: '^[0-9]' },
      providerId: { type: 'string', pattern: '^[0-9]' },
      status: { type: 'string', enum: ['true', 'false'] },
      activeOnSite: { type: 'string', enum: ['true', 'false'] },
      operator: { type: 'string', enum: ['<=', '>=', '>', '<', '='] },
      filterBy: {
        type: 'string',
        enum: ['returnToPlayer', 'systemRtp', 'betSum', 'winSum', 'GGR']
      },
      value: { type: 'string', pattern: '^[0-9]' },
      orderBy: { type: 'string' },
      limit: { type: 'string', pattern: '^[0-9]' },
      sort: { type: 'string' },
      pageNo: { type: 'string', pattern: '^[0-9]' }
    }
  }
}

export const hideCasinoAggregatorSchemas = {
  bodySchema: {
    $ref: '/hide-casino-aggregator.json'
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

export const hideCasinoProviderSchemas = {
  bodySchema: {
    $ref: '/hide-casino-provider.json'
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

export const hideCasinoGameSchemas = {
  bodySchema: {
    $ref: '/hide-casino-game.json'
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
