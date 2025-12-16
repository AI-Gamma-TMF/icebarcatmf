export const userListSchemas = {
  querySchema: {
    $ref: '/user-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        users: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const userDetailsSchemas = {
  querySchema: {
    $ref: '/user-details.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const userDocumentSchemas = {
  querySchema: {
    $ref: '/user-document.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        userDocument: { type: 'array' }
      },
      required: ['message']
    }
  }
}
export const userWithdrawRequestsSchemas = {
  querySchema: {
    $ref: '/user-withdraw-request.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        withdrawRequest: { type: 'object' }
      },
      required: ['message']
    }
  }
}
export const userDailyLimitSchemas = {
  bodySchema: {
    $ref: '/user-daily-limit.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        limit: { type: 'object' }
      },
      required: ['limit']
    }
  }
}
export const userDepositLimitSchemas = {
  bodySchema: {
    $ref: '/user-deposit-limit.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        limit: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const userLossLimitSchemas = {
  bodySchema: {
    $ref: '/user-loss-limit.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        limit: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const userSetSessionTimeLimitSchemas = {
  bodySchema: {
    $ref: '/user-set-session-time.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        limit: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const userDisableUntilSchemas = {
  bodySchema: {
    $ref: '/user-disable-until.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        updateDisableUntil: {
          anyOf: [
            { type: 'array' },
            { type: 'object' }
          ]
        },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const userVerifyDocumentSchemas = {
  bodySchema: {
    $ref: '/user-verify-document.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        updateUserDocument: { type: 'array' },
        message: { type: 'string' }
      },
      required: ['message']
    }
  }
}
export const responsibleGamblingSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      responsibleGamblingType: { type: 'string' },
      limitType: { type: 'string' },
      timeBreakDuration: { type: 'string' },
      selfExclusion: { type: 'boolean' },
      amount: { type: 'number' },
      userId: { type: 'number' },
      reason: { type: 'string' },
      favorite: { type: ['boolean', 'null'] }
    },
    required: ['responsibleGamblingType']
  }
}
export const restResponsibleGamblingSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      responsibleGamblingType: { type: 'string' },
      limitType: { type: 'string' },
      timeBreakDuration: { type: 'string' },
      selfExclusion: { type: 'boolean' },
      amount: { type: 'number' },
      userId: { type: 'number' }
    },
    required: ['responsibleGamblingType', 'userId']
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

export const updateUserPasswordSchema = {
  bodySchema: {
    $ref: '/update-user-password-request.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const updateUserStatusSchema = {
  bodySchema: {
    $ref: '/update-user-status-request.json'
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

export const deleteUserNameSchema = {
  bodySchema: {
    $ref: '/user-delete-username.json'
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

export const updateUserBankDetailsSchema = {
  bodySchema: {
    $ref: '/update-user-bank-details.json'
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

export const userCasinoDetailsSchemas = {
  querySchema: {
    $ref: '/user-casino-details.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        userCasinoDetail: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const removeUserPwLockSchema = {
  bodySchema: {
    $ref: '/remove-user-pw-lock.json'
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

export const updateSsnSchema = {
  bodySchema: {
    $ref: '/update-ssn.json'
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

export const updateProfileSchemas = {
  bodySchema: {
    $ref: '/update-user-profile.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const addCommentSchema = {
  bodySchema: {
    $ref: '/add-comment.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const uploadUserDocumentSchema = {
  bodySchema: {
    $ref: '/upload-document.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' }
      },
      required: ['message', 'success']
    }
  }
}

export const activityLogSchema = {
  querySchema: {
    $ref: '/activity-log.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        activityLogs: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['message', 'success', 'activityLogs']
    }
  }
}

export const userActivitySchemas = {
  querySchema: {
    $ref: '/user-activity.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        data: { type: 'object' },
        message: { type: 'string' },
        success: { type: 'boolean' }
      }
    }
  }
}

export const userGroupSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      groupName: {
        type: 'string'
      }
    },
    required: ['groupName']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        groupId: { type: 'number' }
      },
      required: ['success']
    }
  }
}

export const rulesSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      ruleName: { type: 'string' },
      activity: { type: 'number' },
      criteria: { type: 'string' },
      countryId: { type: 'number' },
      groupId: { type: 'number' },
      singleAmount: { type: 'number' },
      sumAmount: { type: 'number' },
      withSameIp: { type: 'boolean' },
      withSameDevice: { type: 'boolean' },
      isDuplicate: { type: 'boolean' },
      isSameAddress: { type: 'boolean' },
      count: { type: 'number' },
      isEmail: { type: 'boolean' },
      isAlert: { type: 'boolean' },
      isRestrict: { type: 'boolean' },
      providerId: { type: 'number' },
      days: { type: 'number' },
      emails: { type: 'array' }
    },
    required: ['ruleName', 'activity']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' }
      },
      required: ['success']
    }
  }
}

export const updateRuleSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      antiFraudRuleId: { type: 'number' },
      isActive: { type: 'boolean' },
      isDeleted: { type: 'boolean' }
    },
    required: ['antiFraudRuleId']
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['success']
    }
  }
}

export const userRuleSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      activity: {
        type: 'string'
      },
      search: {
        type: 'string'
      }
    },
    required: []
  }
}

export const updateKycSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      user: { type: 'object' },
      userId: { type: 'number' },
      kycLevel: { type: 'string' },
      reason: { type: 'string' },
      favorite: { type: 'boolean' }
    },
    required: ['userId', 'kycLevel']
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

export const disable2FASchema = {
  bodySchema: {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      reason: { type: 'string' },
      favorite: { type: ['boolean', 'null'] }
    },
    required: ['userId', 'reason']
  }
}

export const providerListSchema = {
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        casinoProvider: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            rows: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' }
                }
              }
            }
          }
        }
      },
      required: ['message']
    }
  }
}
export const addUserForSkillQuestionSchemas = {
  bodySchema: {
    type: 'object',
    properties: {
      userId: { type: 'integer' }
    },
    required: ['userId']
  }
}
