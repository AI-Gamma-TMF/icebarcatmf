import express from 'express'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import multer from 'multer'
import DynamoController from '../../../controllers/dynamo.controller'

const args = { mergeParams: true }
const dynamoRouter = express.Router(args)
const upload = multer()

dynamoRouter
  .route('/')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    DynamoController.getDynamoPopup,
    responseValidationMiddleware({})
  )

  .post(
    upload.single('file'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DynamoController.createDynamoPopup,
    responseValidationMiddleware({})
  )

  .put(
    upload.single('file'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DynamoController.UpdateDynamoPopup,
    responseValidationMiddleware({})
  )

  .patch(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DynamoController.PatchDynamoPopup,
    responseValidationMiddleware({})
  )

  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    DynamoController.deleteDynamoPopup,
    responseValidationMiddleware({})
  )

export default dynamoRouter
