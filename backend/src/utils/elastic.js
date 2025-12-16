import { Op } from 'sequelize'
import { getOne } from './crud'
import db from '../db/models'
import logger from '../libs/logger'
import { filterByDateCreatedAt, getOtherCurrenciesAmount, getGameAggregatorAndProvider } from './common'
import { elasticClient, ELASTIC_INDEX } from '../libs/elasticClient'
import { ACTION, AMOUNT_TYPE, ROLE, STATUS_VALUE, TRANSACTION_STATUS, TRANSACTION_TYPE } from './constants/constant'

export const internationalNumberFormatter = (number) => {
  return new Intl.NumberFormat('en-EU').format(number)
}

export const MODEL_TYPE = {
  CASINO: 'casino-transaction',
  BANKING: 'transaction-banking'
}

export const ELASTIC_MAPPINGS = {
  'moneyFactory_game-transactions': {
    mappings: {
      properties: {
        modelType: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        transactionId: {
          type: 'integer'
        },
        transactionIdString: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        transactionType: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        parentId: {
          type: 'float'
        },
        parentType: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        totalAmount: {
          type: 'float'
        },
        amountType: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        transactionAmount: {
          type: 'float'
        },
        transactionAmountPrimary: {
          type: 'float'
        },
        afterBalance: {
          type: 'float'
        },
        beforeBalance: {
          type: 'float'
        },
        nonCashAmount: {
          type: 'float'
        },
        conversionRate: {
          type: 'float'
        },
        status: {
          type: 'integer'
        },
        isFirstDeposit: {
          type: 'boolean'
        },
        reindexed: {
          type: 'boolean'
        },
        kycStatus: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        statusValue: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        description: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        currencyCode: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        countryCode: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        gameAggregator: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        gameIdentifier: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          },
          fielddata: true
        },
        gameProviderId: {
          type: 'integer'
        },
        gameProvider: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          },
          fielddata: true
        },
        paymentProvider: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          },
          fielddata: true
        },
        paymentMethod: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        paymentTransactionId: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        paymentTransactionName: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        bonusId: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        sourceCurrency: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        targetCurrency: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        amountInOtherCurrencies: {
          properties: {
            EUR: {
              type: 'float'
            },
            INR: {
              type: 'float'
            },
            JPY: {
              type: 'float'
            },
            USD: {
              type: 'float'
            }
          }
        },
        createdAt: {
          type: 'date'
        },
        updatedAt: {
          type: 'date'
        },
        user: {
          properties: {
            userType: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256
                }
              }
            },
            userId: {
              type: 'integer'
            },
            walletId: {
              type: 'integer'
            },
            email: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256
                }
              }
            },
            firstName: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256
                }
              }
            },
            lastName: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256
                }
              }
            },
            username: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256
                }
              }
            },
            createdAt: {
              type: 'date'
            },
            updatedAt: {
              type: 'date'
            }
          }
        }
      }
    }
  }
}

export const getReportFilterDates = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const yesterday = d.toISOString().substring(0, 10)
  const today = (new Date()).toISOString().substring(0, 10)

  const date = new Date()
  const offset = date.getTimezoneOffset()

  let monthStartDate = new Date((new Date(date.getFullYear(), date.getMonth(), 1)).getTime() - (offset * 60 * 1000))
  monthStartDate = monthStartDate.toISOString().split('T')[0]

  let previousMonthStartDate = new Date((new Date(date.getFullYear() - (date.getMonth() > 0 ? 0 : 1), (date.getMonth() - 1 + 12) % 12, 1)).getTime() - (offset * 60 * 1000))
  previousMonthStartDate = previousMonthStartDate.toISOString().split('T')[0]

  const newDate = new Date()
  newDate.setMonth(((newDate.getMonth() - 1 + 12) % 12))
  const perviousMonthToday = newDate.toISOString().split('T')[0]

  return { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday }
}

// For KPI Report (Bet Counts, Bet Amounts)
export const getBetQuery = ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.CASH } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    }
  }

  return { query, aggs }
}

// for internal ggr
export const getBetQueryInternal = ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.INTERNAL.win.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.INTERNAL.bet.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.INTERNAL.win.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.INTERNAL.bet.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.INTERNAL.win.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.INTERNAL.bet.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.INTERNAL.win.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.INTERNAL.bet.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        totalWin: {
          filter: { term: { transactionType: ACTION.INTERNAL.win.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        totalBet: {
          filter: { term: { transactionType: ACTION.INTERNAL.bet.toLowerCase() } },
          aggs: {
            amount: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        },
        GGR: {
          bucket_script: {
            buckets_path: {
              win: 'totalWin>amount',
              bet: 'totalBet>amount'
            },
            script: 'params.bet - params.win'
          }
        }
      }
    }
  }

  return { query, aggs }
}

