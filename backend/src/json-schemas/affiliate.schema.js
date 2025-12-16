import ajv from '../libs/ajv'

const createAffiliateSchemas = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    permission: { type: 'object' },
    isActive: { type: 'boolean' },
    phoneCode: { type: 'string' },
    phone: { type: 'string' },
    state: { type: 'string' },
    preferredContact: { type: 'string' },
    trafficSource: { type: 'string' },
    plan: { type: 'string' },
    isTermsAccepted: { type: 'boolean' }
  },
  required: [
    'firstName',
    'lastName',
    'email',
    'phoneCode',
    'phone',
    'state',
    'preferredContact',
    'trafficSource',
    'plan',
    'isTermsAccepted'
  ]
}
ajv.addSchema(createAffiliateSchemas, '/create-affiliate.json')

const affiliateListSchemas = {
  type: 'object',
  properties: {
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    emailSearch: { type: 'string' },
    firstNameSearch: { type: 'string' },
    lastNameSearch: { type: 'string' },
    idSearch: { type: 'string' },
    phoneSearch: { type: 'string' }
  }
}

ajv.addSchema(affiliateListSchemas, '/all-affiliate-list.json')

const affiliateUpdateSchemas = {
  type: 'object',
  properties: {
    affiliateId: { type: 'number' },
    permission: { type: 'object' },
    isActive: { type: 'boolean' }
  },
  required: ['affiliateId']
}
ajv.addSchema(affiliateUpdateSchemas, '/update-affiliate.json')

const affiliateDeleteSchemas = {
  type: 'object',
  properties: {
    affiliateId: { type: 'string' }
  },
  required: ['affiliateId']
}
ajv.addSchema(affiliateDeleteSchemas, '/delete-affiliate.json')

const updateProfileSchemas = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    dateOfBirth: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    phoneCode: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    preferredContact: {
      type: 'string'
    },
    addressLine_1: {
      type: 'string'
    },
    addressLine_2: {
      type: ['string', 'null']
    },
    city: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    zipCode: {
      type: 'string'
    },
    plan: {
      type: 'string'
    },
    trafficSource: {
      type: 'string'
    }
  },
  required: []
}

ajv.addSchema(updateProfileSchemas, '/updateProfile.json')

const changePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string'
    },
    newPassword: {
      type: 'string'
    }
  },
  required: ['oldPassword', 'newPassword']
}

ajv.addSchema(changePasswordSchema, '/changePassword.json')

const forgetPasswordSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  },
  required: ['email']
}

ajv.addSchema(forgetPasswordSchema, '/forgetPassword.json')

const verifyForgetPasswordSchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string'
    },
    newPasswordKey: {
      type: 'string'
    },
    confirmPassword: {
      type: 'string'
    }
  },
  required: ['newPasswordKey', 'password']
}

ajv.addSchema(verifyForgetPasswordSchema, '/verifyForgetPassword.json')

const affiliateSearchListSchemas = {
  type: 'object',
  properties: {
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    idSearch: { type: 'string' },
    emailSearch: { type: 'string' },
    firstNameSearch: { type: 'string' },
    lastNameSearch: { type: 'string' },
    phoneSearch: { type: 'string' }
  },
  required: []
}
ajv.addSchema(affiliateSearchListSchemas, '/affiliate-search-list.json')
