export const loginSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['email', 'password']
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

export const adminChildrenSchemas = {
  querySchema: {
    $ref: '/admin-children.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        adminDetails: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const addBalanceSchemas = {
  bodySchema: {
    $ref: '/admin-add-balance.json'
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

export const adminListSchemas = {
  querySchema: {
    $ref: '/admin-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        adminDetails: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const adminCreateSchemas = {
  bodySchema: {
    $ref: '/admin-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        createAdminUser: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const adminUpdateSchemas = {
  bodySchema: {
    $ref: '/admin-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        adminDetail: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const adminDeleteSchemas = {
  bodySchema: {
    $ref: '/admin-delete.json'
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
export const updateProfileSchemas = {
  bodySchema: {
    $ref: '/admin-update-profile.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        adminDetail: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const adminDetailsSchemas = {
  querySchema: {
    $ref: '/admin-details.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        adminDetails: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const adminRolesSchemas = {
  querySchema: {
    type: 'object',
    properties: {
    },
    required: []
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        roles: { type: 'array' }
      },
      required: ['message']
    }
  }
}
export const adminGroupSchemas = {
  querySchema: {
    type: 'object',
    properties: {
    },
    required: []
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        groupNames: { type: 'array' || null }
      },
      required: ['message']
    }
  }
}
export const updateConfigSchemas = {
  bodySchema: {
    $ref: '/admin-config-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateConfig: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const getCalenderViewSchema = {
  querySchema: {
    type: 'object',
    properties: {
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      type: { type: 'array', items: { type: 'string', enum: ['all', 'tournament', 'packages', 'crmBonus', 'crmPromocode', 'purchasePromocode', 'raffles'] } }
    },
    required: ['startDate', 'endDate', 'type']
  }
}
