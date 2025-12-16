export const defaultResponseSchema = {
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

export const createTournamentSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      entryAmount: { type: 'number', minimum: 0 },
      entryCoin: { type: 'string', enum: ['SC', 'GC'] },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      gameId: { type: 'array', items: { type: 'integer' }, minItems: 1, maxItems: 50 },
      winGc: { type: 'number', minimum: 0 },
      winSc: { type: 'number', minimum: 0 },
      vipTournament: { type: 'boolean', default: false },
      allowedUsers: { type: 'array', items: { type: 'integer' }, minItems: 1 },
      playerLimit: { type: ['integer', 'null'] },
      // isActive: { type: 'string', enum: ['true', 'false'] },
      winnerPercentage: { type: 'array', items: { type: 'number' }, minItems: 1, maxItems: 100 },
      tournamentImg: { type: ['object', 'null'] },
      imageUrl: { type: 'string', format: 'uri', minLength: 1 },
      vipTournamentTitle: { type: 'string', maxLength: 50 },
      isSubscriberOnly: { type: 'boolean', default: false }
    },
    required: [
      'title',
      'description',
      'entryAmount',
      'entryCoin',
      'startDate',
      'endDate',
      'gameId',
      'winGc',
      'winSc',
      'playerLimit',
      // 'isActive',
      'winnerPercentage',
      'isSubscriberOnly'
    ]
  }
}

export const updateTournamentSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer' },
      title: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      entryAmount: { type: 'number', minimum: 0 },
      entryCoin: { type: 'string', enum: ['SC', 'GC'] },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      gameId: { type: 'array', items: { type: 'integer' }, minItems: 1, maxItems: 50 },
      winGc: { type: 'number', minimum: 0 },
      winSc: { type: 'number', minimum: 0 },
      vipTournament: { type: 'boolean', default: false },
      allowedUsers: { type: 'array', items: { type: 'integer' } },
      playerLimit: { type: ['integer', 'null'] },
      removeAllAllowedUsers: { type: 'boolean', default: false },
      winnerPercentage: { type: 'array', items: { type: 'number' }, minItems: 1, maxItems: 100 },
      vipTournamentTitle: { type: 'string', maxLength: 50 },
      isSubscriberOnly: { type: 'boolean', default: false }
    },
    required: ['tournamentId']
  }
}

export const getTournamentSchema = {
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 0 },
      pageNo: { type: 'integer', minimum: 0 },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      entryAmount: { type: 'number', minimum: 0 },
      orderBy: { type: 'string', enum: ['tournamentId', 'entryAmount', 'startDate', 'endDate', 'winSc', 'winGc', 'status', 'title', 'entryCoin'] },
      sort: { type: 'string', enum: ['ASC', 'DESC'] },
      status: { type: 'string', enum: ['0', '1', '2', '3', 'all'] },
      timezone: { type: 'string', minLength: 1 },
      unifiedSearch: { type: ['string', 'null', 'number'] }
    }
  }
}

export const updateTournamentStatusSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 }
      // isActive: { type: 'boolean' }
    },
    required: ['tournamentId'] // 'isActive
  }
}

export const getTournamentDetailSchema = {
  paramsSchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 }
    },
    required: ['tournamentId']
  },
  querySchema: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 0 },
      pageNo: { type: 'integer', minimum: 0 },
      csvDownload: { type: 'boolean' },
      timezone: { type: 'string', minLength: 1 },
      search: { type: ['string', 'null'] }
    },
    required: []
  }
}

export const updateBootPlayerSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 },
      userId: { type: 'integer', minimum: 0 },
      isBooted: { type: 'boolean' }
    },
    required: ['tournamentId', 'userId', 'isBooted']

  }
}

export const createFreeEntryInTournamentPlayerSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 },
      email: { type: 'string', format: 'email' }
    },
    required: ['tournamentId', 'email']
  }
}

export const getTournamentGamesSchema = {
  querySchema: {
    type: 'object',
    properties: {
      pageNo: { type: 'integer', minimum: 0 },
      limit: { type: 'integer', minimum: 0 },
      search: { type: 'string', minLength: 1 },
      // isActive: { type: 'string', enum: ['true', 'false'] },
      tournamentId: { type: 'integer', minimum: 0 },
      providerId: { type: 'string' },
      gameSubCategoryId: { type: 'string' },
      gameIds: { type: 'string' },
      excludeTournamentGames: { type: 'boolean' },
      orderBy: { type: 'string', enum: ['tournamentId', 'ASC'] }
    }
  }
}
export const tournamentOrderUpdateSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      order: { type: 'array', items: { type: 'integer' }, minItems: 1 }
    },
    required: ['order']
  }
}
export const createTournamentPayoutSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 }
      // users: { type: 'array', items: { type: 'integer' } }
    },
    required: ['tournamentId']
  }
}

export const getTournamentDashboardSchema = {
  paramsSchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 }
    },
    required: ['tournamentId']
  },
  querySchema: {
    type: 'object',
    properties: {
      timezone: { type: 'string', minLength: 1 }
    },
    required: []
  }
}
export const getTournamentStatsDashboardSchema = {
  paramsSchema: {
    type: 'object',
    properties: {
      tournamentId: { type: 'integer', minimum: 0 }
    },
    required: ['tournamentId']
  },
  querySchema: {
    type: 'object',
    properties: {
      userId: { type: 'integer', minimum: 0 },
      gameId: { type: 'integer', minimum: 0 },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      timezone: { type: 'string', minLength: 1 }
    },
    required: []
  }

}

export const addVipTournamentUsersFromCsvSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      vipTournament: { type: 'boolean' },
      file: { type: ['object'] }
    },
    required: ['vipTournament']
  }
}
