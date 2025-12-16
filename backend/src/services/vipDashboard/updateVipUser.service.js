import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { sendMail } from '../../libs/sendgridEmailTemp'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { VIP_STATUS, ACCESS_EMAIL_TEMPLATES } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    vipStatus: { type: 'string' },
    comment: { type: ['string', 'null'] }
  },
  required: ['userId', 'vipStatus']
}

const constraints = ajv.compile(schema)

export class UpdateVipUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { UserInternalRating: UserInternalRatingModel, User: UserModel }, sequelizeTransaction: transaction } = this.context
    const { userId, vipStatus, comment } = this.args

    try {
      const userDetail = await UserModel.findOne({
        where: { userId },
        attributes: ['userId', 'email', 'firstName'],
        include: {
          model: UserInternalRatingModel,
          attributes: ['vipStatus', 'rating', 'moreDetails'],
          required: true
        }
      })

      if (!userDetail) return this.addError('UserNotExistsErrorType')

      let updatedDetails = { vipStatus, comment }

      const currentVipStatus = userDetail.UserInternalRating.vipStatus
      const isRejected = vipStatus === VIP_STATUS.REJECTED
      const isApproved = vipStatus === VIP_STATUS.APPROVED
      const isValidRating = userDetail.UserInternalRating.rating >= 0 && userDetail.UserInternalRating.rating <= 5

      if (isRejected) {
        updatedDetails.vipRevokedDate = new Date()
      }
      if (isApproved) {
        updatedDetails.vipApprovedDate = new Date()
      }

      if (isRejected && currentVipStatus !== VIP_STATUS.APPROVED) {
        return this.addError('UserVipApproveErrorType')
      }

      if (isRejected || isValidRating) {
        let emailSentOnVipApproval = userDetail.UserInternalRating.moreDetails?.emailSentOnVipApproval

        if (isApproved && userDetail.email && !emailSentOnVipApproval) {
          const dynamicData = {
            firstName: userDetail.firstName || 'Dear',
            questionnaireLink: `${config.get().userFrontendUrl}/user/account-details/vip-player-interests?email=${userDetail.email}`
          }

          await sendMail({
            email: userDetail.email,
            dynamicData,
            emailTemplate: ACCESS_EMAIL_TEMPLATES.APPROVED_VIP_USER,
            transaction
          })
          emailSentOnVipApproval = true
          updatedDetails = { ...updatedDetails, moreDetails: { ...userDetail.UserInternalRating.moreDetails, emailSentOnVipApproval, emailSentAt: new Date() } }
        }
        await UserInternalRatingModel.update(updatedDetails, { where: { userId }, transaction })

        return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
      }

      return this.addError('UserVipRatingErrorType')
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
