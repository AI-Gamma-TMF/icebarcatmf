import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne, updateEntity } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TWO_FACTOR_AUTH } from '../../utils/constants/constant'
import * as OTPAuth from 'otpauth'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    token: { type: 'string' },
    user: { type: 'object' }
  },
  required: ['id', 'token', 'user']
}

const constraints = ajv.compile(schema)

export class VerifyOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id, token, user } = this.args
    let verified
    const email = user.dataValues.email
    try {
      const userExist = await getOne({
        model: db.AdminUser,
        data: { adminUserId: +id },
        attributes: ['authSecret', 'authUrl']
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      const authSecret = userExist.dataValues.authSecret

      const totp = new OTPAuth.TOTP({
        issuer: email,
        label: 'moneyFactory',
        algorithm: TWO_FACTOR_AUTH.algorithm,
        digits: TWO_FACTOR_AUTH.digits,
        period: TWO_FACTOR_AUTH.period,
        secret: authSecret
      })

      const delta = totp.validate({ token })
      if (delta !== null) {
        verified = true
      } else return this.addError('OtpVerificationFailedErrorType')

      if (verified) {
        await updateEntity({
          model: db.AdminUser,
          values: { adminUserId: +id },
          data: { authEnable: true }
        })
      }

      return { verified, success: true, message: SUCCESS_MSG.VERIFY_2FA_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
