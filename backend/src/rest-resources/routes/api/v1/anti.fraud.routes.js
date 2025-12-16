import multer from 'multer'
import express from 'express'

import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  userGroupSchema,
  rulesSchema,
  updateRuleSchema,
  userRuleSchema
} from '../../../middlewares/validation/user-validation.schemas'
import AntiFraudController from '../../../controllers/antiFraud.controller'

const args = { mergeParams: true }
const antiFraudRouter = express.Router(args)
const upload = multer()

// antiFraudRouter.route('/player-group')
//   .post(upload.single('userCsv'),
//     requestValidationMiddleware(userGroupSchema),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     AntiFraudController.addPlayersToGroup,
//     responseValidationMiddleware(userGroupSchema))

// antiFraudRouter.route('/player-group')
//   .get(
//     requestValidationMiddleware({}),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     AntiFraudController.getGroups,
//     responseValidationMiddleware({}))

// antiFraudRouter.route('/create-rule')
//   .post(
//     requestValidationMiddleware(rulesSchema),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     AntiFraudController.createRules,
//     responseValidationMiddleware(rulesSchema))

// antiFraudRouter.route('/rules')
//   .get(
//     requestValidationMiddleware(userRuleSchema),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     AntiFraudController.getRules,
//     responseValidationMiddleware({}))

// antiFraudRouter.route('/update-rules')
//   .put(
//     requestValidationMiddleware(updateRuleSchema),
//     contextMiddleware(true),
//     AntiFraudController.updateRules,
//     responseValidationMiddleware(updateRuleSchema)
//   )

antiFraudRouter 
  .route('/fraud-users')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AntiFraudController.fraudUsersData,
    responseValidationMiddleware()
  )

export default antiFraudRouter
