import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { comparePassword, signAccessToken } from '../../utils/common'

// import config from '../../configs/app.config'
// import { getAffiliateTokenCacheKey } from '../../utils/affiliate.util'
// import { setData } from '../../utils/common'

/**
 * Provides service to create new affiliate
 * @export
 * @class CreateAffiliateService
 * @extends {ServiceBase}
 */
export class LoginAffiliateService extends ServiceBase {
  async run () {
    const {
      dbModels: { Affiliate: AffiliateModel, AdminRole: AdminRoleModel },
      sequelizeTransaction: transaction
    } = this.context

    let { email, password } = this.args
    try {
      email = email.toLowerCase()

      const affiliate = await AffiliateModel.findOne({
        where: { email: email },
        include: [
          {
            model: AdminRoleModel,
            as: 'role',
            attributes: ['roleId', 'name', 'level'],
            required: true
          }
        ],
        transaction
      })

      if (!affiliate) {
        return this.addError('AffiliatesNotExistErrorType')
      }
      if (!affiliate.isActive) {
        return this.addError('AffiliateInActiveLoginErrorType')
      }
      if (!(await comparePassword(password, affiliate.password))) {
        return this.addError('LoginPasswordErrorType')
      }
      const affiliateObj = affiliate.get({ plain: true })

      const tokenKeys = {
        id: affiliateObj.affiliateId,
        affiliateCode: affiliateObj.affiliateCode,
        email: affiliateObj.email
      }
      const jwtToken = await signAccessToken(tokenKeys)
      affiliateObj.affiliateAccessToken = jwtToken
      delete affiliateObj.password

      // set token in redis
      // const cacheTokenKey = getAffiliateTokenCacheKey(affiliateObj.affiliateId)
      // setData(cacheTokenKey, jwtToken, config.get('jwt.loginTokenExpiry'))

      return {
        affiliate: affiliateObj,
        message: 'Logged in Successfully!',
        success: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
