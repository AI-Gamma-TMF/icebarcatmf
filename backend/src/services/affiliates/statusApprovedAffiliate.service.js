import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { updateEntity, getOne } from '../../utils/crud'
import { sendMail } from '../../libs/sendgridEmailTemp'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ACCESS_EMAIL_TEMPLATES } from '../../utils/constants/constant'
export class StatusApprovedAffiliatesService extends ServiceBase {
  async run () {
    const {
      dbModels: { Affiliate: AffiliateModel, AdminRole: AdminRoleModel },
      sequelizeTransaction: transaction
    } = this.context

    let { affiliateId, email, isActive, affiliate_status } = this.args

    try {
      const query = {
        email: email,
        affiliateId: affiliateId,
        isActive: isActive
      }

      let checkAffiliateExist = await getOne({
        model: AffiliateModel,
        data: query,
        transaction
      })
      if (!checkAffiliateExist)
        return this.addError('AffiliatesNotExistErrorType')
      if (checkAffiliateExist.affiliate_status == 'approved')
        return this.addError('AffiliateAlreadyApprovedErrorType')

      let affiliateCode = checkAffiliateExist.affiliateCode
      let url = ''
      if (!affiliateCode) {
        affiliateCode = uuid()
        url = `${config.get('userFrontendUrl')}?affiliateCode=${affiliateCode}`
      }
      const affiliateRoleExist = await AdminRoleModel.findOne({
        where: { level: 4 } //affiliate role
      })
      if (!affiliateRoleExist) {
        return this.addError('AffiliatesRoleNotExistsErrorType')
      }

      let updateObj = {
        affiliate_status: affiliate_status.toLowerCase(),
        affiliateCode
      }
      async function setToken (email, affiliateId, affiliateCode) {
        let payload = { email }
        if (affiliateId) payload.affiliateId = affiliateId
        if (affiliateCode) payload.affiliateCode = affiliateCode
        return jwt.sign(payload, config.get('jwt.emailTokenKey'), {
          expiresIn: config.get('jwt.emailTokenExpiry')
        })
      }

      try {
        // Generate the token
        const emailToken = await setToken(email, affiliateId, affiliateCode)

        // updateObj.emailToken = emailToken;
        updateObj.email = email
        updateObj.affiliateId = affiliateId
        if (affiliateRoleExist) {
          updateObj.roleId = affiliateRoleExist.level
        }

        // Update the entity
        const updateAffiliateData = await updateEntity({
          model: AffiliateModel,
          values: query,
          data: updateObj,
          transaction: transaction
        })

        // Send email for verify email
        if (updateObj.email) {
          await sendMail({
            email: updateObj.email,
            userId: updateObj.affiliateId,
            emailTemplate: ACCESS_EMAIL_TEMPLATES.VERIFY_EMAIL,
            token: emailToken,
            dynamicData: {
              email: updateObj.email,
              userId: updateObj.affiliateId,
              userName: checkAffiliateExist.firstName
            },
            transaction
          })
        }

        return {
          data: updateObj,
          message: SUCCESS_MSG.UPDATE_SUCCESS
        }
      } catch (err) {
        console.error('Error:', err)
        // Handle error
        this.addError('InternalServerErrorType', err)
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
