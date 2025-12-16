import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import EmailCenterController from '../../../controllers/emailCenter.controller'
import { createEmailTemplateSchemas, defaultResponseSchema, deleteEmailTemplateSchemas, updateEmailTemplateSchemas } from '../../../middlewares/validation/email-center-validation.schemas'
import multer from 'multer'

const args = { mergeParams: true }
const emailCenterRouter = express.Router(args)
const upload = multer()

emailCenterRouter
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.getAllEmailCenterTemplate,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware(createEmailTemplateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.createEmailTemplate,
    responseValidationMiddleware(createEmailTemplateSchemas)
  )
  .put(
    requestValidationMiddleware(updateEmailTemplateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.updateEmailTemplate,
    responseValidationMiddleware(defaultResponseSchema)
  )
  .delete(
    requestValidationMiddleware(deleteEmailTemplateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.deleteEmailTemplate,
    responseValidationMiddleware(defaultResponseSchema)
  )

emailCenterRouter
  .route('/email-sent')
  .post(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.sendUserEmail,
    responseValidationMiddleware()
  )

emailCenterRouter
  .route('/user-search')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.getUserDetailsEmail,
    responseValidationMiddleware()
  )

emailCenterRouter
  .route('/upload-email-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.getUserFromCsv,
    responseValidationMiddleware()
  )

emailCenterRouter
  .route('/get-dynamic-value')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailCenterController.getDynamicValueEmail,
    responseValidationMiddleware()
  )

emailCenterRouter
  .route('/get-free-spin-templates')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    EmailCenterController.getFreeSpinTemplates,
    responseValidationMiddleware()
  )
export default emailCenterRouter
