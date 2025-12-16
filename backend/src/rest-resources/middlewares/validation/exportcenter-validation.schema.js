export const exportCenterSchema = {
    bodySchema: {
      $ref: '/export-center.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          transactionDetail: { type: 'object' }
        },
        required: ['message']
      }
    }
  }

  