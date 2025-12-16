import ajv from '../libs/ajv'

const blockUserCreateSchemas = {
    type: 'object',
    properties: {
        userIds: { type: 'array', items: { type: 'number' } },
        actiontype: { type: 'string' }
    },
    required: ['userIds']
}
ajv.addSchema(blockUserCreateSchemas, '/block-users-add.json')

const getBlockUsersSchema = {
    type: 'object',
    properties: {
        limit: { type: 'string' },
        pageNo: { type: 'string' },
        idSearch: { type: ['string', 'null'] },
        emailSearch: { type: ['string', 'null'] },
        firstNameSearch: { type: ['string', 'null'] },
        lastNameSearch: { type: ['string', 'null'] },
        userNameSearch: { type: ['string', 'null'] },
        phoneSearch: { type: ['string', 'null'] },
        isActive: { type: ['string', 'null'] },
        orderBy: { type: 'string' },
        sort: { type: 'string' },
        csvDownload: { type: ['string', 'null'] },
        tierSearch: { type: ['string', 'null'] }
    }
}
ajv.addSchema(getBlockUsersSchema, '/block-users-get.json')