// For KPI Report (Bonus wins, Bonus Bets)
export const getBonusWinsAndBonusBets = ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.NON_CASH } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        bonusWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusGGR: {
          bucket_script: {
            buckets_path: {
              bonusWin: 'bonusWin>sum',
              bonusBet: 'bonusBet>sum'
            },
            script: 'params.bonusBet - params.bonusWin'
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        bonusWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusGGR: {
          bucket_script: {
            buckets_path: {
              bonusWin: 'bonusWin>sum',
              bonusBet: 'bonusBet>sum'
            },
            script: 'params.bonusBet - params.bonusWin'
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        bonusWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusGGR: {
          bucket_script: {
            buckets_path: {
              bonusWin: 'bonusWin>sum',
              bonusBet: 'bonusBet>sum'
            },
            script: 'params.bonusBet - params.bonusWin'
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        bonusWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusGGR: {
          bucket_script: {
            buckets_path: {
              bonusWin: 'bonusWin>sum',
              bonusBet: 'bonusBet>sum'
            },
            script: 'params.bonusBet - params.bonusWin'
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        bonusWin: {
          filter: { term: { transactionType: ACTION.WIN } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusBet: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        bonusGGR: {
          bucket_script: {
            buckets_path: {
              bonusWin: 'bonusWin>sum',
              bonusBet: 'bonusBet>sum'
            },
            script: 'params.bonusBet - params.bonusWin'
          }
        }
      }
    }
  }

  return { query, aggs }
}

export const getDepositQuery = ({ query, startDate, endDate, transactionType }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { modelType: MODEL_TYPE.BANKING } })
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.CASH } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        deposits: {
          filter: { term: { transactionType } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        depositors: {
          filter: { term: { transactionType } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        deposits: {
          filter: { term: { transactionType } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        depositors: {
          filter: { term: { transactionType } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        deposits: {
          filter: { term: { transactionType } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        depositors: {
          filter: { term: { transactionType } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        deposits: {
          filter: { term: { transactionType } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        depositors: {
          filter: { term: { transactionType } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        deposits: {
          filter: { term: { transactionType } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            }
          }
        },
        depositors: {
          filter: { term: { transactionType } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    }
  }

  return { query, aggs }
}

export const getActiveUsersQuery = ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        activePlayers: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        activePlayers: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        activePlayers: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        activePlayers: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        activePlayers: {
          filter: { term: { transactionType: ACTION.BET } },
          aggs: {
            count: {
              terms: { field: 'user.userId', size: 2147483647 }
            }
          }
        }
      }
    }
  }

  return { query, aggs }
}

export const getNewDepositorsQuery = ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { modelType: MODEL_TYPE.BANKING } })
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.CASH } })
  query.bool.must.push({ match: { transactionType: TRANSACTION_TYPE.DEPOSIT } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        newDepositors: {
          filter: { term: { isFirstDeposit: true } },
          aggs: {
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        newDepositors: {
          filter: { term: { isFirstDeposit: true } },
          aggs: {
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        newDepositors: {
          filter: { term: { isFirstDeposit: true } },
          aggs: {
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        newDepositors: {
          filter: { term: { isFirstDeposit: true } },
          aggs: {
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        newDepositors: {
          filter: { term: { isFirstDeposit: true } },
          aggs: {
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    }
  }

  return { query, aggs }
}

export const getNewPlayers = async ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()
  const newPlayers = {}

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  newPlayers.today = await db.User.count({ where: filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), today, today, 'User') })
  newPlayers.yesterday = await db.User.count({ where: filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), yesterday, yesterday, 'User') })
  newPlayers.monthToDate = await db.User.count({ where: filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), monthStartDate, today, 'User') })
  newPlayers.prevMonthToDate = await db.User.count({ where: filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), previousMonthStartDate, perviousMonthToday, 'User') })
  newPlayers.customDate = await db.User.count({ where: filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), startDate, endDate, 'User') })
  newPlayers.delta = createDelta(newPlayers.monthToDate, newPlayers.prevMonthToDate)

  return newPlayers
}

export const createDepositConvRate = (DepositCount, RegisterCount) => {
  if (RegisterCount === 0) return 0.0
  return Math.abs((DepositCount / RegisterCount) * 100).toFixed(2)
}

export const getDepositConversionRate = (Deposits, users) => {
  const depositConvRate = {}

  depositConvRate.today = createDepositConvRate(Deposits.today.buckets.transactions.newDepositors.count.value, users.today)
  depositConvRate.yesterday = createDepositConvRate(Deposits.yesterday.buckets.transactions.newDepositors.count.value, users.yesterday)
  depositConvRate.monthToDate = createDepositConvRate(Deposits.monthToDate.buckets.transactions.newDepositors.count.value, users.monthToDate)
  depositConvRate.prevMonthToDate = createDepositConvRate(Deposits.prevMonthToDate.buckets.transactions.newDepositors.count.value, users.prevMonthToDate)
  depositConvRate.customDate = createDepositConvRate(Deposits.customDate.buckets.transactions.newDepositors.count.value, users.customDate)
  depositConvRate.delta = createDelta(parseFloat(depositConvRate.monthToDate), parseFloat(depositConvRate.prevMonthToDate))

  return depositConvRate
}

export const createElasticDataBanking = async (entry) => {
  if (await elasticClient.ping()) {
    const {
      transactionBankingId,
      actioneeType,
      actioneeId,
      actioneeEmail,
      actioneeName,
      walletId,
      currencyCode,
      conversionRate,
      primaryCurrencyAmount,
      amountType,
      amount,
      beforeBalance,
      paymentProvider,
      status,
      countryCode,
      transactionId,
      transactionType,
      paymentMethod,
      paymentTransactionId,
      paymentTransactionName,
      isFirstDeposit,
      updatedAt,
      createdAt
    } = entry.dataValues

    if (await elasticClient.exists({ index: ELASTIC_INDEX.TRANSACTIONS, id: transactionId })) {
      await elasticClient.delete({ index: ELASTIC_INDEX.TRANSACTIONS, id: transactionId })
    }

    const user = entry.transactionUser.dataValues
    const wallet = entry.transactionUser.userWallet.dataValues

    try {
      await elasticClient.index({
        index: ELASTIC_INDEX.TRANSACTIONS,
        id: transactionId,
        document: {
          modelType: MODEL_TYPE.BANKING,
          transactionId: transactionBankingId,
          transactionIdString: transactionBankingId.toString(),
          transactionType: transactionType,
          user: {
            userType: actioneeType,
            userId: actioneeId,
            walletId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: actioneeName,
            email: actioneeEmail,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          parentType: user.parentType,
          parentId: user.parentId,
          totalAmount: parseInt(wallet.amount) + parseInt(amount) + parseInt(wallet.nonCashAmount),
          amountType,
          transactionAmount: amount,
          transactionAmountPrimary: primaryCurrencyAmount,
          beforeBalance,
          afterBalance: parseInt(wallet.amount) + parseInt(amount),
          nonCashAmount: wallet.nonCashAmount,
          conversionRate,
          isFirstDeposit,
          status,
          kycStatus: user.kycStatus,
          statusValue: (Object.keys(TRANSACTION_STATUS).find(key => TRANSACTION_STATUS[key] === status)).toLowerCase(),
          description: null,
          currencyCode,
          countryCode,
          gameAggregator: null,
          gameIdentifier: null,
          paymentProvider: paymentProvider,
          gameProvider: null,
          gameProviderId: null,
          paymentMethod,
          paymentTransactionId,
          paymentTransactionName,
          bonusId: null,
          sourceCurrency: wallet.currencyCode,
          targetCurrency: wallet.currencyCode,
          amountInOtherCurrencies: await getOtherCurrenciesAmount({ amount, currencyCode: wallet.currencyCode }),
          reindexed: true,
          updatedAt,
          createdAt
        }
      })

      await entry.set({ elasticUpdated: true }).save()
      logger.info('Elastic entry created')
    } catch {
      logger.error('Elastic entry not created')
    }
  } else {
    logger.error('Elastic entry not created')
  }
}

export const createElasticDataCasino = async (entry) => {
  if (await elasticClient.ping()) {
    const {
      casinoTransactionId,
      userId,
      walletId,
      gameIdentifier,
      actionType,
      amount,
      nonCashAmount,
      status,
      currencyCode,
      beforeBalance,
      afterBalance,
      primaryCurrencyAmount,
      updatedAt,
      createdAt,
      conversionRate,
      amountType,
      transactionId
    } = entry.dataValues

    if (await elasticClient.exists({ index: ELASTIC_INDEX.TRANSACTIONS, id: transactionId })) {
      await elasticClient.delete({ index: ELASTIC_INDEX.TRANSACTIONS, id: transactionId })
    }

    const user = entry.User.dataValues
    const wallet = entry.User.userWallet.dataValues

    const gameDetails = await getGameAggregatorAndProvider({ game: gameIdentifier })

    try {
      await elasticClient.index({
        index: ELASTIC_INDEX.TRANSACTIONS,
        id: transactionId,
        document: {
          modelType: MODEL_TYPE.CASINO,
          transactionId: casinoTransactionId,
          transactionIdString: casinoTransactionId.toString(),
          transactionType: actionType,
          user: {
            userType: ROLE.USER,
            userId,
            walletId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          parentType: user.parentType,
          parentId: user.parentId,
          totalAmount: parseInt(afterBalance) + parseInt(nonCashAmount),
          amountType,
          transactionAmount: amount,
          transactionAmountPrimary: primaryCurrencyAmount,
          beforeBalance,
          afterBalance,
          nonCashAmount,
          conversionRate,
          isFirstDeposit: false,
          status,
          kycStatus: user.kycStatus,
          statusValue: (Object.keys(TRANSACTION_STATUS).find(key => TRANSACTION_STATUS[key] === status)).toLowerCase(),
          description: null,
          currencyCode,
          countryCode: user.countryCode,
          gameAggregator: gameDetails.aggregator,
          gameIdentifier,
          gameProvider: gameDetails.provider,
          gameProviderId: gameDetails.providerId,
          paymentProvider: null,
          paymentMethod: null,
          paymentTransactionId: null,
          paymentTransactionName: null,
          bonusId: null,
          sourceCurrency: null,
          targetCurrency: null,
          amountInOtherCurrencies: await getOtherCurrenciesAmount({ amount, currencyCode: wallet.currencyCode }),
          reindexed: true,
          updatedAt,
          createdAt
        }
      })

      await entry.set({ elasticUpdated: true }).save()
      logger.info('Elastic entry created')
    } catch {
      logger.error('Elastic entry not created')
    }
  } else {
    logger.error('Elastic entry not created')
  }
}

export const reindexData = async () => {
  logger.info('Reindexing elastic started')

  const transactionBanking = await db.TransactionBanking.findAll({
    where: { elasticUpdated: false },
    include: [{ model: db.User, as: 'transactionUser', include: [{ model: db.Wallet, as: 'userWallet' }] }]
  })

  transactionBanking.forEach(async (entry) => {
    await createElasticDataBanking(entry)
  })

  const casinoTransactions = await db.CasinoTransaction.findAll({
    where: { elasticUpdated: false },
    include: [{ model: db.User, include: [{ model: db.Wallet, as: 'userWallet' }] }]
  })

  casinoTransactions.forEach(async (entry) => {
    await createElasticDataCasino(entry)
  })

  logger.info('Reindexing elastic completed')
}

export const getElasticOptions = async ({ userDetails, userWallet, conversionRate, game, amount, nonCashAmount }) => {
  if (amount) {
    nonCashAmount = 0
  } else {
    amount = 0
  }

  const elasticOptions = {
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    parentType: userDetails.parentType,
    parentId: userDetails.parentId,
    kycStatus: userDetails.kycStatus,
    totalAmount: parseInt(userWallet.amount) + parseInt(amount) + parseInt(userWallet.nonCashAmount),
    afterBalance: parseInt(userWallet.amount) + parseInt(amount),
    nonCashAmount: parseInt(userWallet.nonCashAmount) + parseInt(nonCashAmount),
    userCreatedAt: userDetails.createdAt,
    userUpdatedAt: userDetails.updatedAt,
    statusValue: 'pending',
    description: null,
    gameAggregator: null,
    gameIdentifier: null,
    isFirstDeposit: false,
    bonusId: null,
    sourceCurrency: userWallet.currencyCode,
    targetCurrency: userWallet.currencyCode,
    amountInOtherCurrencies: await getOtherCurrenciesAmount({ amount, currencyCode: userWallet.currencyCode })
  }
  return elasticOptions
}

export const createElasticEntity = async (record, elasticOptions) => {
  if (await elasticClient.ping()) {
    const options = elasticOptions.options

    const {
      transactionBankingId,
      actioneeType,
      actioneeId,
      actioneeEmail,
      actioneeName,
      walletId,
      currencyCode,
      conversionRate,
      primaryCurrencyAmount,
      amountType,
      amount,
      beforeBalance,
      paymentProvider,
      status,
      countryCode,
      transactionId,
      transactionType,
      paymentMethod,
      paymentTransactionId,
      paymentTransactionName,
      updatedAt,
      createdAt
    } = record.dataValues

    try {
      await elasticClient.index({
        index: ELASTIC_INDEX.TRANSACTIONS,
        id: transactionId,
        document: {
          modelType: MODEL_TYPE.BANKING,
          transactionId: transactionBankingId,
          transactionIdString: transactionBankingId.toString(),
          transactionType: transactionType,
          user: {
            userType: actioneeType,
            userId: actioneeId,
            walletId,
            firstName: options.firstName,
            lastName: options.lastName,
            username: actioneeName,
            email: actioneeEmail,
            createdAt: options.userCreatedAt,
            updatedAt: options.userUpdatedAt
          },
          parentType: options.parentType,
          parentId: options.parentId,
          totalAmount: options.totalAmount,
          amountType,
          transactionAmount: amount,
          transactionAmountPrimary: primaryCurrencyAmount,
          beforeBalance,
          afterBalance: options.afterBalance,
          nonCashAmount: options.nonCashAmount,
          conversionRate,
          isFirstDeposit: options.isFirstDeposit,
          status,
          kycStatus: options.kycStatus,
          statusValue: options.statusValue,
          description: options.description,
          currencyCode,
          countryCode,
          gameAggregator: options.aggregator,
          gameIdentifier: options.gameIdentifier,
          gameProvider: null,
          gameProviderId: null,
          paymentProvider: paymentProvider,
          paymentMethod,
          paymentTransactionId,
          paymentTransactionName,
          bonusId: options.bonusId,
          sourceCurrency: options.sourceCurrency,
          targetCurrency: options.targetCurrency,
          amountInOtherCurrencies: options.amountInOtherCurrencies,
          reindexed: false,
          updatedAt,
          createdAt
        }
      })

      await record.set({ elasticUpdated: true }).save({ hooks: false, transaction: elasticOptions.transaction })
      logger.info('Elastic entry created')
    } catch {
      await record.set({ elasticUpdated: false }).save({ hooks: false, transaction: elasticOptions.transaction })
      logger.error('Elastic entry not created')
    }
  } else {
    await record.set({ elasticUpdated: false }).save({ hooks: false, transaction: elasticOptions.transaction })
    logger.error('Elastic entry not created')
  }
}

export const updateElasticEntity = async (record, elasticOptions) => {
  if (await elasticClient.ping()) {
    const options = elasticOptions.options
    const { transactionId, status, updatedAt } = record.dataValues

    try {
      await elasticClient.update({
        index: ELASTIC_INDEX.TRANSACTIONS,
        id: transactionId,
        doc: {
          status,
          statusValue: options.statusValue,
          updatedAt
        }
      })

      await record.set({ elasticUpdated: true }).save({ hooks: false, transaction: elasticOptions.transaction })
      logger.info('Elastic entry created')
    } catch {
      await record.set({ elasticUpdated: false }).save({ hooks: false, transaction: elasticOptions.transaction })
      logger.error('Elastic entry not created')
    }
  } else {
    await record.set({ elasticUpdated: false }).save({ hooks: false, transaction: elasticOptions.transaction })
    logger.error('Elastic entry not created')
  }
}
export const createDelta = (month, prevMonth) => {
  if (month === undefined && prevMonth === undefined) return 0.0
  if (month === undefined) month = 0
  if (prevMonth === undefined) prevMonth = 0

  month = parseFloat(month.toString().replace(/,/g, ''))
  prevMonth = parseFloat(prevMonth.toString().replace(/,/g, ''))

  if (prevMonth === 0 && month === 0) return 0.0
  if (prevMonth === 0 && month > 0) return 100
  if (prevMonth === 0 && month < 0) return -100
  return (((month - prevMonth) / Math.abs(prevMonth)) * 100).toFixed(2)
}

export const createKpiSummaryResponse = (KPISummary) => {
  const response = []

  response.push({
    rowName: 'Pending Withdrawals (Globally)',
    type: 'amount',
    ...KPISummary.withdraw.totalPendingWithdraws
  })

  response.push({
    rowName: 'Pending Withdrawals (Kyc Requested)',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.withdraw.kycRequested.today.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.withdraw.kycRequested.yesterday.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.withdraw.kycRequested.monthToDate.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.withdraw.kycRequested.prevMonthToDate.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.withdraw.kycRequested.customDate.toFixed(2))
  })

  response.push({
    rowName: 'Pending Withdrawals (Kyc Approved)',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.withdraw.kycApproved.today.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.withdraw.kycApproved.yesterday.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.withdraw.kycApproved.monthToDate.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.withdraw.kycApproved.prevMonthToDate.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.withdraw.kycApproved.customDate.toFixed(2))
  })

  response.push({
    rowName: 'Pending Withdrawals (Kyc Pending)',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.withdraw.kycPending.today.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.withdraw.kycPending.yesterday.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.withdraw.kycPending.monthToDate.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.withdraw.kycPending.prevMonthToDate.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.withdraw.kycPending.customDate.toFixed(2))
  })

  response.push({
    rowName: 'Withdrawals',
    type: 'amount',
    ...KPISummary.withdraw.withdrawals
  })

  response.push({
    rowName: 'Bet Count',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.betCountsAndAmounts.today.buckets.transactions.totalBet.count.value),
    yesterday: internationalNumberFormatter(KPISummary.betCountsAndAmounts.yesterday.buckets.transactions.totalBet.count.value),
    monthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.monthToDate.buckets.transactions.totalBet.count.value),
    prevMonthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.prevMonthToDate.buckets.transactions.totalBet.count.value),
    customDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.customDate.buckets.transactions.totalBet.count.value)
  })

  response.push({
    rowName: 'Bet Amount',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.betCountsAndAmounts.today.buckets.transactions.totalBet.amount.value?.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.betCountsAndAmounts.yesterday.buckets.transactions.totalBet.amount.value?.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.monthToDate.buckets.transactions.totalBet.amount.value?.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.prevMonthToDate.buckets.transactions.totalBet.amount.value?.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.customDate.buckets.transactions.totalBet.amount.value?.toFixed(2))
  })

  response.push({
    rowName: 'Win Count',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.betCountsAndAmounts.today.buckets.transactions.totalWin.count.value),
    yesterday: internationalNumberFormatter(KPISummary.betCountsAndAmounts.yesterday.buckets.transactions.totalWin.count.value),
    monthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.monthToDate.buckets.transactions.totalWin.count.value),
    prevMonthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.prevMonthToDate.buckets.transactions.totalWin.count.value),
    customDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.customDate.buckets.transactions.totalWin.count.value)
  })

  response.push({
    rowName: 'Win Amount',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.betCountsAndAmounts.today.buckets.transactions.totalWin.amount.value?.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.betCountsAndAmounts.yesterday.buckets.transactions.totalWin.amount.value?.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.monthToDate.buckets.transactions.totalWin.amount.value?.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.prevMonthToDate.buckets.transactions.totalWin.amount.value?.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.customDate.buckets.transactions.totalWin.amount.value?.toFixed(2))
  })

  response.push({
    rowName: 'GGR',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.betCountsAndAmounts.today.buckets.transactions?.GGR?.value?.toFixed(2) || 0.00),
    yesterday: internationalNumberFormatter(KPISummary.betCountsAndAmounts.yesterday.buckets.transactions?.GGR?.value?.toFixed(2) || 0.00),
    monthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.monthToDate.buckets.transactions?.GGR?.value?.toFixed(2) || 0.00),
    prevMonthToDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.prevMonthToDate.buckets.transactions?.GGR?.value?.toFixed(2) || 0.00),
    customDate: internationalNumberFormatter(KPISummary.betCountsAndAmounts.customDate.buckets.transactions?.GGR?.value?.toFixed(2) || 0.00)
  })

  response.push({
    rowName: 'Bonus Count',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.bonusCountAndAmount.today.buckets.transactions.bonus.count.value),
    yesterday: internationalNumberFormatter(KPISummary.bonusCountAndAmount.yesterday.buckets.transactions.bonus.count.value),
    monthToDate: internationalNumberFormatter(KPISummary.bonusCountAndAmount.monthToDate.buckets.transactions.bonus.count.value),
    prevMonthToDate: internationalNumberFormatter(KPISummary.bonusCountAndAmount.prevMonthToDate.buckets.transactions.bonus.count.value),
    customDate: internationalNumberFormatter(KPISummary.bonusCountAndAmount.customDate.buckets.transactions.bonus.count.value)
  })

  response.push({
    rowName: 'Bonus Amount',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.bonusCountAndAmount.today.buckets.transactions.bonus?.sum?.value?.toFixed(2) || 0.00),
    yesterday: internationalNumberFormatter(KPISummary.bonusCountAndAmount.yesterday.buckets.transactions.bonus?.sum?.value?.toFixed(2) || 0.00),
    monthToDate: internationalNumberFormatter(KPISummary.bonusCountAndAmount.monthToDate.buckets.transactions.bonus?.sum?.value?.toFixed(2) || 0.00),
    prevMonthToDate: internationalNumberFormatter(KPISummary.bonusCountAndAmount.prevMonthToDate.buckets.transactions.bonus?.sum?.value?.toFixed(2) || 0.00),
    customDate: internationalNumberFormatter(KPISummary.bonusCountAndAmount.customDate.buckets.transactions.bonus?.sum?.value?.toFixed(2) || 0.00)
  })

  response.push({
    rowName: 'Bonus Win',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.bonusBetsAndWins.today.buckets.transactions.bonusWin.sum.value?.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.bonusBetsAndWins.yesterday.buckets.transactions.bonusWin.sum.value?.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.monthToDate.buckets.transactions.bonusWin.sum.value?.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.prevMonthToDate.buckets.transactions.bonusWin.sum.value?.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.customDate.buckets.transactions.bonusWin.sum.value?.toFixed(2))
  })

  response.push({
    rowName: 'Bonus Bet',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.bonusBetsAndWins.today.buckets.transactions.bonusBet.sum.value?.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.bonusBetsAndWins.yesterday.buckets.transactions.bonusBet.sum.value?.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.monthToDate.buckets.transactions.bonusBet.sum.value?.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.prevMonthToDate.buckets.transactions.bonusBet.sum.value?.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.customDate.buckets.transactions.bonusBet.sum.value?.toFixed(2))
  })

  response.push({
    rowName: 'Bonus GGR',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.bonusBetsAndWins.today.buckets.transactions?.bonusGGR?.value?.toFixed(2) || 0.00),
    yesterday: internationalNumberFormatter(KPISummary.bonusBetsAndWins.yesterday.buckets.transactions?.bonusGGR?.value?.toFixed(2) || 0.00),
    monthToDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.monthToDate.buckets.transactions?.bonusGGR?.value?.toFixed(2) || 0.00),
    prevMonthToDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.prevMonthToDate.buckets.transactions?.bonusGGR?.value?.toFixed(2) || 0.00),
    customDate: internationalNumberFormatter(KPISummary.bonusBetsAndWins.customDate.buckets.transactions?.bonusGGR?.value?.toFixed(2) || 0.00)
  })

  response.push({
    rowName: 'Deposits',
    type: 'amount',
    today: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.today.buckets.transactions.deposits.sum.value?.toFixed(2)),
    yesterday: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.yesterday.buckets.transactions.deposits.sum.value?.toFixed(2)),
    monthToDate: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.monthToDate.buckets.transactions.deposits.sum.value?.toFixed(2)),
    prevMonthToDate: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.prevMonthToDate.buckets.transactions.deposits.sum.value?.toFixed(2)),
    customDate: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.customDate.buckets.transactions.deposits.sum.value?.toFixed(2))
  })

  response.push({
    rowName: 'Depositors',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.today.buckets.transactions.depositors.count.buckets.length),
    yesterday: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.yesterday.buckets.transactions.depositors.count.buckets.length),
    monthToDate: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.monthToDate.buckets.transactions.depositors.count.buckets.length),
    prevMonthToDate: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.prevMonthToDate.buckets.transactions.depositors.count.buckets.length),
    customDate: internationalNumberFormatter(KPISummary.depositCountAndDepositAmount.customDate.buckets.transactions.depositors.count.buckets.length)
  })

  response.push({
    rowName: 'Active Users',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.activeUsers.today.buckets.transactions.activePlayers.count.buckets.length),
    yesterday: internationalNumberFormatter(KPISummary.activeUsers.yesterday.buckets.transactions.activePlayers.count.buckets.length),
    monthToDate: internationalNumberFormatter(KPISummary.activeUsers.monthToDate.buckets.transactions.activePlayers.count.buckets.length),
    prevMonthToDate: internationalNumberFormatter(KPISummary.activeUsers.prevMonthToDate.buckets.transactions.activePlayers.count.buckets.length),
    customDate: internationalNumberFormatter(KPISummary.activeUsers.customDate.buckets.transactions.activePlayers.count.buckets.length)
  })

  response.push({
    rowName: 'New Players',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.newPlayers.today),
    yesterday: internationalNumberFormatter(KPISummary.newPlayers.yesterday),
    monthToDate: internationalNumberFormatter(KPISummary.newPlayers.monthToDate),
    prevMonthToDate: internationalNumberFormatter(KPISummary.newPlayers.prevMonthToDate),
    customDate: internationalNumberFormatter(KPISummary.newPlayers.customDate)
  })

  response.push({
    rowName: 'New Depositors',
    type: 'count',
    today: internationalNumberFormatter(KPISummary.newDepositors.today.buckets.transactions.newDepositors.count.value),
    yesterday: internationalNumberFormatter(KPISummary.newDepositors.yesterday.buckets.transactions.newDepositors.count.value),
    monthToDate: internationalNumberFormatter(KPISummary.newDepositors.monthToDate.buckets.transactions.newDepositors.count.value),
    prevMonthToDate: internationalNumberFormatter(KPISummary.newDepositors.prevMonthToDate.buckets.transactions.newDepositors.count.value),
    customDate: internationalNumberFormatter(KPISummary.newDepositors.customDate.buckets.transactions.newDepositors.count.value)
  })

  response.push({
    rowName: 'Deposit Conv Rate',
    type: 'rate',
    today: KPISummary.depositConversionRate.today + ' %',
    yesterday: KPISummary.depositConversionRate.yesterday + ' %',
    monthToDate: KPISummary.depositConversionRate.monthToDate + ' %',
    prevMonthToDate: KPISummary.depositConversionRate.prevMonthToDate + ' %',
    customDate: KPISummary.depositConversionRate.customDate + ' %'
  })

  return response
}

