import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE } from '../../utils/constants/constant'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    userName: { type: 'string' },
    reason: { type: 'string' }
  },
  required: ['userName', 'reason']
}

const constraints = ajv.compile(schema)

export class DeleteUserName extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, userName, reason } = this.args
    const {
      dbModels: {
        User: UserModel,
        GlobalSetting: GlobalSettingModel,
        ActivityLog: ActivityLogModel
      },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const userDetails = await UserModel.findOne({
        where: { userId: userId },
        attributes: ['userId', 'username'],
        transaction
      })

      if (!userDetails) {
        return this.addError('UserNotExistsErrorType')
      }

      const globalSetting = await GlobalSettingModel.findOne({
        where: { key: 'PROFANE_WORDS_LIST' },
        attributes: ['value'],
        transaction
      })

      let currentValue = JSON.parse(globalSetting.value || '[]')

      if (!Array.isArray(currentValue)) {
        currentValue = []
      }

      if (!currentValue.includes(userName)) {
        currentValue.push(userName)
      }

      await Promise.all([
        UserModel.update(
          { username: null },
          { where: { username: userName }, transaction }
        ),

        ActivityLogModel.create(
          {
            actioneeId: user?.adminUserId,
            actioneeType: ROLE.ADMIN,
            fieldChanged: 'Username',
            originalValue: userName,
            changedValue: null,
            userId: userDetails.userId,
            moreDetails: { favorite: false },
            remark: reason
          },
          { transaction }
        ),

        GlobalSettingModel.update(
          {
            value: JSON.stringify(currentValue)
          },
          { where: { key: 'PROFANE_WORDS_LIST' }, transaction }
        )
      ])

      await removeData('profaneWordsList')

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.error('Error in DeleteUserName service:', error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
