// const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')

require('dotenv').config()

const ELASTIC_INDEX = {
  TRANSACTIONS: 'moneyFactory-stack-game-transactions'
}

const ELASTIC_MAPPINGS = {
  'moneyFactory-stack-game-transactions': {
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

// var client = new Client({
//   node: process.env.ELASTIC_URL,
//   auth: {
//     username: process.env.ELASTIC_USER,
//     password: process.env.ELASTIC_PASSWORD
//   },
//   tls: {
//     ca: fs.readFileSync(process.env.ELASTIC_HTTP_CRT_PATH),
//     rejectUnauthorized: false
//   }
// })
const URL = 'http://' + process.env.ELASTIC_USER + ':' + process.env.ELASTIC_PASSWORD + '@' + process.env.ELASTIC_URL
const client = new Client({
  node: URL + ':' + process.env.ELASTIC_PORT
})

client.indices.delete({ index: ELASTIC_INDEX.TRANSACTIONS }).then(async () => {
  console.log('-------Elastic Index Deleted-------')

  try {
    await client.indices.create({
      index: ELASTIC_INDEX.TRANSACTIONS,
      body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS]
    })
    console.log('-------Elastic Index Created-------')
  } catch (e) {
    console.log('Error while resetting Elastic please reset manually')
  }
}).catch(async (e) => {
  if (e.body && e.body.error.root_cause[0]?.type === 'index_not_found_exception') {
    try {
      await client.indices.create({
        index: ELASTIC_INDEX.TRANSACTIONS,
        body: ELASTIC_MAPPINGS[ELASTIC_INDEX.TRANSACTIONS]
      })
      console.log('-------Elastic Index Created-------')
    } catch (error) {
      console.log('Error while resetting Elastic please reset manually', error)
    }
  }
})