export const getRealBetandRealWinQuery = ({ query, startDate, endDate, groupBy }) => {
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.CASH } })

  const aggs = {
    date: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        group_by_provider: {
          terms: {
            field: groupBy,
            size: 2147483647
          },
          aggs: {
            realWin: {
              filter: { term: { transactionType: ACTION.WIN } },
              aggs: {
                amount: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            realBet: {
              filter: { term: { transactionType: ACTION.BET } },
              aggs: {
                amount: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            GGR: {
              bucket_script: {
                buckets_path: {
                  win: 'realWin>amount',
                  bet: 'realBet>amount'
                },
                script: 'params.bet - params.win'
              }
            }
          }
        }
      }
    }
  }
  return { query, aggs }
}

export const getBonusWinAndBonusBet = ({ query, startDate, endDate, groupBy }) => {
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.NON_CASH } })

  const aggs = {
    date: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        group_by_provider: {
          terms: {
            field: groupBy,
            size: 2147483647
          },
          aggs: {
            bonusWin: {
              filter: { term: { transactionType: ACTION.WIN } },
              aggs: {
                sum: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            bonusBet: {
              filter: { term: { transactionType: ACTION.BET } },
              aggs: {
                sum: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            bonusGGR: {
              bucket_script: {
                buckets_path: {
                  win: 'bonusWin>sum',
                  bet: 'bonusBet>sum'
                },
                script: 'params.bet - params.win'
              }
            }
          }
        }
      }
    }
  }
  return { query, aggs }
}

export const getTotalBets = ({ query, startDate, endDate, groupBy }) => {
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })
  query.bool.must.push({ match: { transactionType: ACTION.BET } })

  const aggs = {
    date: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        group_by_provider: {
          terms: {
            field: groupBy,
            size: 2147483647
          },
          aggs: {
            realBet: {
              filter: { term: { amountType: AMOUNT_TYPE.CASH } },
              aggs: {
                sum: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            bonusBet: {
              filter: { term: { amountType: AMOUNT_TYPE.NON_CASH } },
              aggs: {
                sum: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            totalBets: {
              bucket_script: {
                buckets_path: {
                  realBet: 'realBet>sum',
                  bonusBet: 'bonusBet>sum'
                },
                script: 'params.realBet + params.bonusBet'
              }
            }
          }
        }
      }
    }
  }
  return { query, aggs }
}

export const getProviders = async () => {
  const response = {}
  const providers = await db.MasterCasinoProvider.findAll({ raw: true })
  providers.forEach((provider) => {
    response[provider.name] = {
      GGR: 0.00,
      deltaGGR: '-',
      realBet: 0.00,
      realWin: 0.00,
      bonusBet: 0.00,
      bonusWin: 0.00,
      bonusGGR: 0.00,
      totalBets: 0.00,
      deltaTotalBets: '-'
    }
  })
  return response
}

export const getProviderMapper = async () => {
  const providerNameMapper = {}
  const providers = await db.MasterCasinoProvider.findAll({ raw: true })
  providers.forEach((provider) => {
    providerNameMapper[provider.masterCasinoProviderId] = provider.name
  })
  return providerNameMapper
}

export const getDefaultKpiReportValues = () => {
  return {
    GGR: 0.00,
    deltaGGR: '-',
    realBet: 0.00,
    realWin: 0.00,
    bonusBet: 0.00,
    bonusWin: 0.00,
    bonusGGR: 0.00,
    totalBets: 0.00,
    deltaTotalBets: '-'
  }
}

const upgradeDeltaInKPIReport = (report) => {
  Object.keys(report).forEach(key => {
    if (report[key].deltaGGR === '-') {
      report[key].deltaGGR = createDelta(report[key].GGR, 0) + ' %'
    }
    if (report[key].deltaTotalBets === '-') {
      report[key].deltaTotalBets = createDelta(report[key].totalBets, 0) + ' %'
    }
  })

  return report
}

export const createKpiReportResponse = async (KPIReport, type) => {
  if (type === 'provider') {
    const response = await getProviders()
    const providerNameMapper = await getProviderMapper()

    KPIReport.realAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[providerNameMapper[provider.key]] === undefined) response[providerNameMapper[provider.key]] = getDefaultKpiReportValues()
      response[providerNameMapper[provider.key]].GGR = internationalNumberFormatter((provider?.GGR?.value || 0.00).toFixed(2))
      response[providerNameMapper[provider.key]].realWin = internationalNumberFormatter((provider.realWin.amount.value || 0.00).toFixed(2))
      response[providerNameMapper[provider.key]].realBet = internationalNumberFormatter((provider.realBet.amount.value || 0.00).toFixed(2))
    })

    KPIReport.bonusAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[providerNameMapper[provider.key]] === undefined) response[providerNameMapper[provider.key]] = getDefaultKpiReportValues()
      response[providerNameMapper[provider.key]].bonusWin = internationalNumberFormatter((provider.bonusWin.sum.value || 0.00).toFixed(2))
      response[providerNameMapper[provider.key]].bonusBet = internationalNumberFormatter((provider.bonusBet.sum.value || 0.00).toFixed(2))
      response[providerNameMapper[provider.key]].bonusGGR = internationalNumberFormatter((provider?.bonusGGR?.value || 0.00).toFixed(2))
    })

    KPIReport.totalBetsAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[providerNameMapper[provider.key]] === undefined) response[providerNameMapper[provider.key]] = getDefaultKpiReportValues()
      response[providerNameMapper[provider.key]].totalBets = internationalNumberFormatter((provider?.totalBets?.value || 0.00).toFixed(2))
    })

    KPIReport.deltaRealAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[providerNameMapper[provider.key]] === undefined) response[providerNameMapper[provider.key]] = getDefaultKpiReportValues()
      response[providerNameMapper[provider.key]].deltaGGR = createDelta(response[providerNameMapper[provider.key]]?.GGR, provider?.GGR?.value) + ' %'
    })

    KPIReport.deltaTotalBetsAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[providerNameMapper[provider.key]] === undefined) response[providerNameMapper[provider.key]] = getDefaultKpiReportValues()
      response[providerNameMapper[provider.key]].deltaTotalBets = createDelta(response[providerNameMapper[provider.key]]?.totalBets, provider?.totalBets?.value) + ' %'
    })

    return upgradeDeltaInKPIReport(response)
  } else if (type === 'game') {
    const response = {}

    KPIReport.realAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[provider.key] === undefined) response[provider.key] = getDefaultKpiReportValues()
      response[provider.key].GGR = internationalNumberFormatter((provider?.GGR?.value || 0.00).toFixed(2))
      response[provider.key].realWin = internationalNumberFormatter((provider.realWin.amount.value || 0.00).toFixed(2))
      response[provider.key].realBet = internationalNumberFormatter((provider.realBet.amount.value || 0.00).toFixed(2))
    })

    KPIReport.bonusAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[provider.key] === undefined) response[provider.key] = getDefaultKpiReportValues()
      response[provider.key].bonusWin = internationalNumberFormatter((provider.bonusWin.sum.value || 0.00).toFixed(2))
      response[provider.key].bonusBet = internationalNumberFormatter((provider.bonusBet.sum.value || 0.00).toFixed(2))
      response[provider.key].bonusGGR = internationalNumberFormatter((provider?.bonusGGR?.value || 0.00).toFixed(2))
    })

    KPIReport.totalBetsAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[provider.key] === undefined) response[provider.key] = getDefaultKpiReportValues()
      response[provider.key].totalBets = internationalNumberFormatter((provider?.totalBets?.value || 0.00).toFixed(2))
    })

    KPIReport.deltaRealAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[provider.key] === undefined) response[provider.key] = getDefaultKpiReportValues()
      response[provider.key].deltaGGR = createDelta(response[provider.key]?.GGR, provider?.GGR?.value) + ' %'
    })

    KPIReport.deltaTotalBetsAmounts.date.buckets.transactions.group_by_provider.buckets.forEach((provider) => {
      if (response[provider.key] === undefined) response[provider.key] = getDefaultKpiReportValues()
      response[provider.key].deltaTotalBets = createDelta(response[provider.key]?.totalBets, provider?.totalBets?.value) + ' %'
    })

    return upgradeDeltaInKPIReport(response)
  }
}

