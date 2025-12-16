import ajv from '../libs/ajv'

const getSubCategorySchemas = {
  type: 'object',
  properties: {
    limit: {
      type: 'string'
    },
    pageNo: {
      type: 'string'
    },
    search: {
      type: 'string'
    },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    sort: {
      type: 'string',
      enum: ['asc', 'desc']
    },
    orderBy: {
      type: 'string'
    }
  },
  required: []
}
ajv.addSchema(getSubCategorySchemas, '/get-sub-category.json')

const createSubCategorySchemas = {
  type: 'object',
  properties: {
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    name: {
      type: 'string'
    },
    isFeatured: {
      type: 'string',
      enum: ['true', 'false']
    },
    thumbnail: {
      type: 'string'
    },
    selectedThumbnail: {
      type: 'string'
    },
    slug: {
      anyOf: [
        { type: 'string', enum: ['jackpot'] },
        { type: 'null' }
      ]
    }
  },
  required: ['isActive', 'name', 'isFeatured']
}
ajv.addSchema(createSubCategorySchemas, '/create-sub-category.json')

const updateSubCategorySchemas = {
  type: 'object',
  properties: {
    isActive: {
      type: 'string',
      enum: ['true', 'false']
    },
    name: {
      type: 'string'
    },
    masterGameSubCategoryId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    isFeatured: {
      type: 'string',
      enum: ['true', 'false']
    },
    thumbnail: {
      type: 'string'
    },
    selectedThumbnail: {
      type: 'string'
    },
    slug: {
      anyOf: [
        { type: 'string', enum: ['jackpot'] },
        { type: 'null' }
      ]
    }
  },
  required: ['isActive', 'name', 'masterGameSubCategoryId', 'isFeatured']
}
ajv.addSchema(updateSubCategorySchemas, '/update-sub-category.json')

const deleteSubCategorySchemas = {
  type: 'object',
  properties: {
    masterGameSubCategoryId: {
      type: 'number'
    }
  },
  required: ['masterGameSubCategoryId']
}
ajv.addSchema(deleteSubCategorySchemas, '/delete-sub-category.json')

const orderSubCategorySchemas = {
  type: 'object',
  properties: {
    order: {
      type: 'array'
    }
  },
  required: ['order']
}

ajv.addSchema(orderSubCategorySchemas, '/order-sub-category.json')
