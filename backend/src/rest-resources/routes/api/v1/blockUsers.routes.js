import express from 'express'

import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import BlockedUsersControllers from '../../../controllers/blockUsers.controller'
import multer from 'multer'

const args = { mergeParams: true }
const blockUserRouter = express.Router(args)

const upload = multer()

blockUserRouter
  .route('/')
  .post(
    requestValidationMiddleware({ requestValidationMiddleware }),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BlockedUsersControllers.addBlockedUsers,
    responseValidationMiddleware({ responseValidationMiddleware })
  )
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BlockedUsersControllers.getBlockedUsersList,
    responseValidationMiddleware({ responseValidationMiddleware })
  )

blockUserRouter
  .route('/block-from-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware({ requestValidationMiddleware }),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BlockedUsersControllers.addBlockedUsersFromCsv,
    responseValidationMiddleware({ responseValidationMiddleware })
  )

export default blockUserRouter
