export const countryListSchemas = {
  querySchema: {
    $ref: '/country-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        countries: { type: ['object', 'array'] }
      },
      required: ['message']
    }
  }
}
export const countryListForDropdownSchemas = {
  querySchema: {
    $ref: '/country-all.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        countries: { type: ['object', 'array'] }
      },
      required: ['message']
    }
  }
}
export const countryRestrictedSchemas = {
  querySchema: {
    $ref: '/country-restricted.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        restrictedCountries: { type: ['object', 'array'] }
      },
      required: ['message']
    }
  }
}
export const countryUnrestrictedSchemas = {
  querySchema: {
    $ref: '/country-unrestricted.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        unrestrictedCountries: { type: ['object', 'array'] }
      },
      required: ['message']
    }
  }
}
export const countryRestrictedItemSchemas = {
  querySchema: {
    $ref: '/country-restricted-item.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        restrictedItems: { type: ['object', 'array'] }
      },
      required: ['message']
    }
  }
}
export const countryUnRestrictedItemSchemas = {
  querySchema: {
    $ref: '/country-unrestricted-item.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        restrictedItems: { type: ['object', 'array'] }
      },
      required: ['message']
    }
  }
}
export const countryRestrictedAddSchemas = {
  bodySchema: {
    $ref: '/country-restricted-add.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatedCountry: { type: ['array'] }
      },
      required: ['message']
    }
  }
}
export const countryRestrictedItemAddSchemas = {
  bodySchema: {
    $ref: '/country-restricted-item-add.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatedCountry: { type: ['array'] }
      },
      required: ['message']
    }
  }
}
export const countryRestrictedItemDeleteSchemas = {
  bodySchema: {
    $ref: '/country-restricted-item-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatedCountry: { type: ['array'] }
      },
      required: ['message']
    }
  }
}
export const countryRestrictedDeleteSchemas = {
  bodySchema: {
    $ref: '/country-restricted-delete.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        updatedCountry: { type: ['array'] }
      },
      required: ['message']
    }
  }
}

export const addDomainSchema = {
  bodySchema: {
    $ref: '/add-domain.json'
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
