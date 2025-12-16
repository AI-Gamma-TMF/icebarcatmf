export const paymentTransactionSchema = {
  bodySchema: {
    $ref: '/payment-transaction.json'
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

export const redeemRequestsSchema = {
  bodySchema: {
    $ref: '/redeem-transaction.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        requestDetails: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const redeemRequestsActionSchema = {
  bodySchema: {
    $ref: '/redeem-request-action.json'
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

export const refundPurchaseSchema = {
  bodySchema: {
    $ref: '/refund-purchase.json'
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

export const getUsersWithVaultCoinsValidationSchema = {
  bodySchema: {
    $ref: '/get-users-with-vault-coins.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
        vaultDetails: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const updatePaymentProviderStatus = {
  bodySchema: {
    type: 'object',
    properties: {
      isActive: { type: 'boolean' },
      paymentMethodId: { type: 'integer' }
    },
    required: ['isActive', 'paymentMethodId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['success', 'message']
    }
  }
}
