export const createJackpotSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      jackpotName: { type: 'string' },
      maxTicketSize: { type: 'number' },
      seedAmount: { type: 'number' },
      entryAmount: { type: 'number' },
      adminShare: { type: 'number' },
      poolShare: { type: 'number' }
    },
    required: [
      'jackpotName',
      'maxTicketSize',
      'seedAmount',
      'entryAmount',
      'adminShare',
      'poolShare'
    ]
  }
}

export const updateJackpotSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      jackpotId: { type: 'number' },
      jackpotName: { type: 'string' },
      maxTicketSize: { type: 'number' },
      seedAmount: { type: 'number' },
      entryAmount: { type: 'number' },
      adminShare: { type: 'number' },
      poolShare: { type: 'number' },
      winningTicket: { type: 'number' }
    },
    required: ['jackpotId']
  }
}

export const deleteJackpotSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      jackpotId: { type: 'number' }
    },
    required: ['jackpotId']
  }
}

export const getJackpotSchema = {
  querySchema: {
    type: 'object',
    properties: {
      jackpotId: { type: 'string', pattern: '^[0-9]*$' },
      status: { type: 'string', enum: ['upcoming', 'running', 'completed'] },
      search: { type: 'string' },
      pageNo: { type: 'string', pattern: '^[0-9]*$' },
      limit: { type: 'string', pattern: '^[0-9]*$' },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      orderBy: { type: 'string', enum: ['jackpotId', 'jackpotName', 'jackpotPoolEarning', 'userId', 'email', 'username', 'poolAmount', 'gameId', 'status', 'winningTicket', 'seedAmount', 'netRevenue'] }
    }
  }
}

export const getJackpotGraphSchema = {
  querySchema: {
    type: 'object',
    properties: {
      startDate: { anyOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }] },
      endDate: { anyOf: [{ type: 'string', format: 'date' }, { type: 'string', format: 'date-time' }] },
      timeInterval: { type: 'string', enum: ['auto', '30-minutes', 'hour', '3-hours', '12-hours', 'day', '3-days', 'week', 'month'] }
    },
    required: ['startDate', 'endDate', 'timeInterval']
  }
}

export const jackpotRnGSchema = {
  querySchema: {
    type: 'object',
    properties: {
      maxTicketSize: { type: 'string' },
      seedAmount: { type: 'string' },
      entryAmount: { type: 'string' },
      adminShare: { type: 'string' },
      poolShare: { type: 'string' }
    },
    required: ['maxTicketSize', 'seedAmount', 'entryAmount', 'adminShare', 'poolShare']
  }
}
