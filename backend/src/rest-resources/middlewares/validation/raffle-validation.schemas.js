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

export const createRafflesSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      subHeading: { type: 'string' },
      description: { type: 'string' },
      wagerBaseAmt: { type: 'string', pattern: '^(?:([0-9]*[.])?[0-9]+)$' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      prizeAmountGc: { type: 'string', pattern: '^(?:([0-9]*[.])?[0-9]+)$' },
      prizeAmountSc: { type: 'string', pattern: '^(?:([0-9]*[.])?[0-9]+)$' },
      wagerBaseAmtType: { type: 'string', enum: ['SC', 'GC'] },
      isActive: { type: 'string', enum: ['true', 'false'] },
      termsAndConditions: { type: 'string' },
      bannerImg: { type: 'string' },
      moreDetails: { type: 'string' }
    },
    required: [
      'title',
      'description',
      'wagerBaseAmt',
      'wagerBaseAmtType',
      'startDate',
      'endDate',
      'prizeAmountGc',
      'prizeAmountSc'
    ]
  }
}

export const updateRaffleSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'string' },
      title: { type: 'string' },
      subHeading: { type: 'string' },
      description: { type: 'string' },
      wagerBaseAmt: { type: 'string' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      prizeAmountGc: { type: 'string' },
      prizeAmountSc: { type: 'string' },
      wagerBaseAmtType: { type: 'string', enum: ['SC', 'GC'] },
      isActive: { type: 'string', enum: ['true', 'false'] },
      termsAndConditions: { type: 'string' },
      bannerImg: { type: 'string' },
      moreDetails: { type: 'string' }
    },
    required: [
      'raffleId',
      'wagerBaseAmt',
      'startDate',
      'endDate',
      'wagerBaseAmtType',
      'prizeAmountGc',
      'prizeAmountSc'
    ]
  }
}

export const getRaffleSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'string' },
      pageNo: { type: 'string' },
      search: { type: ['string', 'null', 'number'] },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      wagerBaseAmt: { type: 'string' },
      wagerBaseAmtType: { type: 'string' },
      orderBy: { type: 'string' },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      isActive: { type: 'string', enum: ['all', 'true', 'false'] },
      status: { type: 'string', enum: ['all', 'completed', 'ongoing', 'upcoming'] }
    }
  },
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

export const updateRaffleStatusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'number' },
      isActive: { type: 'boolean' }
    },
    required: ['raffleId', 'isActive']
  }
}

export const getRaffleDetailSchema = {
  querySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'string' }
    },
    required: ['raffleId']
  }
}

export const deleteRaffleDetailSchema = {
  querySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'string' }
    },
    required: ['raffleId']
  }
}

export const getUserRaffleSchema = {
  querySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'string' },
      limit: { type: 'string' },
      pageNo: { type: 'string' },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      isActive: { type: 'string', enum: ['all', 'true', 'false'] }
    },
    required: ['raffleId']
  }
}

export const getUserPayoutSearchSchema = {
  querySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'string' },
      entryId: { type: 'string' }
    },
    required: ['raffleId', 'entryId']
  }
}

export const userPayoutSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      raffleId: { type: 'number' },
      scWinAmount: { type: 'number' },
      gcWinAmount: { type: 'number' },
      entryIds: { type: 'array' },
      isCompleted: { type: 'boolean' }
    },
    required: ['raffleId', 'entryIds', 'scWinAmount', 'gcWinAmount', 'isCompleted']
  }
}