const days = (dateIst, dateIInd) => {
  const difference = dateIst.getTime() - dateIInd.getTime()
  const TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
  return TotalDays
}

const startOfWeek = (date) => {
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}

export const getDates = ({ dateOptions, customEndDate, customStartDate }) => {
  let startDate, endDate, deltaStartDate, deltaEndDate

  if (dateOptions === 'today') {
    const { today, yesterday } = getReportFilterDates()

    startDate = today
    endDate = today
    deltaEndDate = yesterday
    deltaStartDate = yesterday
  } else if (dateOptions === 'yesterday') {
    const { yesterday } = getReportFilterDates()
    const d = new Date()

    d.setDate(d.getDate() - 2)

    const dayBeforeYesterday = d.toISOString().substring(0, 10)

    startDate = yesterday
    endDate = yesterday
    deltaEndDate = dayBeforeYesterday
    deltaStartDate = dayBeforeYesterday
  } else if (dateOptions === 'monthtodate') {
    const { today, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()
    startDate = monthStartDate
    endDate = today
    deltaEndDate = perviousMonthToday
    deltaStartDate = previousMonthStartDate
  } else if (dateOptions === 'last7days') {
    const { today } = getReportFilterDates()
    const newDate = new Date()

    newDate.setDate(newDate.getDate() - 7)
    startDate = newDate.toISOString().substring(0, 10)
    endDate = today

    newDate.setDate(newDate.getDate() - 7)

    deltaStartDate = newDate.toISOString().substring(0, 10)
    deltaEndDate = startDate
  } else if (dateOptions === 'last30days') {
    const { today } = getReportFilterDates()
    const newDate = new Date()

    newDate.setDate(newDate.getDate() - 30)

    startDate = newDate.toISOString().substring(0, 10)
    endDate = today

    newDate.setDate(newDate.getDate() - 30)

    deltaStartDate = newDate.toISOString().substring(0, 10)
    deltaEndDate = startDate
  } else if (dateOptions === 'last90days') {
    const { today } = getReportFilterDates()
    const newDate = new Date()

    newDate.setDate(newDate.getDate() - 90)

    startDate = newDate.toISOString().substring(0, 10)
    endDate = today

    newDate.setDate(newDate.getDate() - 90)

    deltaStartDate = newDate.toISOString().substring(0, 10)
    deltaEndDate = startDate
  } else if (dateOptions === 'weektodate') {
    const { today } = getReportFilterDates()
    const newDate = new Date()

    startDate = startOfWeek(newDate).toISOString().substring(0, 10)
    endDate = today

    const prevDate = new Date()
    prevDate.setDate(prevDate.getDate() - 7)
    deltaEndDate = prevDate.toISOString().substring(0, 10)
    deltaStartDate = startOfWeek(prevDate).toISOString().substring(0, 10)
  } else if (dateOptions === 'yeartodate') {
    const { today } = getReportFilterDates()
    const offset = new Date().getTimezoneOffset()
    startDate = new Date((new Date(new Date().getFullYear(), 0, 1)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    endDate = today
    const newDate = new Date()
    newDate.setFullYear(newDate.getFullYear() - 1)

    deltaEndDate = newDate.toISOString().substring(0, 10)
    deltaStartDate = new Date((new Date(newDate.getFullYear(), 0, 1)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
  } else if (dateOptions === 'previousmonth') {
    const offset = new Date().getTimezoneOffset()
    startDate = new Date((new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    endDate = new Date((new Date(new Date().getFullYear(), new Date().getMonth(), 0)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    deltaStartDate = new Date((new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    deltaEndDate = new Date((new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
  } else if (dateOptions === 'previousyear') {
    const offset = new Date().getTimezoneOffset()

    startDate = new Date((new Date(new Date().getFullYear() - 1, 0, 1)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    endDate = new Date((new Date(new Date().getFullYear() - 1, 11, 31)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    deltaStartDate = new Date((new Date(new Date().getFullYear() - 2, 0, 1)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
    deltaEndDate = new Date((new Date(new Date().getFullYear() - 2, 11, 31)).getTime() - (offset * 60 * 1000)).toISOString().substring(0, 10)
  } else if (dateOptions === 'custom') {
    startDate = customStartDate
    endDate = customEndDate

    const createDeltaStart = new Date(startDate)

    createDeltaStart.setDate(createDeltaStart.getDate() - (Math.abs(days(new Date(endDate), new Date(startDate))) + 1))
    deltaStartDate = createDeltaStart.toISOString().substring(0, 10)
    deltaEndDate = startDate
  }
  startDate = startDate + ' 00:00:00'
  endDate = endDate + ' 23:59:59'
  return { startDate, endDate, deltaStartDate, deltaEndDate }
}

export const getPlayerLiabilityQuery = ({ query, endDate }) => {
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({
    bool: {
      should: [
        { match: { transactionType: TRANSACTION_TYPE.DEPOSIT } },
        { match: { transactionType: ACTION.BET } },
        { match: { transactionType: ACTION.WIN } }
      ]
    }
  })

  const aggs = {
    transactions: {
      filter: {
        range: {
          updatedAt: { lte: endDate }
        }
      },
      aggs: {
        by_user: {
          terms: {
            field: 'user.userId',
            size: 2147483647
          },
          aggs: {
            recent_transactions: {
              top_hits: {
                sort: [
                  {
                    updatedAt: {
                      order: 'desc'
                    }
                  }
                ],
                _source: {
                  includes: [
                    'afterBalance',
                    'transactionType',
                    'currencyCode',
                    'updatedAt',
                    'user.username',
                    'conversionRate'
                  ]
                },
                size: 1
              }
            }
          }
        }
      }
    }
  }

  return { query, aggs }
}

export const sortPlayerLiabilityData = async (playerLiability) => {
  const groupObject = {}

  for (const user of playerLiability.transactions.by_user.buckets) {
    const root = user.recent_transactions.hits.hits[0]?._source
    const currencyCode = root.currencyCode

    if (!groupObject[' ' + currencyCode]) {
      groupObject[' ' + currencyCode] = { currencyCode, name: null, liability: 0 }
    }
    groupObject[' ' + currencyCode].liability = Math.round((groupObject[' ' + currencyCode].liability + root.afterBalance) * 100) / 100
  }

  return { playerLiability: Object.values(groupObject), elasticResponse: playerLiability, groupingData: groupObject }
}

export const getBonusCountAndAmountQuery = ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  query.bool.must.push({ match: { modelType: MODEL_TYPE.BANKING } })
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { amountType: AMOUNT_TYPE.NON_CASH } })

  const aggs = {
    today: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: today,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        bonus: {
          filter: { term: { transactionType: TRANSACTION_TYPE.BONUS } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    yesterday: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: yesterday,
                to: yesterday
              }
            }
          }
        }
      },
      aggs: {
        bonus: {
          filter: { term: { transactionType: TRANSACTION_TYPE.BONUS } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    monthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: monthStartDate,
                to: today
              }
            }
          }
        }
      },
      aggs: {
        bonus: {
          filter: { term: { transactionType: TRANSACTION_TYPE.BONUS } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    prevMonthToDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: previousMonthStartDate,
                to: perviousMonthToday
              }
            }
          }
        }
      },
      aggs: {
        bonus: {
          filter: { term: { transactionType: TRANSACTION_TYPE.BONUS } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    },
    customDate: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        bonus: {
          filter: { term: { transactionType: TRANSACTION_TYPE.BONUS } },
          aggs: {
            sum: {
              sum: {
                field: 'transactionAmountPrimary'
              }
            },
            count: {
              value_count: {
                field: 'transactionId'
              }
            }
          }
        }
      }
    }
  }

  return { query, aggs }
}

const splitPendingWithdrawData = (withdrawData) => {
  const kycPending = {
    today: 0,
    yesterday: 0,
    monthToDate: 0,
    prevMonthToDate: 0,
    customDate: 0,
    delta: '0 %'
  }

  const kycApproved = {
    today: 0,
    yesterday: 0,
    monthToDate: 0,
    prevMonthToDate: 0,
    customDate: 0,
    delta: '0 %'
  }

  const kycRequested = {
    today: 0,
    yesterday: 0,
    monthToDate: 0,
    prevMonthToDate: 0,
    customDate: 0,
    delta: '0 %'
  }

  for (const key of Object.keys(withdrawData)) {
    for (const request of withdrawData[key]) {
      if (request['transactionUser.kycStatus'] === STATUS_VALUE.PENDING) {
        kycPending[key] = request.amount
      } else if (request['transactionUser.kycStatus'] === STATUS_VALUE.REQUESTED || request['transactionUser.kycStatus'] === STATUS_VALUE.RE_REQUESTED) {
        kycRequested[key] += request.amount
      } else if (request['transactionUser.kycStatus'] === STATUS_VALUE.APPROVED) {
        kycApproved[key] = request.amount
      }
    }
  }

  kycApproved.delta = createDelta(kycApproved.monthToDate, kycApproved.prevMonthToDate) + ' %'
  kycRequested.delta = createDelta(kycRequested.monthToDate, kycRequested.prevMonthToDate) + ' %'
  kycPending.delta = createDelta(kycPending.monthToDate, kycPending.prevMonthToDate) + ' %'

  return { kycApproved, kycPending, kycRequested }
}

export const getWithdrawRequestData = async ({ query, startDate, endDate }) => {
  const { today, yesterday, monthStartDate, previousMonthStartDate, perviousMonthToday } = getReportFilterDates()

  if (!startDate) startDate = today
  if (!endDate) endDate = today

  const withdrawals = {}

  withdrawals.today = internationalNumberFormatter((await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), today, today, 'TransactionBanking'), status: 1 } })).toFixed(2))
  withdrawals.yesterday = internationalNumberFormatter((await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), yesterday, yesterday, 'TransactionBanking'), status: 1 } })).toFixed(2))
  withdrawals.monthToDate = await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), monthStartDate, today, 'TransactionBanking'), status: 1 } })
  withdrawals.prevMonthToDate = await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), previousMonthStartDate, perviousMonthToday, 'TransactionBanking'), status: 1 } })
  withdrawals.customDate = internationalNumberFormatter((await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), startDate, endDate, 'TransactionBanking'), status: 1 } })).toFixed(2))
  // withdrawals.delta = createDelta(withdrawals.monthToDate, withdrawals.prevMonthToDate) + ' %'
  withdrawals.monthToDate = internationalNumberFormatter(withdrawals.monthToDate.toFixed(2))
  withdrawals.prevMonthToDate = internationalNumberFormatter(withdrawals.prevMonthToDate.toFixed(2))

  const totalPendingWithdraws = {}

  totalPendingWithdraws.today = internationalNumberFormatter((await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), today, today, 'TransactionBanking'), status: 0 } })).toFixed(2))
  totalPendingWithdraws.yesterday = internationalNumberFormatter((await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), yesterday, yesterday, 'TransactionBanking'), status: 0 } })).toFixed(2))
  totalPendingWithdraws.monthToDate = await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), monthStartDate, today, 'TransactionBanking'), status: 0 } })
  totalPendingWithdraws.prevMonthToDate = await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), previousMonthStartDate, perviousMonthToday, 'TransactionBanking'), status: 0 } })
  totalPendingWithdraws.customDate = internationalNumberFormatter((await db.TransactionBanking.sum('primaryCurrencyAmount', { where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), startDate, endDate, 'TransactionBanking'), status: 0 } })).toFixed(2))
  // totalPendingWithdraws.delta = createDelta(totalPendingWithdraws.monthToDate, totalPendingWithdraws.prevMonthToDate) + ' %'
  totalPendingWithdraws.monthToDate = internationalNumberFormatter(totalPendingWithdraws.monthToDate.toFixed(2))
  totalPendingWithdraws.prevMonthToDate = internationalNumberFormatter(totalPendingWithdraws.prevMonthToDate.toFixed(2))

  const kycStatusPendingWithdrawals = {}

  kycStatusPendingWithdrawals.today = await db.TransactionBanking.findAll({
    where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), today, today, 'TransactionBanking'), status: 0 },
    attributes: [[db.sequelize.literal('sum(primary_currency_amount)'), 'amount']],
    include: [
      { model: db.User, as: 'transactionUser', attributes: ['kycStatus'], required: true }
    ],
    group: ['transactionUser.kyc_status'],
    raw: true
  })

  kycStatusPendingWithdrawals.yesterday = await db.TransactionBanking.findAll({
    where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), yesterday, yesterday, 'TransactionBanking'), status: 0 },
    attributes: [[db.sequelize.literal('sum(primary_currency_amount)'), 'amount']],
    include: [
      { model: db.User, as: 'transactionUser', attributes: ['kycStatus'], required: true }
    ],
    group: ['transactionUser.kyc_status'],
    raw: true
  })

  kycStatusPendingWithdrawals.monthToDate = await db.TransactionBanking.findAll({
    where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), monthStartDate, today, 'TransactionBanking'), status: 0 },
    attributes: [[db.sequelize.literal('sum(primary_currency_amount)'), 'amount']],
    include: [
      { model: db.User, as: 'transactionUser', attributes: ['kycStatus'], required: true }
    ],
    group: ['transactionUser.kyc_status'],
    raw: true
  })

  kycStatusPendingWithdrawals.prevMonthToDate = await db.TransactionBanking.findAll({
    where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), previousMonthStartDate, perviousMonthToday, 'TransactionBanking'), status: 0 },
    attributes: [[db.sequelize.literal('sum(primary_currency_amount)'), 'amount']],
    include: [
      { model: db.User, as: 'transactionUser', attributes: ['kycStatus'], required: true }
    ],
    group: ['transactionUser.kyc_status'],
    raw: true
  })

  kycStatusPendingWithdrawals.customDate = await db.TransactionBanking.findAll({
    where: { ...filterByDateCreatedAt(JSON.parse(JSON.stringify(query)), startDate, endDate, 'TransactionBanking'), status: 0 },
    attributes: [[db.sequelize.literal('sum(primary_currency_amount)'), 'amount']],
    include: [
      { model: db.User, as: 'transactionUser', attributes: ['kycStatus'], required: true }
    ],
    group: ['transactionUser.kyc_status'],
    raw: true
  })

  const splitData = splitPendingWithdrawData(kycStatusPendingWithdrawals)

  return { withdrawals, totalPendingWithdraws, ...splitData }
}

