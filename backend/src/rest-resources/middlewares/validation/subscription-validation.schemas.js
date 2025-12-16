
export const createSubscriptionPlanSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      monthlyAmount: { type: 'number', minimum: 1 },
      yearlyAmount: { type: 'number', minimum: 1 },
      weeklyPurchaseCount: { type: 'integer', minimum: 0, maximum: 99999 },
      scCoin: { type: 'integer', minimum: 0 },
      gcCoin: { type: 'integer', minimum: 0 },
      platform: { type: 'string', enum: ['android', 'ios', 'web', 'all'] },
      isActive: { type: 'boolean' },
      specialPlan: { type: 'boolean' },
      thumbnail: { type: ['object', 'null'] },
      features: { type: 'string' }
    },
    required: ['name', 'description', 'monthlyAmount', 'yearlyAmount', 'platform', 'isActive', 'features']
  }
}

export const updateSubscriptionPlanSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      subscriptionId: { type: 'integer' },
      name: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      monthlyAmount: { type: 'number', minimum: 1 },
      yearlyAmount: { type: 'number', minimum: 1 },
      weeklyPurchaseCount: { type: 'integer', minimum: 0, maximum: 99999 },
      scCoin: { type: 'integer', minimum: 0 },
      gcCoin: { type: 'integer', minimum: 0 },
      platform: { type: 'string', enum: ['android', 'ios', 'web', 'all'] },
      isActive: { type: 'boolean' },
      specialPlan: { type: 'boolean' },
      thumbnail: { type: ['object', 'null'] },
      features: { type: 'string' }
    },
    required: ['subscriptionId']
  }
}

export const updateSubscriptionStatusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      subscriptionId: { type: 'integer' },
      isActive: { type: 'boolean' }
    },
    required: ['subscriptionId', 'isActive']
  }
}

export const getAllSubscriptionPlanSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 0 },
      pageNo: { type: 'integer', minimum: 0 },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      subscriptionId: { type: 'integer' },
      isActive: { type: 'boolean' },
      unifiedSearch: { type: ['string', 'null', 'number'] },
      orderBy: { type: 'string', enum: ['subscriptionId', 'name', 'monthlyAmount', 'yearlyAmount', 'scCoin', 'gcCoin', 'isActive', 'weeklyPurchaseCount'] }
    },
    required: ['limit', 'pageNo']
  }
}
export const getSubscriptionPlanDetailSchema = {
  querySchema: {
    type: 'object',
    properties: {
      subscriptionId: { type: 'integer' }
    },
    required: ['subscriptionId']
  }
}

export const subscriptionResponseSchema = {
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: ['object', 'array'] },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message']
    }
  }
}

// Subscription Features
export const getSubscriptionFeatureSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 0 },
      pageNo: { type: 'integer', minimum: 0 },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      orderBy: { type: 'string', enum: ['subscriptionFeatureId', 'name', 'isActive'] },
      subscriptionFeatureId: { type: 'integer' },
      isActive: { type: 'boolean' }
    }
  }
}
export const updateSubscriptionFeatureSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      subscriptionFeatureId: { type: 'integer' },
      name: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      isActive: { type: 'boolean' }
    },
    required: ['subscriptionFeatureId']
  }
}
export const updateSubscriptionFeatureStatusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      subscriptionFeatureId: { type: 'integer' },
      isActive: { type: 'boolean' }
    },
    required: ['subscriptionFeatureId', 'isActive']
  }
}

export const getAllUserSubscriptionSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 0 },
      pageNo: { type: 'integer', minimum: 0 },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      orderBy: { type: 'string', enum: ['userId', 'subscriptionId', 'startDate', 'endDate', 'status', 'planType'] },
      subscriptionId: { type: 'integer' },
      userId: { type: 'integer' },
      status: { type: 'string', enum: ['all', 'active', 'cancelled', 'expired', 'paused', 'pending', 'rejected', 'renewed', 'upgraded'] },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      subscriptionType: { type: 'string', enum: ['all', 'monthly', 'yearly'] },
      autoRenew: { type: 'boolean' },
      transactionId: { type: 'string' },
      search: { type: 'string' }
    },
    required: ['limit', 'pageNo']
  }
}

export const cancelUserSubscriptionSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['cancelled'] },
      userSubscriptionId: { type: 'integer' }
    },
    required: ['userSubscriptionId']
  }
}
