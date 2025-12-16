import ajv from '../../libs/ajv'
import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import redisClient from '../../libs/redisClient'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    userIds: { type: 'array', items: { type: 'number' }, minItems: 1 },
    blockUser: { type: 'boolean' }
  },
  required: ['userIds', 'blockUser']
}
const constraints = ajv.compile(schema)

export class AddBlockedUsers extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userIds, blockUser } = this.args
    try {
      const transaction = this.context.sequelizeTransaction

      await redisClient.client.del('blocked-users')

      const formattedUsers = userIds.map(userId => ({
        userId: userId,
        isAvailPromocodeBlocked: blockUser
      }))

      if (blockUser) {
        await db.BlockedUsers.bulkCreate(formattedUsers, {
          updateOnDuplicate: ['isAvailPromocodeBlocked']
        }, { transaction })

        return { status: 200, message: SUCCESS_MSG.BLOCK_SUCCESS }
      } else {
        await db.BlockedUsers.update(
          { isAvailPromocodeBlocked: false },
          { where: { userId: userIds }, transaction }
        )

        return { status: 200, message: SUCCESS_MSG.UNBLOCK_SUCCESS }
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
      return { status: 500, message: error }
    }
  }
}
