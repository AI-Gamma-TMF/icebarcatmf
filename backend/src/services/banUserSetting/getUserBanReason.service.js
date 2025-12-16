import ServiceBase from '../../libs/serviceBase'
import { UPDATE_USER_STATUS, USER_STATUS } from '../../utils/constants/constant'
import db from '../../db/models'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetUserBanReasonService extends ServiceBase {
  async run () {
    const { userId } = this.args
    const {
      dbModels: { User: UserModel, BanUserSetting: BanUserSettingModel }
    } = this.context
    try {
      const user = await UserModel.findOne({
        attributes: ['userId', 'email', 'username', 'isActive', 'isBan', 'isRestrict', 'isInternalUser', 'reasonId'],
        where: {
          userId: +userId
        },
        include: [{
          model: BanUserSettingModel,
          as: 'banReason',
          attributes: [
            'reasonId',
            'reasonTitle',
            'reasonDescription',
            'reasonCount'
          ],
          required: true
        }]
      })

      if (!user) {
        return { success: false, message: 'BanUserReasonNotFoundErrorType' }
      }

      let reasonType = ''
      let reasonName = ''
      let status = USER_STATUS.Active
      let statusDetails = {}

      if (!user.isActive) {
        status = USER_STATUS.isActive
        statusDetails = await this.getStatusDetails(user.userId, 'isActive')
        reasonType = UPDATE_USER_STATUS.ACTIVE_USER
        reasonName = 'In-Active'
      } else if (user.isBan) {
        status = USER_STATUS.isBan
        statusDetails = await this.getStatusDetails(user.userId, 'isBan')
        reasonType = UPDATE_USER_STATUS.BAN_UNBAN_USER
        reasonName = 'Banned'
      } else if (user.isRestrict) {
        status = USER_STATUS.isRestrict
        statusDetails = await this.getStatusDetails(user.userId, 'isRestrict')
        reasonType = UPDATE_USER_STATUS.RESTRICT_USER
        reasonName = 'Restricted'
      } else if (user.isInternalUser) {
        status = USER_STATUS.isInternalUser
        statusDetails = await this.getStatusDetails(user.userId, 'isInternalUser')
        reasonType = UPDATE_USER_STATUS.INTERNAL_USER
        reasonName = 'InternalUser'
      }
      if (user?.banReason) {
        user.banReason.dataValues.reasonType = reasonType
        user.banReason.dataValues.reasonName = reasonName
        user.dataValues.statusDetails = statusDetails
        user.dataValues.status = status
      }
      return { data: user, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('Error Occur in GetReasonService')
      return this.addError('InternalServerErrorType', error)
    }
  }

  async getStatusDetails (userId, fieldChanged) {
    const userActivityLog = await db.ActivityLog.findOne({
      attributes: ['remark', 'moreDetails', 'createdAt'],
      where: {
        userId: userId,
        fieldChanged: fieldChanged
      },
      order: [['createdAt', 'DESC']],
      raw: true
    })
    return {
      ...userActivityLog,
      moreDetails: userActivityLog?.moreDetails?.adminDetails,
      favorite: userActivityLog?.moreDetails?.favorite
    }
  }
}
