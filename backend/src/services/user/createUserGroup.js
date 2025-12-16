import ajv from '../../libs/ajv'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'

const schema = {
  type: 'object',
  properties: {
    groupName: { type: 'string' },
    userCsv: { type: 'object' }
  },
  required: ['userType', 'userCsv']
}
const constraints = ajv.compile(schema)

export class CreateUserGroup extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userCsv, groupName } = this.args

    try {
      if (typeof (userCsv) === 'object' && userCsv.mimetype === 'application/vnd.ms-excel') {
        const xlsx = require('node-xlsx')
        const data = xlsx.parse(userCsv.buffer)[0].data
        const resultObject = {}

        for (let i = 1; i < data.length; i++) {
          const playerId = data[i][0]

          if (playerId !== undefined) {
            const userExist = await db.User.findOne({ where: { userId: playerId }, attributes: ['userId'] })
            if (userExist) { resultObject[playerId] = playerId }
          }
        }
        const createGroup = await db.PlayerGroup.create({ groupName, userIds: resultObject })
        return { success: true, groupId: createGroup.groupId }
      } else {
        return this.addError('SomethingWentWrongErrorType', 'Only xls format sheet is allowed')
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
