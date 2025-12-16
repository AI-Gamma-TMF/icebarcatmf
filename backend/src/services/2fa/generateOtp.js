import db from '../../db/models'
import ajv from '../../libs/ajv'
import { updateEntity, getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { generateRandomBase32 } from '../../utils/common'
import * as OTPAuth from 'otpauth'
import { TWO_FACTOR_AUTH } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    user: { type: 'object' }
  },
  required: ['id', 'user']
}

const constraints = ajv.compile(schema)

export class GenerateOtpService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id, user } = this.args
    const transaction = this.context.sequelizeTransaction
    let label

    const email = user.dataValues.email

    const authSecret = generateRandomBase32()

    try {
      label = 'moneyFactory'
      const userExist = await getOne({
        model: db.AdminUser,
        data: { adminUserId: +id },
        transaction
      })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      const totp = new OTPAuth.TOTP({
        issuer: email,
        label: label,
        algorithm: TWO_FACTOR_AUTH.algorithm,
        digits: TWO_FACTOR_AUTH.digits,
        period: TWO_FACTOR_AUTH.period,
        secret: authSecret
      })

      const authUrl = totp.toString()

      await updateEntity({
        model: db.AdminUser,
        values: { adminUserId: id },
        data: { authSecret: authSecret, authUrl: authUrl },
        transaction: transaction
      })
      return { result: { authSecret: authSecret, authUrl: authUrl, period: TWO_FACTOR_AUTH.period }, success: true, message: SUCCESS_MSG.GENERATE_2FA_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
