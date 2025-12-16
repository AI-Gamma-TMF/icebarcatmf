import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { getCalenderViewSchema } from '../../../middlewares/validation/admin-validation.schemas'
import { defaultResponseSchema } from '../../../middlewares/validation/tournament-validation.schemas'
import CalenderController from '../../../controllers/calender.controller'

const args = { mergeParams: true }
const calenderRouter = express.Router(args)

calenderRouter
  .route('/')
  .get(
    requestValidationMiddleware(getCalenderViewSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CalenderController.getCalenderEvents,
    responseValidationMiddleware(defaultResponseSchema)
  )

export default calenderRouter
