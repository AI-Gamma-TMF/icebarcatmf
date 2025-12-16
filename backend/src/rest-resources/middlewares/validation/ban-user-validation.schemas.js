export const setReasonSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      reasonTitle: { type: 'string' },
      reasonDescription: { type: 'string' },
      isAccountClose: {
        type: ['string'],
        enum: ['true', 'false']
      }
    },
    required: ['reasonTitle', 'reasonDescription']
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

export const updateReasonSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      reasonId: { type: 'number' },
      reasonTitle: { type: 'string' },
      reasonDescription: { type: 'string' }
    },
    required: ['reasonId']
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

export const getReasonListSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      pageNo: { type: 'string' },
      limit: { type: 'string' },
      search: { type: 'string' },
      isActive: {
        type: ['string'],
        enum: ['true', 'false', 'all']
      },
      sort: { type: ['string', 'null'] },
      orderBy: { type: ['string', 'null'] },
      isAccountClose: {
        type: ['string'],
        enum: ['true', 'false']
      }
    },
    required: []
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}

export const getReasonDetailsSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      reasonId: {
        type: 'string',
        pattern: '^[0-9]+$'
      }
    },
    required: ['reasonId']
  }
}

export const deleteReasonSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      reasonId: {
        type: 'number'
      }
    },
    required: ['reasonId']
  }
}
export const defaultResponseSchemas = {
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}

export const updateBanReasonStatusSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      reasonId: { type: 'number' },
      isActive: { type: 'boolean' }
    },
    required: ['reasonId', 'isActive']
  }
}
