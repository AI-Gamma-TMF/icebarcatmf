import moment from 'moment'
import Jwt from 'jsonwebtoken'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import config from '../../configs/app.config'
import { comparePassword, encryptPassword, validatePassword } from '../../utils/common'

export class VerifyForgetPasswordService extends ServiceBase {
  async run () {
    const {
        dbModels: {
            Affiliate: AffiliateModel,
          },
      sequelizeTransaction: transaction
    } = this.context
    let { newPasswordKey, password, confirmPassword} =
      this.args

    const isEmailLogin = newPasswordKey ? true : false

    if (!validatePassword(password)) {
      return this.addError('PasswordValidationFailedError', '')
    }

    if (!comparePassword(password, confirmPassword)) {
      return this.addError('PasswordDoesNotMatchErrorType')
    }

    if (isEmailLogin) {
      const newPasswordKeyData = Jwt.verify(
        newPasswordKey,
        config.get('jwt.resetPasswordKey')
      )
      if (!newPasswordKeyData && !newPasswordKeyData.affiliateId)
        return this.addError('ResetPasswordTokenErrorType', '')

      const affiliateData = await AffiliateModel.findOne({
        attributes: [
          'affiliateId',
          'email',
          'firstName',
          'affiliateCode',
          'newPasswordKey'
        ],
        where: {
          affiliateId: newPasswordKeyData.affiliateId
        },
        raw: true,
        transaction
      })

      if (!affiliateData && affiliateData?.newPasswordKey !== newPasswordKey)
        return this.addError('ResetPasswordTokenErrorType', '')

      await AffiliateModel.update(
        {
          password: encryptPassword(password),
          newPasswordKey: null
        },
        {
          where: {
            affiliateId: newPasswordKeyData.affiliateId
          },
          transaction
        }
      )
 
      return { success: true, data: {}, message: SUCCESS_MSG.PASSWORD_RESET }
    } 
  }
}
