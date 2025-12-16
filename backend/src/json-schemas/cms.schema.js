import ajv from '../libs/ajv'

const cmsCreateSchemas = {
  type: 'object',
  properties: {
    title: { type: 'object' },
    slug: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_#]*$'
    },
    content: { type: 'object' },
    category: { type: ['number'] },
    cmsType: { type: ['number'] },
    targetUrl: { type: 'string' },
    isActive: { type: 'boolean' },
    isHidden: { type: 'boolean' },
    showTermAndConditions: { type: 'boolean' }
  },
  required: ['title', 'category', 'isActive', 'cmsType']
}
ajv.addSchema(cmsCreateSchemas, '/cms-create.json')

const cmsDeleteSchemas = {
  type: 'object',
  properties: {
    cmsPageId: { type: 'number' },
    language: { type: 'string' }
  },
  required: ['cmsPageId', 'language']
}
ajv.addSchema(cmsDeleteSchemas, '/cms-delete.json')

const cmsDeletePageSchemas = {
  type: 'object',
  properties: {
    cmsPageId: { type: 'number' }
  },
  required: ['cmsPageId']
}
ajv.addSchema(cmsDeletePageSchemas, '/cms-delete-page.json')

const cmsDetailsSchemas = {
  type: 'object',
  properties: {
    cmsPageId: { type: 'string', maxLength: 9, pattern: '^[0-9]+$' }
  },
  required: ['cmsPageId']
}
ajv.addSchema(cmsDetailsSchemas, '/cms-details.json')

const cmsDynamicSchemas = {
  type: 'object',
  properties: {
  },
  required: []
}
ajv.addSchema(cmsDynamicSchemas, '/cms-dynamic.json')

const cmsListSchemas = {
  type: 'object',
  properties: {
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    search: { type: 'string' },
    isActive: {
      type: ['string'],
      enum: ['true', 'false', 'all']
    },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] }
  },
  required: []
}
ajv.addSchema(cmsListSchemas, '/cms-list.json')

const cmsUpdateSchemas = {
  type: 'object',
  properties: {
    cmsPageId: { type: 'number' },
    title: {
      type: 'object'
    },
    slug: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_#]*$'
    },
    content: {
      type: 'object'
    },
    category: { type: ['number'] },
    isActive: { type: 'boolean' },
    cmsType: { type: ['number'] },
    targetUrl: { type: 'string' },
    isHidden: { type: 'boolean' },
    showTermAndConditions: { type: 'boolean' }
  },
  required: ['cmsPageId', 'title', 'category', 'isActive', 'cmsType']
}
ajv.addSchema(cmsUpdateSchemas, '/cms-update.json')
