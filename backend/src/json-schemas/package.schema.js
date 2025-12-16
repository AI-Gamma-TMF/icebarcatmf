import ajv from '../libs/ajv'

const listSchema = {
  type: 'object',
  properties: {
    isArchive: { type: 'string', enum: ['true', 'false'] },
    csvDownload: { type: 'string' }
  }
}

ajv.addSchema(listSchema, '/package-detail.json')

const createSchemas = {
  type: 'object',
  properties: {
    amount: { type: 'string', pattern: '^(?:[+-]?([0-9]*[.])?[0-9]+)?$' },
    isActive: { type: 'string', enum: ['true', 'false'] },
    isVisibleInStore: { type: 'string', enum: ['true', 'false'] },
    gcCoin: { type: 'string', pattern: '^[0-9]+$' },
    scCoin: { type: 'string', pattern: '^[0-9]+$' },
    image: { type: ['object', 'null'] },
    validTill: { type: ['string', 'null'] },
    firstPurchaseApplicable: { type: 'string', enum: ['true', 'false'] },
    ftpBonuses: { type: ['string', 'null'] },
    purchaseLimitPerUser: { type: 'string' },
    welcomePurchaseBonusApplicable: { type: 'string', enum: ['true', 'false'] },
    welcomePurchaseBonusApplicableMinutes: { type: 'string' },
    welcomePurchasePercentage: { type: 'string' },
    validFrom: { type: ['string', 'null'] },
    bonusSc: { type: 'string', pattern: '^[0-9]+$' },
    bonusGc: { type: 'string', pattern: '^[0-9]+$' },
    playerIds: { type: 'array', items: { type: 'string' } },
    filterType: { type: ['string', 'null'] },
    filterOperator: { type: ['string', 'null'] },
    filterValue: { type: ['string', 'null'] },
    isSpecialPackage: { type: 'boolean' },
    packageName: { type: ['string', 'null'] },
    purchaseNo: { type: 'string', pattern: '^[0-9]+$' },
    intervalsConfig: { type: ['string', 'null'] },
    imageUrl: { type: 'string', format: 'uri', minLength: 1 },
    overwriteSpecialPackage: { type: 'boolean' },
    scratchCardId: { type: ['string', 'null'] },
    freeSpinId: { type: ['string', 'null'] },
    isSubscriberOnly: { type: 'boolean' },
    packageTag: { type: ['string', 'null'] }
  },
  required: [
    'amount',
    'gcCoin',
    'scCoin',
    'isActive',
    'isVisibleInStore'
  ]
}
ajv.addSchema(createSchemas, '/package-create.json')

const updateSchemas = {
  type: 'object',
  properties: {
    amount: { type: 'string', pattern: '^(?:[+-]?([0-9]*[.])?[0-9]+)?$' },
    isActive: { type: 'string', enum: ['true', 'false'] },
    isVisibleInStore: { type: 'string', enum: ['true', 'false'] },
    gcCoin: { type: 'string', pattern: '^[0-9]+$' },
    scCoin: { type: 'string', pattern: '^[0-9]+$' },
    packageId: { type: 'string', pattern: '^[0-9]+$' },
    image: { type: ['object', 'null'] },
    validTill: { type: ['string', 'null'] },
    firstPurchaseApplicable: { type: 'string', enum: ['true', 'false'] },
    firstPurchaseScBonus: { type: ['string', 'null'], pattern: '^(?:[+-]?([0-9]*[.])?[0-9]+)?$' },
    firstPurchaseGcBonus: { type: ['string', 'null'], pattern: '^(?:[+-]?([0-9]*[.])?[0-9]+)?$' },
    purchaseLimitPerUser: { type: 'string' },
    welcomePurchaseBonusApplicable: { type: 'string', enum: ['true', 'false'] },
    welcomePurchaseBonusApplicableMinutes: { type: 'string' },
    welcomePurchasePercentage: { type: 'string' },
    validFrom: { type: ['string', 'null'] },
    bonusSc: { type: 'string', pattern: '^[0-9]+$' },
    bonusGc: { type: 'string', pattern: '^[0-9]+$' },
    playerIds: { type: 'array', items: { type: 'string' } },
    filterType: { type: ['string', 'null'] },
    filterOperator: { type: ['string', 'null'] },
    filterValue: { type: ['string', 'null'] },
    isSpecialPackage: { type: 'string', enum: ['true', 'false'] },
    packageName: { type: ['string', 'null'] },
    purchaseNo: { type: 'string', pattern: '^[0-9]+$' },
    intervalsConfig: { type: ['string', 'null'] },
    imageUrl: { type: 'string', format: 'uri', minLength: 1 },
    overwriteSpecialPackage: { type: 'boolean' },
    scratchCardId: { type: ['string', 'null'] },
    freeSpinId: { type: ['string', 'null'] },
    isSubscriberOnly: { type: 'boolean' },
    packageTag: { type: ['string', 'null'] }
  },
  required: ['packageId']
}
ajv.addSchema(updateSchemas, '/package-update.json')

const updateOrderSchemas = {
  type: 'object',
  properties: {
    order: { type: 'array' }
  },
  required: ['order']
}
ajv.addSchema(updateOrderSchemas, '/package-order.json')

const createConfigSchemas = {
  type: 'object',
  properties: {
    packageId: { type: 'string', pattern: '^[0-9]+$' },
    intervalsConfig: { type: ['array', 'null'] }
  },
  required: [
    'packageId'
  ]
}
ajv.addSchema(createConfigSchemas, '/package-create-config.json')

const importCsvSchema = {
  type: 'object',
  properties: {
    file: {
      type: ['object']
    }
  }
}
ajv.addSchema(importCsvSchema, '/package-import-csv.json')

const getAlllistSchema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    search: { type: 'string' },
    isActive: { type: 'string', enum: ['upcoming', 'expired', 'active', 'all'] },
    isArchive: { type: 'string', enum: ['true', 'false'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    packageId: { type: 'string' },
    packageType: { type: 'string', enum: ['special', 'all', 'welcome', 'purchase', 'basic'] }
  },
  required: ['sort', 'orderBy']
}

ajv.addSchema(getAlllistSchema, '/get-all-package-list.json')
