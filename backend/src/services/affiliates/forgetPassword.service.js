import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import config from '../../configs/app.config'
import { sendMail } from '../../libs/sendgridEmailTemp'
import {ACCESS_EMAIL_TEMPLATES,SEND_EMAIL_TYPES} from '../../utils/constants/constant'

export class ForgetPasswordService extends ServiceBase {
  async run () {
    try {
      let { email} = this.args
      const {
        dbModels: {
            Affiliate: AffiliateModel,
          },
        sequelizeTransaction: transaction
      } = this.context

      const where = { email: email.toLowerCase() }
       
      const checkAffiliateExist = await AffiliateModel.findOne({
        attributes: [
          'affiliateId',
          'email',
          'isEmailVerified',
          'isActive',
          'affiliate_status',
          'phone',
          'phoneCode',
        ],
        where: where,
        transaction
      })

      if (!checkAffiliateExist) return this.addError('AffiliatesNotExistErrorType')

      if (checkAffiliateExist && !checkAffiliateExist?.isEmailVerified) {
        return this.addError('EmailNotVerifiedErrorType')
      } 
      if(!checkAffiliateExist.isActive && checkAffiliateExist.affiliate_status !== 'approved'){
        return this.addError('AffiliateNotApprovedErrorType')
      }

      if (email) {
        const authConfig = config.getProperties().jwt
        const token = await jwt.sign(
          { affiliateId: checkAffiliateExist.affiliateId,
             email
         },
          authConfig.resetPasswordKey,
          {
            expiresIn: authConfig.resetPasswordExpiry
          }
        )
        const affiliateToken = {}
        affiliateToken.token = token
        affiliateToken.affiliateId = checkAffiliateExist.affiliateId
        affiliateToken.tokenType = SEND_EMAIL_TYPES.RESET_PASSWORD
        await AffiliateModel.update(
          {
            newPasswordKey: affiliateToken.token,
            newPasswordRequested: new Date().getTime()
          },
          {
            where: { email }
          },
          { transaction }
        )

        const data = {
          email: checkAffiliateExist.email,
          user_id: checkAffiliateExist.affiliateId,
          userName: checkAffiliateExist.firstName
        }
       
        //  send email for forgetPassword:
       if(checkAffiliateExist.email){
                await sendMail({
                    email: checkAffiliateExist.email,
                    userId: checkAffiliateExist.affiliateId,
                    userName: checkAffiliateExist.firstName,
                    token: token,
                    emailTemplate: ACCESS_EMAIL_TEMPLATES.FORGET_PASSWORD,
                    dynamicData: data,
                    transaction
                })
       } 
       
      } 
      return { success: true, data: {}, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
