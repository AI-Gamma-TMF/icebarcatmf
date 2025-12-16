import express from 'express'
import { isAdminAuthenticated, checkPermission } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { addDomainSchema } from '../../../middlewares/validation/country-validation.schemas'
import DomainBlockController from '../../../controllers/domainBlock.controller'

const args = { mergeParams: true }
const domainBlockRoutes = express.Router(args)

domainBlockRoutes.route('/')
  .post(
    requestValidationMiddleware(addDomainSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DomainBlockController.addBlockedDomains,
    responseValidationMiddleware(addDomainSchema)
  ).get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DomainBlockController.getBlockedDomains,
    responseValidationMiddleware({})
  ).delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DomainBlockController.deleteBlockedDomains,
    responseValidationMiddleware({})
  )

export default domainBlockRoutes
