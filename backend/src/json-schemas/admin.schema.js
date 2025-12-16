import ajv from '../libs/ajv'

const adminDetailsSchemas = {
  type: 'object',
  properties: {
    adminUserId: { type: 'string', maxLength: 9, pattern: '^[0-9]+$' }
  },
  required: []
}
ajv.addSchema(adminDetailsSchemas, '/admin-details.json')

const adminUpdateSchemas = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    permission: { type: 'object' },
    group: { type: 'string' },
    adminUsername: { type: 'string' },
    role: { type: 'string' },
    adminId: { type: 'number' },
    scLimit: { type: ['number', 'null'] },
    gcLimit: { type: ['number', 'null'] }
  },
  required: ['adminId', 'firstName', 'lastName', 'email', 'adminUsername']
}
ajv.addSchema(adminUpdateSchemas, '/admin-update.json')

const adminDeleteSchemas = {
  type: 'object',
  properties: {
    adminId: { type: 'number' }
  },
  required: ['adminId']
}
ajv.addSchema(adminDeleteSchemas, '/admin-delete.json')

const adminCreateSchemas = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    permission: { type: 'object' },
    adminUsername: { type: 'string' },
    role: { type: 'string' },
    group: { type: 'string' },
    adminId: { type: 'number' },
    scLimit: { type: ['number', 'null'] },
    gcLimit: { type: ['number', 'null'] }
  },
  required: ['email', 'password', 'role']
}
ajv.addSchema(adminCreateSchemas, '/admin-create.json')

const adminListSchemas = {
  type: 'object',
  properties: {
    pageNo: { type: 'string' },
    limit: { type: 'string' },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    adminId: { type: 'string' },
    roleId: { type: 'string' },
    search: { type: 'string' },
    status: { type: 'string' }
  },
  required: ['sort', 'orderBy']
}
ajv.addSchema(adminListSchemas, '/admin-list.json')

const adminAddBalanceSchemas = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    coinType: { type: 'string' },
    operationType: { type: 'number' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    remarks: { type: 'string' }
  },
  required: ['userId', 'coinType', 'operationType', 'remarks']
}
ajv.addSchema(adminAddBalanceSchemas, '/admin-add-balance.json')

const adminChildrenSchemas = {
  type: 'object',
  properties: {
    roleId: { type: 'string' },
    adminId: { type: ['string'] }
  },
  required: ['adminId']
}
ajv.addSchema(adminChildrenSchemas, '/admin-children.json')
const updateConfigSchemas = {
  type: 'object',
  properties: {
    supportEmail: { type: 'string', format: 'email' },
    siteName: { type: 'string' },
    origin: { type: 'string' },
    minRedeemableCoins: { type: 'string' },
    maxRedeemableCoins: { type: 'string' },
    scToGcRate: { type: 'string' },
    xpScToGcRate: { type: 'string' },
    scSpinLimit: { type: 'string' },
    gcSpinLimit: { type: 'string' },
    gcVaultPercentage: { type: 'string' },
    scVaultPercentage: { type: 'string' },
    kycDepositAmount: { type: 'string' },
    kycRedeemAmount: { type: 'string' },
    cardPurchaseAmount: { type: 'string' },
    amoeBonusTime: { type: 'string' },
    vipMinQuestionnaireBonus: { type: 'string' },
    vipMaxQuestionnaireBonus: { type: 'string' },
    vipNgrQuestionnaireMultiplier: { type: 'string' }
  },
  required: ['vipMinQuestionnaireBonus', 'vipMaxQuestionnaireBonus', 'vipNgrQuestionnaireMultiplier', 'supportEmail', 'siteName', 'origin', 'minRedeemableCoins', 'maxRedeemableCoins', 'scToGcRate', 'xpScToGcRate']
}
ajv.addSchema(updateConfigSchemas, '/admin-config-update.json')

const adminUpdateProfileSchemas = {
  type: 'object',
  properties: {
    firstName: { type: 'string', pattern: '^[a-zA-Z0-9 ]*$' },
    lastName: { type: 'string', pattern: '^[a-zA-Z0-9 ]*$' },
    oldPassword: { type: 'string' },
    newPassword: { type: 'string' }
  },
  required: []
}
ajv.addSchema(adminUpdateProfileSchemas, '/admin-update-profile.json')
