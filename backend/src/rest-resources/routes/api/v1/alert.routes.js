import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import AlertController from '../../../controllers/alert.controller'
const args = { mergeParams: true }
const alertRouter = express.Router(args)

alertRouter.route('/user-tickets')
  .get(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    checkPermission,
    AlertController.getUserTickets,
    responseValidationMiddleware({}))
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AlertController.resolveUserTicket,
    responseValidationMiddleware({}))

alertRouter.route('/assign-ticket')
  .post(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    checkPermission,
    contextMiddleware(true),
    AlertController.assignTicket,
    responseValidationMiddleware({}))

alertRouter.route('/agent-overview')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    // checkPermission,
    AlertController.getAgentOverview,
    responseValidationMiddleware({})
  )

alertRouter.route('/admins')
  .get(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    checkPermission,
    AlertController.getAdmins,
    responseValidationMiddleware({}))

export default alertRouter
