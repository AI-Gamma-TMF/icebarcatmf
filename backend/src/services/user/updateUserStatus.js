import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { activityLog } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getAll, getOne, updateEntity } from '../../utils/crud'
import {
  DOCUMENTS,
  EMAIL_LOGS_SOURCE,
  EMAIL_TEMPLATE_TYPES,
  KYC_STATUS,
  ROLE,
  STATUS,
  STATUS_VALUE,
  UPDATE_USER_STATUS
} from '../../utils/constants/constant'
// import { createEmailWithDynamicValues, sendEmailMail } from '../../libs/email'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    type: { type: 'number' },
    reason: { type: 'string' },
    userId: { type: 'number' },
    action: { type: 'boolean' },
    favorite: { type: ['boolean', 'null'] }
  },
  required: ['userId', 'action', 'reason', 'type', 'user']
}

const constraints = ajv.compile(schema)

export class UpdateUserStatus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, userId, reason, action, type, favorite } = this.args
    const transaction = this.context.sequelizeTransaction
    let field


    try {
      const userDetails = await getOne({
        model: db.User,
        data: { userId },
        attributes: [
          'uniqueId',
          'userId',
          'isRestrict',
          'phoneVerified',
          'isBan',
          'isInternalUser',
          'moreDetails',
          'email',
          'firstName',
          'lastName',
          'kycStatus'
        ],
        transaction
      })

      if (!userDetails) return this.addError('UserNotExistsErrorType')

      switch (type) {
        case UPDATE_USER_STATUS.PHONE_VERIFICATION:
          userDetails.phoneVerified = action

          await createNewEntity({
            model: db.ActivityLog,
            data: {
              actioneeId: user?.userId || user?.adminUserId,
              actioneeType: user?.userId ? ROLE.USER : ROLE.ADMIN,
              fieldChanged: 'kycStatus',
              originalValue: userDetails.kycStatus,
              changedValue: action
                ? KYC_STATUS.ACCOUNT_VERIFIED_PHONE
                : KYC_STATUS.ACCOUNT_EMAIL_VERIFIED_ACCEPTED_TC,
              userId,
              moreDetails: { favorite: false }
            },
            transaction
          })
          if (action) userDetails.kycStatus = KYC_STATUS.ACCOUNT_VERIFIED_PHONE
          else
            userDetails.kycStatus =
              KYC_STATUS.ACCOUNT_EMAIL_VERIFIED_ACCEPTED_TC
          field = 'Phone Verified'
          break

        case UPDATE_USER_STATUS.RESTRICT_USER:
          userDetails.isRestrict = action
          field = 'Restrict Player'
          break

        case UPDATE_USER_STATUS.BAN_UNBAN_USER:
          userDetails.isBan = action
          field = 'Ban Player'
          break

        case UPDATE_USER_STATUS.INTERNAL_USER:
          if (userDetails.isInternalUser) return this.addError('AlreadyTestUserErrorType')
          userDetails.isInternalUser = action
          field = 'Test Player'
          break

        case UPDATE_USER_STATUS.REDEMPTION_SUBSCRIPTION:
          userDetails.moreDetails = {
            ...userDetails.moreDetails,
            isRedemptionSubscribed: action
          }
          field = 'Redemption Subscribed'
          break

        case UPDATE_USER_STATUS.SUBSCRIPTION:
          userDetails.moreDetails = {
            ...userDetails.moreDetails,
            isSubscribed: action
          }
          field = 'Subscription'
          break

        // case UPDATE_USER_STATUS.VERIFF_VERIFICATION:
        //   if (action) userDetails.veriffStatus = STATUS_VALUE.APPROVED
        //   else userDetails.veriffStatus = STATUS_VALUE.PENDING
        //   field = 'Veriff Status'
        //   break

        case UPDATE_USER_STATUS.LN_VERIFICATION:
          userDetails.isLexisNexisVerified = action
          await createNewEntity({
            model: db.ActivityLog,
            data: {
              actioneeId: user?.userId || user?.adminUserId,
              actioneeType: user?.userId ? ROLE.USER : ROLE.ADMIN,
              fieldChanged: 'kycStatus',
              originalValue: userDetails.kycStatus,
              changedValue: action
                ? KYC_STATUS.ACCOUNT_PASSED_LEXIS_NEXIS
                : KYC_STATUS.ACCOUNT_FAILED_LEXIS_NEXIS,
              userId,
              moreDetails: { favorite: false }
            },
            transaction
          })

          if (action)
            userDetails.kycStatus = KYC_STATUS.ACCOUNT_PASSED_LEXIS_NEXIS
          else userDetails.kycStatus = KYC_STATUS.ACCOUNT_FAILED_LEXIS_NEXIS
          field = 'Lexis-Nexis Status'
          break

        case UPDATE_USER_STATUS.PERSONAL_DETAILS: {
          field = 'Verify Personal Details'
          const checkDocumentExist = await getAll({
            model: db.UserDocument,
            data: {
              userId: userId,
              documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID] }
            },
            attributes: ['userDocumentId'],
            transaction
          })

          if (checkDocumentExist.length === 0)
            return this.addError('UserDocumentsNotFoundErrorType')
          if (action) {
            await updateEntity({
              model: db.UserDocument,
              values: {
                userId: userId,
                documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID] }
              },
              data: {
                status: STATUS.APPROVED,
                reason,
                actionPerformedAt: Date.now()
              },
              transaction
            })
          } else {
            await updateEntity({
              model: db.UserDocument,
              values: {
                userId: userId,
                documentName: { [Op.in]: [DOCUMENTS.ADDRESS, DOCUMENTS.ID] }
              },
              data: {
                status: STATUS.REJECTED,
                reason,
                actionPerformedAt: Date.now()
              },
              transaction
            })
          }
          break
        }
        case UPDATE_USER_STATUS.BANK_DETAILS: {
          field = 'Verify Bank Details'
          const checkDocumentExist = await getAll({
            model: db.UserDocument,
            data: { userId: userId, documentName: DOCUMENTS.BANK_CHECKING },
            transaction
          })

          if (checkDocumentExist.length === 0)
            return this.addError('UserDocumentsNotFoundErrorType')

          if (action) {
            await updateEntity({
              model: db.UserDocument,
              values: { userId: userId, documentName: DOCUMENTS.BANK_CHECKING },
              data: {
                status: STATUS.APPROVED,
                reason,
                actionPerformedAt: Date.now()
              },
              transaction
            })
          } else {
            await updateEntity({
              model: db.UserDocument,
              values: { userId: userId, documentName: DOCUMENTS.BANK_CHECKING },
              data: {
                status: STATUS.REJECTED,
                reason,
                actionPerformedAt: Date.now()
              },
              transaction
            })
          }
          break
        }
        case UPDATE_USER_STATUS.VERIFIED:
          userDetails.moreDetails = {
            ...userDetails.moreDetails,
            verified: action
          }
          field = 'Verified'
          break
      }

      if (
        ![
          UPDATE_USER_STATUS.BANK_DETAILS,
          UPDATE_USER_STATUS.PERSONAL_DETAILS
        ].includes(type)
      )
        await userDetails.save({ transaction })
      else {
        const successDocuments = await db.UserDocument.count({
          where: {
            userId: userDetails.userId,
            status: STATUS.APPROVED,
            documentName: {
              [Op.in]: [
                DOCUMENTS.ADDRESS,
                DOCUMENTS.BANK_CHECKING,
                DOCUMENTS.ID
              ]
            }
          },
          transaction
        })

        // if (userDetails.veriffStatus === STATUS_VALUE.APPROVED && successDocuments === 3) {
        //   // const dynamicData = await createEmailWithDynamicValues({
        //   //   emailType: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.SUCCESSFUL_IDENTITY_VERIFICATION],
        //   //   userId: userDetails.userId,
        //   //   serviceData: {
        //   //     subject: EMAIL_SUBJECTS.verification
        //   //   },
        //   //   language: 'EN',
        //   //   transaction
        //   // })

        //   // await sendEmailMail({ emailTemplate: dynamicData, email: userDetails.email, name: `${userDetails.firstName} ${userDetails.lastName}`, subject: EMAIL_SUBJECTS.verification })

        //   // await createNewEntity({
        //   //   model: db.EmailLog,
        //   //   data: {
        //   //     email: userDetails.email,
        //   //     userId: userDetails.userId,
        //   //     emailTemplateId: EMAIL_TEMPLATE_TYPES.VALUE_T0_INT[EMAIL_TEMPLATE_TYPES.SUCCESSFUL_IDENTITY_VERIFICATION],
        //   //     emailTemplateName: EMAIL_TEMPLATE_TYPES.SUCCESSFUL_IDENTITY_VERIFICATION,
        //   //     source: EMAIL_LOGS_SOURCE.VERIFICATION
        //   //   },
        //   //   transaction
        //   // })
        // }
      }

      await activityLog({
        user,
        userId,
        fieldChanged: field,
        originalValue: !action,
        changedValue: action,
        remark: reason,
        favorite,
        transaction
      })

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
