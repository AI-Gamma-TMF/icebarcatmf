import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import { activityLog, uploadFile } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'
import { createNewEntity, getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { BANK_ACCOUNT_TYPE, DOCUMENTS, STATUS, TICKET_STATUS, TICKET_TYPE } from '../../utils/constants/constant'
const s3Config = config.getProperties().s3

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'string' },
    reason: { type: ['string', 'null'] },
    documentType: { type: 'string', enum: ['address', 'bank_checking', 'id', 'ssn', 'other'] }
  },
  required: ['userId', 'documentType']
}

const constraints = ajv.compile(schema)

export class UploadDocumentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, reason, documentType } = this.args
    const transaction = this.context.sequelizeTransaction
    const document = this.context.req.file
    let newDocument

    try {
      const documentExist = await db.UserDocument.findOne({ where: { userId, documentName: DOCUMENTS[documentType.toUpperCase()] }, attributes: ['documentUrl', 'userDocumentId'], transaction })

      if (document && typeof (document) === 'object') {
        let fileName = `${config.get('env')}/assets/${DOCUMENTS[documentType.toUpperCase()].replace('_', '-').toLowerCase()}/${userId}-${Date.now()}.${document.mimetype.split('/')[1]}`

        await uploadFile(document, fileName)
        fileName = s3Config.S3_DOMAIN_KEY_PREFIX + fileName

        if (documentExist) await documentExist.set({ documentUrl: [...documentExist.documentUrl, fileName], status: STATUS.PENDING, reason }).save({ transaction })
        else {
          newDocument = await createNewEntity({ model: db.UserDocument, data: { userId, documentUrl: [fileName], documentName: DOCUMENTS[documentType.toUpperCase()], reason }, transaction })
        }

        if (documentType.toUpperCase() === DOCUMENTS.BANK_CHECKING) {
          const bankDetails = await getOne({ model: db.BankDetail, data: { userId, type: BANK_ACCOUNT_TYPE.CHECKING }, attributes: ['bankDetailId', 'documentId'], transaction })

          if (bankDetails) await bankDetails.set({ documentId: (documentExist) ? documentExist?.userDocumentId : newDocument?.userDocumentId }).save({ transaction })
          else {
            await createNewEntity({
              model: db.BankDetail,
              data: { userId, type: BANK_ACCOUNT_TYPE.CHECKING, documentId: (documentExist) ? documentExist?.userDocumentId : newDocument?.userDocumentId },
              transaction
            })
          }
        }

        await activityLog({ user, userId, fieldChanged: `${DOCUMENTS[documentType.toUpperCase()].charAt(0).toUpperCase() + DOCUMENTS[documentType.toUpperCase()].slice(1).toLowerCase()} Document Uploaded`, remark: reason, transaction })

        await createNewEntity({
          model: db.UserTickets,
          data: {
            playerAction: 'Upload Document',
            playerActionTime: new Date(),
            playerId: userId,
            assignTo: 0,
            status: TICKET_STATUS.UNASSIGNED,
            resolve: false,
            ticketType: TICKET_TYPE.VERIFICATION
          },
          transaction
        })
      }

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
