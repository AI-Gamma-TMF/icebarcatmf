import ajv from '../libs/ajv'

const bannerUploadSchemas = {
  type: 'object',
  properties: {
    visibility: { type: 'string', enum: ['0', '1', '2'] }, // 0 - Before Login, 1 - After Login, 2 - Both
    btnText: { type: ['string', 'null'] },
    navigateRoute: {
      type: ['string', 'null']
    },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    pageRoute: {
      type: ['string', 'null']
    },
    isCountDown: { type: 'string', enum: ['true', 'false'] },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    isNavigate: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['visibility', 'isActive']
}
ajv.addSchema(bannerUploadSchemas, '/banner-upload.json')

const updateSchemas = {
  type: 'object',
  properties: {
    pageBannerId: { type: 'string', pattern: '^[0-9]+$' },
    btnText: { type: ['string', 'null'] },
    navigateRoute: {
      type: ['string', 'null']
    },
    textOne: { type: ['string', 'null'] },
    textTwo: { type: ['string', 'null'] },
    name: { type: ['string', 'null'] },
    textThree: { type: ['string', 'null'] },
    isActive: { type: 'string', enum: ['true', 'false'] },
    pageRoute: {
      type: ['string', 'null']
    },
    isCountDown: { type: 'string', enum: ['true', 'false'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    isNavigate: { type: 'string', enum: ['true', 'false'] }
  },
  required: ['pageBannerId', 'isActive']
}
ajv.addSchema(updateSchemas, '/banner-update.json')

const deleteSchemas = {
  type: 'object',
  properties: {
    pageBannerId: { type: 'number' }
  },
  required: ['pageBannerId']
}
ajv.addSchema(deleteSchemas, '/banner-delete.json')

const getSchemas = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    visibility: { type: ['string', 'null'], enum: ['0', '1'] },
    status: { type: 'string', enum: ['true', 'false', 'all'] },
    pageBannerId: { type: 'string' },
    orderBy: {
      type: 'string'
    },
    sort: {
      type: 'string'
    },
    search: { type: ['string', 'null', 'number'] }
  },
  required: []
}
ajv.addSchema(getSchemas, '/banner-get.json')

const getKeysSchemas = {
  type: 'object',
  properties: {},
  required: []
}
ajv.addSchema(getKeysSchemas, '/banner-keys.json')

const orderBannerSchemas = {
  type: 'object',
  properties: {
    order: {
      type: 'array'
    }
  },
  required: ['order']
}

ajv.addSchema(orderBannerSchemas, '/order-banner.json')
