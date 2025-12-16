export const updatePostalCodeSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      status: { type: 'string' },
      postalCodeId: { type: 'string' },
      bonusType: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' },
      postalCode: { type: 'string' }

    },
    required: ['userId', 'status', 'postalCodeId', 'bonusType']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: {
          type: 'object'
        },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
