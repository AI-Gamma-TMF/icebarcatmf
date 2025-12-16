import express from 'express'
import EmailTemplateController from '../../../controllers/email.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  getListSchemas,
  updateEmailSchemas,
  deleteEmailSchemas,
  getEmailDetailsSchemas,
  updateCredentialsSchemas,
  deleteEmailLanguageSchemas,
  getEmailDynamicDataSchemas,
  testEmailSchemas,
  getCategoryListSchemas,
  createTemplateSchemas,
  updateTemplateSchemas
} from '../../../../rest-resources/middlewares/validation/email-validation.schemas'

const args = { mergeParams: true }
const emailRouter = express.Router(args)

emailRouter
  .route('/')
  .get(
    requestValidationMiddleware(getListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.getAllEmailTemplate,
    responseValidationMiddleware(getListSchemas)
  )
  .put(
    requestValidationMiddleware(updateEmailSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.updateEmailTemplate,
    responseValidationMiddleware(updateEmailSchemas)
  )
  .delete(
    requestValidationMiddleware(deleteEmailSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    EmailTemplateController.deleteEmailTemplate,
    responseValidationMiddleware(deleteEmailSchemas)
  )

emailRouter
  .route('/details/:emailTemplateId')
  .get(
    requestValidationMiddleware(getEmailDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.getEmailTemplateById,
    responseValidationMiddleware(getEmailDetailsSchemas)
  )
emailRouter
  .route('/test')
  .post(
    requestValidationMiddleware(testEmailSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.testEmailTemplate,
    responseValidationMiddleware(testEmailSchemas)
  )
emailRouter
  .route('/dynamic-data')
  .get(
    requestValidationMiddleware(getEmailDynamicDataSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.getEmailDynamicData,
    responseValidationMiddleware(getEmailDynamicDataSchemas)
  )
emailRouter
  .route('/language')
  .delete(
    requestValidationMiddleware(deleteEmailLanguageSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    EmailTemplateController.deleteEmailTemplateLanguage,
    responseValidationMiddleware(deleteEmailLanguageSchemas)
  )
emailRouter
  .route('/credentials')
  .put(
    requestValidationMiddleware(updateCredentialsSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    EmailTemplateController.setSendgridCredentials,
    responseValidationMiddleware(updateCredentialsSchemas)
  )

emailRouter
  .route('/category')
  .get(
    requestValidationMiddleware(getCategoryListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.getAllCategoryEmailTemplate,
    responseValidationMiddleware(getCategoryListSchemas)
  )

emailRouter
  .route('/template')
  .post(
    requestValidationMiddleware(createTemplateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.createEmailTemplate,
    responseValidationMiddleware(createTemplateSchemas)
  )
  .put(
    requestValidationMiddleware(updateTemplateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    EmailTemplateController.updateCustomEmailTemplate,
    responseValidationMiddleware(updateTemplateSchemas)
  )

export default emailRouter
