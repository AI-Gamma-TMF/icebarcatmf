export const getListSchemas = {
  querySchema: {
    $ref: '/email-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        templateCount: { type: 'number' },
        emailTemplateOrder: { type: 'array' },
        emailTemplate: { type: 'object' }
      },
      required: []
    }
  }
}
export const updateEmailSchemas = {
  bodySchema: {
    $ref: '/email-update.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        emailTemplate: { type: 'array' }
      },
      required: ['message']
    }
  }
}
export const deleteEmailSchemas = {
  bodySchema: {
    $ref: '/email-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['success']
    }
  }
}
export const getEmailDetailsSchemas = {
  paramsSchema: {
    $ref: '/email-details.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        emailTemplate: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const updateCredentialsSchemas = {
  bodySchema: {
    $ref: '/credentials-update.json'
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
export const deleteEmailLanguageSchemas = {
  bodySchema: {
    $ref: '/email-language-delete.json'
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
export const getEmailDynamicDataSchemas = {
  paramsSchema: {
    $ref: '/email-dynamic.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        dynamicKeys: { type: 'object' },
        emailTypes: { type: 'object' },
        keyDescription: { type: 'object' },
        EmailTemplate: { type: 'array' }
      },
      required: []
    }
  }
}
export const testEmailSchemas = {
  bodySchema: {
    $ref: '/email-test.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: []
    }
  }
}
export const getCategoryListSchemas = {
  querySchema: {
    $ref: '/email-category-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        emailCategory: { type: 'array' }
      },
      required: []
    }
  }
}
export const createTemplateSchemas = {
  bodySchema: {
    $ref: '/create-email-template.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: []
    }
  }
}
export const updateTemplateSchemas = {
  bodySchema: {
    $ref: '/update-email-template.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        emailTemplate: { type: 'array' },
        message: { type: 'string' }
      },
      required: []
    }
  }
}
