// import db from '../../db/models'
// import ajv from '../../libs/ajv'
// import { getOne, updateEntity } from '../../utils/crud'
// import ServiceBase from '../../libs/serviceBase'
// import { SUCCESS_MSG } from '../../utils/constants/success'
// import { EmailTemplateJobStatus } from '../../utils/constants/constant'
// import { jobScheduler } from '../../utils/common'
// const schema = {
//   type: 'object',
//   properties: {
//     subject: { type: 'string' },
//     language: { type: 'string' },
//     templateCode: { type: 'string' },
//     scheduledAt: { type: 'string' },
//     emailTemplateId: { type: 'number' },
//     templateEmailCategoryId: { type: 'number' },
//     dynamicData: { type: 'array' }
//   },
//   required: ['subject', 'dynamicData', 'emailTemplateId', 'scheduledAt', 'templateCode', 'templateEmailCategoryId', 'language']
// }

// const constraints = ajv.compile(schema)

// export class UpdateCustomEmailTemplateService extends ServiceBase {
//   get constraints () {
//     return constraints
//   }

//   async run () {
//     const { subject, dynamicData, templateCode, emailTemplateId, templateEmailCategoryId, language, scheduledAt } = this.args
//     const transaction = this.context.sequelizeTransaction
//     let query

//     try {
//       const checkTemplateExists = await getOne(
//         {
//           model: db.EmailTemplate,
//           data: { ...query, emailTemplateId },
//           transaction
//         }
//       )
//       if (!checkTemplateExists) return this.addError('EmailTemplateNotFoundErrorType')

//       const isCompleteObj = [EmailTemplateJobStatus.complete, EmailTemplateJobStatus.fail, EmailTemplateJobStatus.inprogress]

//       if (isCompleteObj.includes(checkTemplateExists.isComplete)) return this.addError('EmailTemplateNotAllowEditErrorType')

//       const newTemplateCode = checkTemplateExists.templateCode
//       newTemplateCode[language] = templateCode

//       const templateData =
//           {
//             label: subject,
//             dynamicData,
//             templateCode: newTemplateCode,
//             scheduledAt,
//             templateEmailCategoryId
//           }
//       const emailTemplate = await updateEntity({
//         model: db.EmailTemplate,
//         values: { emailTemplateId },
//         data: templateData,
//         transaction: transaction
//       })
//       if (emailTemplate && checkTemplateExists.dataValues.templateEmailCategoryId !== null) {
//         jobScheduler(emailTemplateId)
//       }
//       return { emailTemplate, message: SUCCESS_MSG.UPDATE_SUCCESS }
//     } catch (error) {
//       this.addError('InternalServerErrorType', error)
//     }
//   }
// }
