import ajv from '../libs/ajv'

const emailListSchemas = {
  type: 'object',
  properties: {
  },
  required: []
}
ajv.addSchema(emailListSchemas, '/email-list.json')

const emailUpdateSchemas = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'number' },
    label: {
      type: 'string'
    },
    dynamicData: {
      type: 'array'
    },
    templateCode: {
      type: 'string'
    },
    language: { type: 'string', maxLength: 2 }
  },
  required: ['emailTemplateId', 'label', 'dynamicData', 'templateCode', 'language']
}
ajv.addSchema(emailUpdateSchemas, '/email-update.json')

const emailDeleteSchemas = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'number' }
  },
  required: ['emailTemplateId']
}
ajv.addSchema(emailDeleteSchemas, '/email-delete.json')

const emailDetailsSchemas = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'string' }
  },
  required: ['emailTemplateId']
}

ajv.addSchema(emailDetailsSchemas, '/email-details.json')

const credentialsUpdateSchemas = {
  type: 'object',
  properties: {
    sendgridKey: {
      type: 'string'
    },
    sendgridEmail: {
      type: 'string',
      format: 'email'
    }
  },
  required: ['sendgridKey', 'sendgridEmail']
}
ajv.addSchema(credentialsUpdateSchemas, '/credentials-update.json')

const languageDeleteSchemas = {
  type: 'object',
  properties: {
    emailTemplateId: { type: 'number' },
    language: { type: 'string' }
  },
  required: ['emailTemplateId', 'language']
}
ajv.addSchema(languageDeleteSchemas, '/email-language-delete.json')

const emailDynamicSchemas = {
  type: 'object',
  properties: {
  },
  required: []
}
ajv.addSchema(emailDynamicSchemas, '/email-dynamic.json')

const emailTestSchemas = {
  type: 'object',
  properties: {
    dynamicData: {
      type: 'object'
    },
    testEmail: {
      type: 'string',
      format: 'email'
    },
    templateCode: { type: 'string' }
  },
  required: ['testEmail', 'templateCode', 'dynamicData']
}
ajv.addSchema(emailTestSchemas, '/email-test.json')

const getCategoryListSchemas = {
  type: 'object',
  properties: {
  },
  required: []
}
ajv.addSchema(getCategoryListSchemas, '/email-category-list.json')

const createTemplateSchemas = {
  type: 'object',
  properties: {
    templateEmailCategoryId: { type: 'number' },
    subject: {
      type: 'string'
    },
    dynamicData: {
      type: 'array'
    },
    templateCode: {
      type: 'string'
    },
    scheduledAt: {
      type: 'string'
    },
    language: { type: 'string', maxLength: 2 }
  },
  required: ['templateEmailCategoryId', 'subject', 'dynamicData', 'templateCode', 'language', 'scheduledAt']
}
ajv.addSchema(createTemplateSchemas, '/create-email-template.json')

const updateTemplateSchemas = {
  type: 'object',
  properties: {
    templateEmailCategoryId: { type: 'number' },
    emailTemplateId: { type: 'number' },
    subject: {
      type: 'string'
    },
    dynamicData: {
      type: 'array'
    },
    templateCode: {
      type: 'string'
    },
    scheduledAt: {
      type: 'string'
    },
    language: { type: 'string', maxLength: 2 }
  },
  required: ['templateEmailCategoryId', 'emailTemplateId', 'subject', 'dynamicData', 'templateCode', 'language', 'scheduledAt']
}
ajv.addSchema(updateTemplateSchemas, '/update-email-template.json')
