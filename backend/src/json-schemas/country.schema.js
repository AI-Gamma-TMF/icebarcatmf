import ajv from '../libs/ajv'

const countryListSchemas = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    name: { type: 'string' },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'] }
  },
  required: []
}
ajv.addSchema(countryListSchemas, '/country-list.json')

const countryListAllSchemas = {
  type: 'object',
  properties: {
  },
  required: []
}
ajv.addSchema(countryListAllSchemas, '/country-all.json')

const countryRestrictedSchemas = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    itemId: { type: 'string' },
    type: { type: 'string' }
  },
  required: ['type', 'pageNo', 'itemId', 'limit']
}
ajv.addSchema(countryRestrictedSchemas, '/country-restricted.json')

const countryUnrestrictedSchemas = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    itemId: { type: 'string' },
    type: { type: 'string' }
  },
  required: ['type', 'pageNo', 'itemId', 'limit']
}
ajv.addSchema(countryUnrestrictedSchemas, '/country-unrestricted.json')

const countryRestrictedItemSchemas = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    countryId: { type: 'string' },
    type: { type: 'string' }
  },
  required: ['type', 'pageNo', 'countryId', 'limit']
}
ajv.addSchema(countryRestrictedItemSchemas, '/country-restricted-item.json')

const countryUnRestrictedItemSchemas = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    itemId: { type: 'string' },
    type: { type: 'string' }
  },
  required: ['type', 'pageNo', 'itemId', 'limit']
}
ajv.addSchema(countryUnRestrictedItemSchemas, '/country-unrestricted-item.json')

const countryRestrictedAddSchemas = {
  type: 'object',
  properties: {
    countryId: { type: 'number' },
    itemIds: { type: 'array' },
    type: { type: 'string' }
  },
  required: ['type', 'itemIds', 'countryId']
}
ajv.addSchema(countryRestrictedAddSchemas, '/country-restricted-add.json')

const countryRestrictedItemAddSchemas = {
  type: 'object',
  properties: {
    countryIds: { type: 'array' },
    itemId: { type: 'number' },
    type: { type: 'string' }
  },
  required: ['type', 'itemId', 'countryIds']
}
ajv.addSchema(countryRestrictedItemAddSchemas, '/country-restricted-item-add.json')
const countryRestrictedItemDeleteSchemas = {
  type: 'object',
  properties: {
    countryId: { type: 'number' },
    itemIds: { type: 'array' },
    type: { type: 'string' }
  },
  required: ['type', 'itemIds', 'countryId']
}
ajv.addSchema(countryRestrictedItemDeleteSchemas, '/country-restricted-item-delete.json')

const countryRestrictedDeleteSchemas = {
  type: 'object',
  properties: {
    countryIds: { type: 'array' },
    itemId: { type: 'number' },
    type: { type: 'string' }
  },
  required: ['type', 'itemId', 'countryIds']
}
ajv.addSchema(countryRestrictedDeleteSchemas, '/country-restricted-delete.json')

const addDomainSchema = {
  type: 'object',
  properties: {
    domainName: { type: 'string' }
  },
  required: ['domainName']
}
ajv.addSchema(addDomainSchema, '/add-domain.json')
