// import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { activityLog, getUserDetails } from '../../utils/common'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { DOCUMENTS, EMAIL_LOGS_SOURCE, EMAIL_TEMPLATE_TYPES, STATUS, STATUS_VALUE, TICKET_STATUS, TICKET_TYPE } from '../../utils/constants/constant'
import _ from 'lodash'
import { Op } from 'sequelize'
// import { createEmailWithDynamicValues, sendEmailMail } from '../../libs/email'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'number' },
    reason: { type: 'string' },
    userDocumentId: { type: 'number' },
    status: { type: 'string', enum: ['approved', 'rejected', 'hold'] },
    documentExpiry: { type: ['string', 'null'] }
  },
  required: ['userId', 'userDocumentId', 'status', 'user']
}
const constraints = ajv.compile(schema)

export class VerifyUserDocumentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { userId, userDocumentId, status, reason, user, documentExpiry } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const userExist = await getUserDetails(userId)
      if (!userExist) return this.addError('UserNotExistsErrorType')

      const checkDocumentExist = await getOne({ model: db.UserDocument, data: { userDocumentId, userId: userExist.userId }, attributes: ['status', 'documentName'], transaction })
      if (!checkDocumentExist) return this.addError('UserDocumentsNotFoundErrorType')
      if (checkDocumentExist.status !== STATUS.PENDING && checkDocumentExist.status !== STATUS.REREQUESTED) {
        return this.addError('ActionNotAllowedErrorType')
      }

      if (status.toUpperCase() === STATUS_VALUE.APPROVED) status = STATUS.APPROVED
      else if (status.toUpperCase() === STATUS_VALUE.REJECTED) status = STATUS.REJECTED
      else status = STATUS.ON_HOLD

      const updateUserDocument = await updateEntity({
        model: db.UserDocument,
        values: { userDocumentId },
        data: { status, reason, actionee: user.email, actionPerformedAt: Date.now(), documentExpiry: (documentExpiry) ? new Date(documentExpiry) : null },
        transaction
      })

      const successDocuments = await db.UserDocument.count({
        where: { userId: userExist.userId, status: STATUS.APPROVED, documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.BANK_CHECKING, DOCUMENTS.ID] } }, transaction
      })

      if (successDocuments === 3 && userExist.veriffStatus === STATUS_VALUE.APPROVED) {
        // const dynamicData = await createEmailWithDynamicValues({
        //   emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.SUCCESSFUL_IDENTITY_VERIFICATION],
        //   userId: userExist.userId,
        //   serviceData: {
        //     subject: EMAIL_SUBJECTS.verification
        //   },
        //   language: 'EN',
        //   transaction
        // })

        // await sendEmailMail({ emailTemplate: dynamicData, email: userExist.email, name: `${userExist.firstName} ${userExist.lastName}`, subject: EMAIL_SUBJECTS.verification })

        await createNewEntity({
          model: db.EmailLog,
          data: {
            email: userExist.email,
            userId: userExist.userId,
            emailTemplateId: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.SUCCESSFUL_IDENTITY_VERIFICATION],
            emailTemplateName: EMAIL_TEMPLATE_TYPES.SUCCESSFUL_IDENTITY_VERIFICATION,
            source: EMAIL_LOGS_SOURCE.VERIFICATION
          },
          transaction
        })
      }

      await activityLog({ user, userId, fieldChanged: 'Document Status', originalValue: _.findKey(STATUS, value => value === checkDocumentExist.status), changedValue: _.findKey(STATUS, value => value === status), remark: reason, transaction })

      if (status === STATUS.APPROVED) {
        await createNewEntity({
          model: db.UserTickets,
          data: {
            playerAction: 'Document Expiry',
            playerActionTime: new Date(),
            playerId: userId,
            assignTo: 0,
            status: TICKET_STATUS.UNASSIGNED,
            resolve: false,
            ticketType: TICKET_TYPE.EXPIRY,
            moreDetails: {
              documentName: checkDocumentExist.documentName,
              documentExpiry: new Date(documentExpiry)
            }

          },
          transaction
        })
      }

      return { updateUserDocument, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
