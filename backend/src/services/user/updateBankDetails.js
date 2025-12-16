import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { activityLog, decodeInformation, encodeCredential } from '../../utils/common'
import { createNewEntity, getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { BANK_ACCOUNT_TYPE } from '../../utils/constants/constant'
import config from '../../configs/app.config'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    bankName: { type: 'string' },
    holderName: { type: 'string' },
    accountNumber: { type: 'string' },
    routingNumber: { type: 'string', pattern: '^[0-9]{9}$' },
    remark: { type: 'string' }
  },
  required: ['userId', 'routingNumber', 'remark', 'bankName', 'holderName', 'accountNumber', 'user']
}

const constraints = ajv.compile(schema)

export class UpdateBankDetails extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, bankName, holderName, accountNumber, routingNumber, remark, user } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const userExist = await getOne({ model: db.User, data: { userId }, attributes: ['userId', 'uniqueId'] })
      if (!userExist) return this.addError('UserNotExistsErrorType')

      let bankDetails = await getOne({
        model: db.BankDetail,
        data: { userId: userId, type: BANK_ACCOUNT_TYPE.CHECKING },
        transaction
      })

      if (bankDetails) {
        if (routingNumber && decodeInformation(bankDetails?.routingNumber) !== routingNumber) {
          await activityLog({
            user,
            userId,
            remark,
            fieldChanged: 'Routing Number',
            changedValue: routingNumber.replace(routingNumber.substring(3, 8), '******'),
            originalValue: decodeInformation(bankDetails?.routingNumber).replace(decodeInformation(bankDetails?.routingNumber).substring(3, 8), '******'),
            transaction
          })
        }

        if (accountNumber && decodeInformation(bankDetails?.accountNumber) !== accountNumber) {
          await activityLog({
            user,
            userId,
            remark,
            fieldChanged: 'Account Number',
            changedValue: accountNumber.replace(accountNumber.substring(3, 8), '******'),
            originalValue: decodeInformation(bankDetails?.accountNumber).replace(decodeInformation(bankDetails?.accountNumber).substring(3, 8), '******'),
            transaction
          })
        }

        await bankDetails.set({ name: bankName, holderName, routingNumber: encodeCredential(routingNumber), accountNumber: (accountNumber) ? encodeCredential(accountNumber) : null }).save({ transaction })
      } else {
        await activityLog({
          user,
          userId,
          remark,
          fieldChanged: 'Account Number',
          changedValue: accountNumber.replace(accountNumber.substring(3, 8), '******'),
          originalValue: '',
          transaction
        })

        await activityLog({
          user,
          userId,
          remark,
          fieldChanged: 'Routing Number',
          changedValue: routingNumber.replace(routingNumber.substring(3, 8), '******'),
          originalValue: '',
          transaction
        })

        bankDetails = await createNewEntity({
          model: db.BankDetail,
          data: {
            userId: userId,
            name: bankName,
            holderName,
            type: BANK_ACCOUNT_TYPE.CHECKING,
            routingNumber: encodeCredential(routingNumber, config.get('jwt.secretKey')),
            accountNumber: encodeCredential(accountNumber, config.get('jwt.secretKey'))
          },
          transaction
        })
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
