export const deleteImageSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      imageUrl: { type: 'string' }
    },
    required: ['imageUrl']
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

export const uploadImageSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    },
    required: ['name']
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