const getPayoutPercentage = ({ totalBets, totalWins }) => {
  if (totalBets === 0 && totalWins === 0) return '0 %'
  if (totalBets === undefined && totalWins === undefined) return '0 %'
  return parseFloat(((totalWins / totalBets) * 100).toFixed(2)) + ' %'
}

export const createGameReport = async (gameReport, type, userId, limit) => {
  const response = []
  if (type === 'provider') {
    for (const provider of gameReport.date.buckets.transactions.group_by_provider.buckets) {
      const mapper = await getProviderMapper()
      response.push({
        identifier: mapper[provider?.key],
        id: provider?.key,
        name: mapper[provider?.key],
        roundCount: internationalNumberFormatter(provider.totalBet.count.value),
        totalBet: internationalNumberFormatter(parseFloat(provider.totalBet.sum.value?.toFixed(2)) || 0.00),
        totalWin: internationalNumberFormatter(parseFloat(provider.totalWin.sum.value?.toFixed(2)) || 0.00),
        GGR: internationalNumberFormatter(parseFloat(provider?.GGR?.value?.toFixed(2)) || 0.00),
        playerCount: internationalNumberFormatter(provider.totalBet.group_by_user.buckets.length),
        payout: getPayoutPercentage({ totalBets: parseFloat(provider.totalBet.sum.value?.toFixed(2)) || 0.00, totalWins: parseFloat(provider.totalWin.sum.value?.toFixed(2)) || 0.00 })
      })
    }
  } else if (type === 'game') {
    for (const provider of gameReport.date.buckets.transactions.group_by_provider.buckets) {
      const gameData = await getOne({ model: db.MasterCasinoGame, data: { identifier: { [Op.iLike]: `%${provider.key}%` } } })
      response.push({
        identifier: provider?.key,
        id: gameData?.masterCasinoGameId,
        name: gameData?.name,
        roundCount: internationalNumberFormatter(provider.totalBet.count.value),
        totalBet: internationalNumberFormatter(parseFloat(provider.totalBet.sum.value?.toFixed(2)) || 0.00),
        totalWin: internationalNumberFormatter(parseFloat(provider.totalWin.sum.value?.toFixed(2)) || 0.00),
        GGR: internationalNumberFormatter(parseFloat(provider?.GGR?.value?.toFixed(2)) || 0.00),
        playerCount: internationalNumberFormatter(provider.totalBet.group_by_user.buckets.length),
        payout: getPayoutPercentage({ totalBets: parseFloat(provider.totalBet.sum.value?.toFixed(2)) || 0.00, totalWins: parseFloat(provider.totalWin.sum.value?.toFixed(2)) || 0.00 })
      })
    }
  }

  if (userId) {
    for (let index = 0; index < response.length; index++) {
      delete response[index].playerCount
    }

    response.sort((a, b) => {
      return parseInt(b.roundCount.replace(/,/g, '')) - parseInt(a.roundCount.replace(/,/g, ''))
    })

    return response.slice(0, limit)
  }

  return response
}

