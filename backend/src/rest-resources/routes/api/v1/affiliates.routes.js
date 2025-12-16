import express from 'express'
import multer from 'multer'
import AffiliatesController from '../../../controllers/affiliates.controller'
import {
  checkPermission,
  isAdminAuthenticated,
  isAffiliateAuthenticate
} from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

import {
  createAffiliateSchemas,
  affiliateListSchemas,
  affiliateUpdateSchemas,
  affiliateDeleteSchemas,
  getAffiliateDetailsSchema,
  loginAffiliateSchemas,
  defaultResponseSchemas,
  updateProfileSchemas,
  approveAffiliateSchemas,
  setPasswordSchema,
  changePasswordSchemas,
  forgetPasswordSchema,
  verifyForgetPasswordSchema,
  affiliateSearchListSchemas,
  scaleoDetailSchema
} from '../../../middlewares/validation/affiliate-validation.schemas'

const args = { mergeParams: true }
const affiliateRouter = express.Router(args)
const upload = multer()

// affiliateRouter
//   .route('/')
//   .get(
//     requestValidationMiddleware(affiliateSearchListSchemas),
//     contextMiddleware(false),
//     isAdminAuthenticated,
//     checkPermission,
//     AffiliatesController.getAffiliates,
//     responseValidationMiddleware(affiliateSearchListSchemas)
//   )

// affiliateRouter
//   .route('/all-affiliates')
//   .get(
//     requestValidationMiddleware(affiliateListSchemas),
//     contextMiddleware(false),
//     isAdminAuthenticated,
//     checkPermission,
//     AffiliatesController.getAllAffiliates,
//     responseValidationMiddleware(affiliateListSchemas)
//   )
// affiliateRouter
//   .route('/create-affiliate')
//   .post(
//     requestValidationMiddleware(createAffiliateSchemas),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     checkPermission,
//     AffiliatesController.createAffiliate,
//     responseValidationMiddleware(createAffiliateSchemas)
//   )

// affiliateRouter
//   .route('/set-Password')
//   .put(
//     requestValidationMiddleware(setPasswordSchema),
//     contextMiddleware(true),
//     AffiliatesController.setPassword,
//     responseValidationMiddleware(setPasswordSchema)
//   )

// affiliateRouter
//   .route('/admin-update-affiliate')
//   .put(
//     requestValidationMiddleware(affiliateUpdateSchemas),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     checkPermission,
//     AffiliatesController.updateAffiliate,
//     responseValidationMiddleware(affiliateUpdateSchemas)
//   )
// affiliateRouter
//   .route('/approved-affiliate')
//   .put(
//     requestValidationMiddleware(approveAffiliateSchemas),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     checkPermission,
//     AffiliatesController.statusApprovedAffiliates,
//     responseValidationMiddleware(defaultResponseSchemas)
//   )

// affiliateRouter
//   .route('/affiliate-details')
//   .get(
//     requestValidationMiddleware(getAffiliateDetailsSchema),
//     contextMiddleware(false),
//     isAffiliateAuthenticate,
//     AffiliatesController.getAffiliateDetails,
//     responseValidationMiddleware(getAffiliateDetailsSchema)
//   )

// affiliateRouter
//   .route('/:affiliateId/delete-affiliate')
//   .delete(
//     requestValidationMiddleware(affiliateDeleteSchemas),
//     contextMiddleware(true),
//     isAdminAuthenticated,
//     checkPermission,
//     AffiliatesController.deleteAffiliate,
//     responseValidationMiddleware(affiliateDeleteSchemas)
//   )

// affiliateRouter
//   .route('/login')
//   .post(
//     requestValidationMiddleware(loginAffiliateSchemas),
//     contextMiddleware(true),
//     AffiliatesController.loginAffiliate,
//     responseValidationMiddleware(loginAffiliateSchemas)
//   )

// affiliateRouter
//   .route('/affiliate-users')
//   .get(
//     requestValidationMiddleware(),
//     contextMiddleware(false),
//     isAffiliateAuthenticate,
//     AffiliatesController.getAllAffiliateUsers,
//     responseValidationMiddleware()
//   )

// affiliateRouter
//   .route('/affiliate-profile')
//   .put(
//     requestValidationMiddleware(updateProfileSchemas),
//     contextMiddleware(true),
//     isAffiliateAuthenticate,
//     AffiliatesController.updateProfile,
//     responseValidationMiddleware(defaultResponseSchemas)
//   )

// // upload-profile-photo route
// affiliateRouter
//   .route('/upload-profile-image')
//   .put(
//     upload.any('document'),
//     requestValidationMiddleware(),
//     contextMiddleware(true),
//     isAffiliateAuthenticate,
//     AffiliatesController.uploadAffiliateProfileImage,
//     responseValidationMiddleware()
//   )

// affiliateRouter
//   .route('/logoutAffiliate')
//   .post(
//     requestValidationMiddleware(),
//     contextMiddleware(false),
//     isAffiliateAuthenticate,
//     AffiliatesController.logoutAffiliate,
//     responseValidationMiddleware(defaultResponseSchemas)
//   )

// affiliateRouter
//   .route('/changePassword')
//   .put(
//     requestValidationMiddleware(changePasswordSchemas),
//     contextMiddleware(true),
//     isAffiliateAuthenticate,
//     AffiliatesController.changePassword,
//     responseValidationMiddleware(defaultResponseSchemas)
//   )

// affiliateRouter
//   .route('/forgetPassword')
//   .post(
//     requestValidationMiddleware(forgetPasswordSchema),
//     contextMiddleware(true),
//     AffiliatesController.forgetPassword,
//     responseValidationMiddleware(defaultResponseSchemas)
//   )

// affiliateRouter
//   .route('/verifyForgetPassword')
//   .post(
//     requestValidationMiddleware(verifyForgetPasswordSchema),
//     contextMiddleware(true),
//     AffiliatesController.verifyForgetPassword,
//     responseValidationMiddleware(defaultResponseSchemas)
//   )

affiliateRouter
  .route('/ScaleoPlayerEvents')
  .get(
    requestValidationMiddleware(scaleoDetailSchema),
    contextMiddleware(false),
    AffiliatesController.detailWebhook,
    responseValidationMiddleware()
  )

affiliateRouter.route('/ScaleoPlayerEvents/v2').get(requestValidationMiddleware(scaleoDetailSchema),
  contextMiddleware(false), AffiliatesController.detailWebhookV2, responseValidationMiddleware())

affiliateRouter.route('/ScaleoTransactionEvents/v2').get(requestValidationMiddleware(scaleoDetailSchema),
  contextMiddleware(false), AffiliatesController.scaleoTransactionActivity, responseValidationMiddleware())

export default affiliateRouter
