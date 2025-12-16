import jwt from 'jsonwebtoken'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import { v4 as uuid } from 'uuid'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity } from '../../utils/crud'
import { sendMail } from '../../libs/sendgridEmailTemp'
import { ACCESS_EMAIL_TEMPLATES } from '../../utils/constants/constant'

/**
 * Provides service to create new affiliate
 * @export
 * @class CreateAffiliateService
 * @extends {ServiceBase}
 */
export class CreateAffiliateService extends ServiceBase {
  async run () {
    const {
      dbModels: { Affiliate: AffiliateModel, AdminRole: AdminRoleModel },
      sequelizeTransaction: transaction
    } = this.context

    let {
      firstName,
      lastName,
      email,
      phoneCode,
      phone,
      state,
      preferredContact,
      trafficSource,
      plan,
      isTermsAccepted,
      permission
    } = this.args
    const affiliateExist = await AffiliateModel.findOne({
      where: { email: email },
      transaction
    })

    if (affiliateExist) {
      return this.addError('AffiliatesAlreadyExistsErrorType')
    }
    const affiliateRoleExist = await AdminRoleModel.findOne({
      where: { level: 4 }
    })
    if (!affiliateRoleExist) {
      return this.addError('AffiliatesRoleNotExistsErrorType')
    }

    if (!isTermsAccepted) return this.addError('TermsAndConditionErrorType')
    const affiliateCode = uuid()
    const affiliate_status = 'approved'
    const url = `${config.get(
      'userFrontendUrl'
    )}?affiliateCode=${affiliateCode}`
    const affiliatesObj = {
      affiliateCode,
      firstName,
      lastName,
      email,
      phoneCode,
      phone,
      state,
      affiliate_status: affiliate_status,
      preferredContact,
      trafficSource,
      plan,
      isTermsAccepted,
      permission
    }

    if (affiliateRoleExist) {
      affiliatesObj.roleId = affiliateRoleExist.level
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
      const createNewAffiliate = await createNewEntity({
        model: AffiliateModel,
        data: affiliatesObj,
        transaction
      })
      createNewAffiliate.url = url

      const emailToken = await setToken(email, affiliateCode)
      createNewAffiliate.emailToken = emailToken
      await sendMail({
        email: createNewAffiliate.email,
        userId: createNewAffiliate?.affiliateId ?? '',
        emailTemplate: ACCESS_EMAIL_TEMPLATES.VERIFY_EMAIL,
        token: emailToken,
        dynamicData: {
          email: createNewAffiliate.email,
          userId: createNewAffiliate?.affiliateId ?? '',
          userName: createNewAffiliate.firstName
        },
        transaction
      })

      return {
        createAffiliate: { email: createNewAffiliate.email },
        success: true,
        message: `${SUCCESS_MSG.CREATE_SUCCESS} please check email and set password`
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
