import multer from 'multer'
import express from 'express'
import UserController from '../../../controllers/user.controller'
import { isAdminAuthenticated, checkPermission } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
// import multer from 'multer'
import {
  userListSchemas,
  userDetailsSchemas,
  userDocumentSchemas,
  userDailyLimitSchemas,
  userDepositLimitSchemas,
  userLossLimitSchemas,
  userSetSessionTimeLimitSchemas,
  userVerifyDocumentSchemas,
  responsibleGamblingSchema,
  updateUserPasswordSchema,
  updateUserStatusSchema,
  userCasinoDetailsSchemas,
  removeUserPwLockSchema,
  updateSsnSchema,
  updateProfileSchemas,
  updateUserBankDetailsSchema,
  addCommentSchema,
  activityLogSchema,
  uploadUserDocumentSchema,
  // userActivitySchemas,
  restResponsibleGamblingSchema,
  updateKycSchema,
  disable2FASchema,
  deleteUserNameSchema,
  providerListSchema,
  addUserForSkillQuestionSchemas
} from '../../../middlewares/validation/user-validation.schemas'
import { setReasonSchemas, updateReasonSchemas, getReasonListSchemas, getReasonDetailsSchemas, defaultResponseSchemas, deleteReasonSchemas, updateBanReasonStatusSchemas } from '../../../middlewares/validation/ban-user-validation.schemas'
import PaymentController from '../../../controllers/payment.controller'
import BanUserSettingController from '../../../controllers/banUser.controller'
import { redeemRequestsSchema } from '../../../middlewares/validation/payment-validation.schema'
import { casinoProviderGetAllSchemas } from '../../../middlewares/validation/casino-validation.schemas'
import CasinoController from '../../../controllers/casino.controller'
import TierController from '../../../controllers/tier.controller'
import { getAllTierSchema } from '../../../middlewares/validation/tier-validation.schema'

const args = { mergeParams: true }
const userRouter = express.Router(args)
const upload = multer()

