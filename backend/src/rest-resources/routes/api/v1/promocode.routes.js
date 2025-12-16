import express from 'express'
import multer from 'multer'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import PromocodeController from '../../../controllers/promocode.controller'
import { addPromocodesFromCsvSchema, appliedHistorySchema, createPromocodeSchema, createReusePromocodeSchema, deletePromocodeSchema, expiredPromocodeSchema, getPromocodeSchema, promocodePackagesSchema, updatePromocodeSchema } from '../../../middlewares/validation/promocode-validation.schemas'

const args = { mergeParams: true }
const upload = multer()
const promocodeRouter = express.Router(args)

promocodeRouter
  .route('/')
  .get(
    requestValidationMiddleware(getPromocodeSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.getPromocodeDetail,
    responseValidationMiddleware()
  )
  .post(
    requestValidationMiddleware(createPromocodeSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.createPromocodes,
    responseValidationMiddleware()
  )
  .put(
    requestValidationMiddleware(updatePromocodeSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.updatePromocode,
    responseValidationMiddleware()
  )
  .delete(
    requestValidationMiddleware(deletePromocodeSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.deletePromocode,
    responseValidationMiddleware()
  )

promocodeRouter
  .route('/applied-history')
  .get(
    requestValidationMiddleware(appliedHistorySchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    PromocodeController.promocodeAppliedDetail,
    responseValidationMiddleware()
  )

promocodeRouter
  .route('/packages')
  .get(
    requestValidationMiddleware(promocodePackagesSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.promocodePackages,
    responseValidationMiddleware()
  )

promocodeRouter
  .route('/expired-promo')
  .get(
    requestValidationMiddleware(expiredPromocodeSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.getExpiredPromocodes,
    responseValidationMiddleware()
  )

promocodeRouter
  .route('/reuse-promocode')
  .post(
    requestValidationMiddleware(createReusePromocodeSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.reusePromocodes,
    responseValidationMiddleware()
  )
  .get(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.viewReusePromocodes,
    responseValidationMiddleware()
  )

promocodeRouter
  .route('/upload-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware(addPromocodesFromCsvSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    PromocodeController.createPromocodesFromCsv,
    responseValidationMiddleware({})
  )

export default promocodeRouter
