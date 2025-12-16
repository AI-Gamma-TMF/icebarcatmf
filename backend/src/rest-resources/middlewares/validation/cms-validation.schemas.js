export const getListSchemas = {
  querySchema: {
    $ref: '/cms-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        cmsPages: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const getDynamicListSchemas = {
  querySchema: {
    $ref: '/cms-dynamic.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        keyDescription: { type: 'object' },
        dynamicKeys: { type: 'array' }
      },
      required: ['dynamicKeys']
    }
  }
}

export const getCmsDetailsSchemas = {
  querySchema: {
    $ref: '/cms-details.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        cmsDetails: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const setCmsSchemas = {
  bodySchema: {
    $ref: '/cms-create.json'
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

export const updateCmsSchemas = {
  bodySchema: {
    $ref: '/cms-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updateCmsPage: { type: 'array' }
      },
      required: ['message']
    }
  }
}

export const deleteCmsSchemas = {
  bodySchema: {
    $ref: '/cms-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        updateCmsPage: { type: 'array' },
        success: { type: 'boolean' }
      },
      required: ['success']
    }
  }
}

export const deleteCmsPagesSchemas = {
  bodySchema: {
    $ref: '/cms-delete-page.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['success']
    }
  }
}
