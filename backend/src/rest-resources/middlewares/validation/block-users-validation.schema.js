export const blockUserCreateSchemas = {
    bodySchema: {
        $ref: '/block-users-add.json'
    },
    responseSchema: {
        default: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' }

            },
            required: ['message']
        }
    }
}

export const geBblockUsersSchemas = {
    bodySchema: {
        $ref: '/block-users-get.json'
    },
    responseSchema: {
        default: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                blockedUsersData: { type: 'object' }

            },
            required: ['message']
        }
    }
}