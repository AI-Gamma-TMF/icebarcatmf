import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getOne } from '../../utils/crud'
import { decodeInformation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import db from '../../db/models'

const schema = {
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetBankDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId } = this.args
    let bankDoc

    try {
      const bankDetails = await getOne({
        model: db.BankDetail,
        data: { userId }
      })

      if (!bankDetails) return { success: false, message: SUCCESS_MSG.GET_SUCCESS }

      if (bankDetails.documentId) {
        bankDoc = await db.UserDocument.findOne({ where: { userDocumentId: bankDetails.documentId }, attributes: ['documentUrl', 'userDocumentId'] })
      }

      bankDetails.routingNumber = decodeInformation(bankDetails?.routingNumber).replace(decodeInformation(bankDetails?.routingNumber).substring(3, 8), '******')
      bankDetails.accountNumber = (bankDetails?.accountNumber) ? decodeInformation(bankDetails?.accountNumber).replace(decodeInformation(bankDetails?.accountNumber).substring(4, 14), '******') : null
      bankDetails.dataValues.document = (bankDetails.documentId && bankDoc) ? bankDoc.documentUrl.slice(-1)[0] : null

      return { success: true, bankDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