userRouter
  .route('/')
  .get(
    requestValidationMiddleware(userListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUsers,
    responseValidationMiddleware(userListSchemas)
  )

userRouter
  .route('/detail')
  .get(
    requestValidationMiddleware(userDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUser,
    responseValidationMiddleware(userDetailsSchemas)
  )

userRouter
  .route('/casino-detail')
  .get(
    requestValidationMiddleware(userCasinoDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUserCasinoDetail,
    responseValidationMiddleware(userCasinoDetailsSchemas)
  )

userRouter
  .route('/document')
  .get(
    requestValidationMiddleware(userDocumentSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUserDocument,
    responseValidationMiddleware(userDocumentSchemas)
  )
  .put(
    upload.single('document'),
    requestValidationMiddleware(uploadUserDocumentSchema),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.uploadDocument,
    responseValidationMiddleware(uploadUserDocumentSchema)
  )

userRouter
  .route('/daily-limit')
  .post(
    requestValidationMiddleware(userDailyLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setDailyLimit,
    responseValidationMiddleware(userDailyLimitSchemas)
  )

userRouter
  .route('/deposit-limit')
  .post(
    requestValidationMiddleware(userDepositLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setDepositLimit,
    responseValidationMiddleware(userDepositLimitSchemas)
  )

userRouter
  .route('/loss-limit')
  .post(
    requestValidationMiddleware(userLossLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setLossLimit,
    responseValidationMiddleware(userLossLimitSchemas)
  )

userRouter
  .route('/session-time')
  .post(
    requestValidationMiddleware(userSetSessionTimeLimitSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.setTimeLimit,
    responseValidationMiddleware(userSetSessionTimeLimitSchemas)
  )

userRouter
  .route('/verify-document')
  .put(
    requestValidationMiddleware(userVerifyDocumentSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.verifyUserDocument,
    responseValidationMiddleware(userVerifyDocumentSchemas)
  )

userRouter
  .route('/dashboard')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.dashboardUser,
    responseValidationMiddleware({})
  )

userRouter
  .route('/kyc-status')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    UserController.kycStatusUpdate,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    UserController.kycStatusUpdate,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateSumsubKycStatus,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.deleteSumsubKycStatus,
    responseValidationMiddleware({})
  )

userRouter
  .route('/user-responsible-setting')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUserResponsibleSetting,
    responseValidationMiddleware({})
  )

userRouter
  .route('/update-user-responsible-setting')
  .post(
    requestValidationMiddleware(responsibleGamblingSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserResponsibleSetting,
    responseValidationMiddleware({})
  )

userRouter
  .route('/reset-user-responsible-setting')
  .put(
    requestValidationMiddleware(restResponsibleGamblingSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.resetUserResponsible,
    responseValidationMiddleware(restResponsibleGamblingSchema)
  )

userRouter
  .route('/update-password')
  .put(
    requestValidationMiddleware(updateUserPasswordSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserPassword,
    responseValidationMiddleware(updateUserPasswordSchema)
  )

userRouter
  .route('/update-user-status')
  .put(
    requestValidationMiddleware(updateUserStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserStatus,
    responseValidationMiddleware(updateUserStatusSchema)
  )

userRouter
  .route('/delete-username')
  .put(
    requestValidationMiddleware(deleteUserNameSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.deleteUserName,
    responseValidationMiddleware(deleteUserNameSchema)
  )

userRouter
  .route('/remove-pw-lock')
  .put(
    requestValidationMiddleware(removeUserPwLockSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.removeUserPwLock,
    responseValidationMiddleware(removeUserPwLockSchema)
  )

userRouter
  .route('/update-ssn')
  .put(
    requestValidationMiddleware(updateSsnSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateSsn,
    responseValidationMiddleware(updateSsnSchema)
  )

userRouter
  .route('/bank-details')
  .get(
    requestValidationMiddleware(userDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getBankDetails,
    responseValidationMiddleware({})
  )
  .put(
    requestValidationMiddleware(updateUserBankDetailsSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateBankDetails,
    responseValidationMiddleware(updateUserBankDetailsSchema)
  )

userRouter
  .route('/activity-logs')
  .get(
    requestValidationMiddleware(activityLogSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getActivityLogs,
    responseValidationMiddleware(activityLogSchema)
  )

userRouter
  .route('/favorite-log')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.markLogFavorite,
    responseValidationMiddleware({})
  )

userRouter
  .route('/email-comms-details')
  .get(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    UserController.getEmailCommsDetails,
    responseValidationMiddleware({})
  )

userRouter
  .route('/update-user')
  .put(
    requestValidationMiddleware(updateProfileSchemas),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.updateProfile,
    responseValidationMiddleware(updateProfileSchemas)
  )

userRouter
  .route('/force-logout')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.forceLogout,
    responseValidationMiddleware({})
  )

userRouter
  .route('/comment')
  .post(
    requestValidationMiddleware(addCommentSchema),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.addComment,
    responseValidationMiddleware(addCommentSchema)
  )

userRouter
  .route('/user-activity')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.userActivity,
    responseValidationMiddleware()
  )

userRouter
  .route('/force-logout')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.forceLogout,
    responseValidationMiddleware({})
  )

userRouter
  .route('/comment')
  .post(
    requestValidationMiddleware(addCommentSchema),
    isAdminAuthenticated,
    contextMiddleware(true),
    UserController.addComment,
    responseValidationMiddleware(addCommentSchema)
  )

userRouter
  .route('/user-kyc')
  .get(
    requestValidationMiddleware(updateKycSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    UserController.getUserKycHistory,
    responseValidationMiddleware(updateKycSchema)
  )
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    UserController.updateUserKyc,
    responseValidationMiddleware({})
  )

userRouter
  .route('/redeem-request')
  .get(
    requestValidationMiddleware(redeemRequestsSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    PaymentController.getRedeemRequest,
    responseValidationMiddleware(redeemRequestsSchema)
  )

userRouter
  .route('/providers')
  .get(
    requestValidationMiddleware(casinoProviderGetAllSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getAllProviders,
    responseValidationMiddleware(providerListSchema)
  )

userRouter
  .route('/fraud-detail')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.fraudUserDetails,
    responseValidationMiddleware()
  )

userRouter
  .route('/referred-users-detail')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.referredUserDetails,
    responseValidationMiddleware()
  )

userRouter
  .route('/disable-2FA')
  .post(
    requestValidationMiddleware(disable2FASchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.disable2FA,
    responseValidationMiddleware({})
  )

// update user ban status:
userRouter
  .route('/update-user-ban-status')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    UserController.updateUserBanStatus,
    responseValidationMiddleware()
  )

// reason- setting:
userRouter
  .route('/ban-reason')
  .get(
    requestValidationMiddleware(getReasonListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.getAllBanReasons,
    responseValidationMiddleware(getReasonListSchemas)
  )
  .post(
    requestValidationMiddleware(setReasonSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.createReasonSetting,
    responseValidationMiddleware(updateReasonSchemas)
  )
  .put(
    requestValidationMiddleware(updateReasonSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.updateReasonSetting,
    responseValidationMiddleware(updateReasonSchemas)
  )
  .patch(
    requestValidationMiddleware(updateBanReasonStatusSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.updateBanReasonStatus,
    responseValidationMiddleware(defaultResponseSchemas)
  )
  .delete(
    requestValidationMiddleware(deleteReasonSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.deleteBanReason,
    responseValidationMiddleware(defaultResponseSchemas)
  )

userRouter
  .route('/ban-reason/detail')
  .get(
    requestValidationMiddleware(getReasonDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.getBanReason,
    responseValidationMiddleware(defaultResponseSchemas)
  )
userRouter
  .route('/user-ban-reason')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    BanUserSettingController.getUserBanReason,
    responseValidationMiddleware()
  )

userRouter
  .route('/tiers')
  .get(
    requestValidationMiddleware(getAllTierSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TierController.getAllTier,
    responseValidationMiddleware(getAllTierSchema)
  )
// Canadian Skill Question Redeem Request
userRouter
  .route('/add-canadian-customer')
  .post(
    requestValidationMiddleware(addUserForSkillQuestionSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.addUserForSkillQuestion,
    responseValidationMiddleware(defaultResponseSchemas)
  )
export default userRouter
