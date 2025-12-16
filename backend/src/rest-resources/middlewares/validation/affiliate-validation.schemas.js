export const createAffiliateSchemas = {
      bodySchema: {
          $ref: '/create-affiliate.json' 
      },
      responseSchema: {
          default: {
              type: 'object',
              properties: {
                  message: { type: 'string'},
                  createAffiliate : { type: 'object'}
              },
              required: ['message']
          }
      }
}

export const affiliateListSchemas = {
    querySchema: {
        $ref: '/all-affiliate-list.json' 
    },
    responseSchema: {
        default: {
            type: 'object',
            properties: {
                message: { type: 'string'},
                affiliatesDetails: { type: 'object' }
            },
            required: ['message']
        }
    }
}

export const affiliateUpdateSchemas = {
    bodySchema: {
        $ref: '/update-affiliate.json' 
    },
    responseSchema: {
        default: {
            type: 'object',
            properties: {
                message: { type: 'string'},
            },
            required: ['message']
        }
    }
}

export const affiliateDeleteSchemas = {
    paramsSchema: {
      $ref: '/delete-affiliate.json'
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  }

  export const getAffiliateDetailsSchema = {
    querySchema: {
      type: 'object',
      properties: {
        affiliateId: { type: 'string' }
      }
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
            message: { type: 'string'},
            getAffiliateDetail: { type: 'object' }
        },
        required: ['message']
      }
    }
  } 

  export const loginAffiliateSchemas = {
    bodySchema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['email', 'password']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          affiliate: { type: 'object' },
          message: { type: 'string' }
        },
        required: ['message']
      }
    }
  }

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

export const updateProfileSchemas = {
  bodySchema: {
    $ref: '/updateProfile.json'
  }
}

export const approveAffiliateSchemas = {
   bodySchema: {
      type : 'object',
      properties: {
        affiliateId: {type: 'number'},
        email: {type: 'string', format: 'email'},
        isActive : {type: 'boolean'},
        affiliate_status : {type: 'string'}
      },
      required: ['affiliateId','email','isActive','affiliate_status']
   }
}

// set passwordSchema
export const setPasswordSchema = {
  bodySchema: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['token', 'password']
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

export const changePasswordSchemas = {
  bodySchema: {
    $ref: '/changePassword.json'
  }
}

export const forgetPasswordSchema = {
  bodySchema: {
    $ref: '/forgetPassword.json'
  }
}

export const verifyForgetPasswordSchema = {
  bodySchema: {
    $ref: '/verifyForgetPassword.json'
  }
}

export const affiliateSearchListSchemas = {
  querySchema: {
    $ref: '/affiliate-search-list.json'
  },
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' }
      },
      required: ['message']
    }
  }
}

export const scaleoDetailSchema = {
  querySchema: {
    type: 'object',
    properties: {
      api_key: { type: 'string' },
      date_start: { type: 'string' },
      date_end: { type: 'string' },
      type: { type: 'string' },
      page: { type: 'string' },
      perpage: { type: 'string' }
    },
    required: ['api_key']
  },
}