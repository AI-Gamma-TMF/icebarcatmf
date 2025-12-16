export const packageDetailSchemas = {
  querySchema: {
    $ref: '/package-detail.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        packageList: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const packageCreateSchemas = {
  bodySchema: {
    $ref: '/package-create.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        createPackage: { type: 'object' },
        data: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const packageUpdateSchemas = {
  bodySchema: {
    $ref: '/package-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatedPackage: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const packageOrderSchemas = {
  bodySchema: {
    $ref: '/package-order.json'
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

export const packageDeleteSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      packageId: { type: 'number' }
    },
    required: ['packageId']
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

export const packageUserDetailSchemas = {
  querySchema: {
    type: 'object',
    properties: {
      packageId: { type: 'string' },
      limit: { type: ['string', 'null'] },
      pageNo: { type: ['string', 'null'] }
    },
    required: ['packageId']
  }
}

export const packageConfigCreateSchemas = {
  bodySchema: {
    $ref: '/package-create-config.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        createConfigPackage: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const getPlayeridsImportCsvSchemas = {
  bodySchema: {
    $ref: '/package-import-csv.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const getAllPackageListSchemas = {
  querySchema: {
    $ref: '/get-all-package-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        packageList: {
          type: 'object',
          properties: {
            count: { type: 'integer' },
            rows: { type: 'array' }
          }
        }
      },
      required: ['message']
    }
  }
}