export const getGameReportQuery = ({ query, startDate, endDate, groupBy }) => {
  query.bool.must.push({ match: { status: TRANSACTION_STATUS.SUCCESS } })
  query.bool.must.push({ match: { modelType: MODEL_TYPE.CASINO } })

  const aggs = {
    date: {
      filters: {
        filters: {
          transactions: {
            range: {
              createdAt: {
                from: startDate,
                to: endDate
              }
            }
          }
        }
      },
      aggs: {
        group_by_provider: {
          terms: {
            field: groupBy,
            size: 2147483647
          },
          aggs: {
            totalBet: {
              filter: { term: { transactionType: ACTION.BET } },
              aggs: {
                group_by_user: {
                  terms: {
                    field: 'user.userId',
                    size: 2147483647
                  }
                },
                sum: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                },
                count: {
                  value_count: {
                    field: 'transactionId'
                  }
                }
              }
            },
            totalWin: {
              filter: { term: { transactionType: ACTION.WIN } },
              aggs: {
                sum: {
                  sum: {
                    field: 'transactionAmountPrimary'
                  }
                }
              }
            },
            GGR: {
              bucket_script: {
                buckets_path: {
                  totalBet: 'totalBet>sum',
                  totalWin: 'totalWin>sum'
                },
                script: 'params.totalBet - params.totalWin'
              }
            }
          }
        }
      }
    }
  }
  return { query, aggs }
}

export const getCountryCodeList = ({ userSignup, depositAmount, depositCount }) => {
  const countries = []

  userSignup.forEach(user => countries.push(user.country_code))

  depositAmount.forEach(amount => countries.push(amount.countryCode))

  depositCount.forEach(count => countries.push(count.countryCode))

  return [...new Set(countries)]
}
