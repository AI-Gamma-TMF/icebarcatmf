import ServiceBase from '../../libs/serviceBase'
import { updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import {
  encryptPassword,
  comparePassword,
  validatePassword
} from '../../utils/common'

export class ChangePasswordService extends ServiceBase {
  async run () {
    const { oldPassword, newPassword } = this.args
    const {
      req: {
        affiliate: { detail: affiliate }
      },
      dbModels: { Affiliate: AffiliateModel },
      sequelizeTransaction: transaction
    } = this.context

    if (!validatePassword(oldPassword)) {
      return this.addError('PasswordValidationFailedError')
    }

    if (!validatePassword(newPassword)) {
      return this.addError('PasswordValidationFailedError')
    }

    if (
      Buffer.from(oldPassword, 'base64').toString('utf-8') ===
      Buffer.from(newPassword, 'base64').toString('utf-8')
    )
      return this.addError('SamePasswordErrorType')

    if (!affiliate) {
      return this.addError('AffiliatesNotExistErrorType')
    }
    const result = await comparePassword(oldPassword, affiliate.password)

    if (!result) {
      return this.addError('InvalidOldPasswordErrorType')
    }

    await updateEntity({
      model: AffiliateModel,
      data: { password: encryptPassword(newPassword) },
      values: {
        affiliateCode: affiliate.affiliateCode,
        affiliateId: affiliate.affiliateId
      },
      transaction
    })

    return { success: true, data: {}, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
