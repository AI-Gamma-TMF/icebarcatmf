import redisClient from '../../libs/redisClient'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class AddUserForSkillBasedQuestionService extends ServiceBase {
  async run () {
    const { userId } = this.args
    const { dbModels: { User: UserModel } } = this.context
    try {
      const user = await UserModel.findOne({ where: { userId: userId }, raw: true })

      if (!user) { return this.addError('UserNotExistsErrorType') }

      if (user.isInternalUser === false) return this.addError('InternalUserSkillQuestionErrorType')

      let trustlyUserIdArray = await redisClient.client.lrange('trustlyUserIdArray', 0, -1)
      trustlyUserIdArray = trustlyUserIdArray.map(Number)

      if (trustlyUserIdArray.includes(+userId)) return this.addError('UserAlreadyExistsErrorType')

      await redisClient.client.rpush('trustlyUserIdArray', userId)

      return { message: SUCCESS_MSG.CREATE_SUCCESS, success: true }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
