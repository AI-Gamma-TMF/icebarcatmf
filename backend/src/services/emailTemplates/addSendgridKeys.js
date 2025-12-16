import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { ROLE, ROLE_ID, defaultBase64, defaultUtf8 } from '../../utils/constants/constant'
import { encodeCredential } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userType: { type: 'string' },
    sendgridKey: { type: 'string' },
    sendgridEmail: { type: 'string' }
  },
  required: ['userType', 'user', 'sendgridKey', 'sendgridEmail']
}

const constraints = ajv.compile(schema)

export class SetSendgridCredentialsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { sendgridEmail, sendgridKey, user, userType } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      if (userType !== ROLE.ADMIN || user.roleId !== ROLE_ID.ADMIN) {
        return this.addError('ActionNotAllowedErrorType')
      }

      await db.GlobalSetting.bulkCreate([
        { key: 'SENDGRID_EMAIL', value: encodeCredential(sendgridEmail) },
        { key: 'SENDGRID_API_KEY', value: encodeCredential(Buffer.from(sendgridKey, defaultBase64).toString(defaultUtf8)) }
      ], {
        fields: ['key', 'value'],
        updateOnDuplicate: ['value']
      },
      transaction
      )

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
