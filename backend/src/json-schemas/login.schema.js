import ajv from '../libs/ajv'

/** @type {import("ajv").Schema} */
const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  },
  required: ['email', 'password']
}

ajv.addSchema(loginSchema, '/login.json')
