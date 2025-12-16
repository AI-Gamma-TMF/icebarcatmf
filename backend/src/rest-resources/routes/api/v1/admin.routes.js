import express from 'express'
import multer from 'multer'
import AdminController from '../../../controllers/admin.controller'
import WalletController from '../../../controllers/wallet.controller'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import contextMiddleware from '../../../middlewares/context.middleware'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import {
  loginSchemas,
  adminDetailsSchemas,
  adminChildrenSchemas,
  addBalanceSchemas,
  adminListSchemas,
  adminCreateSchemas,
  adminUpdateSchemas,
  adminRolesSchemas,
  adminGroupSchemas,
  updateConfigSchemas,
  updateProfileSchemas,
  adminDeleteSchemas
} from '../../../middlewares/validation/admin-validation.schemas'
const upload = multer()

const args = { mergeParams: true }
const adminRouter = express.Router(args)

adminRouter
  .route('/')
  .get(
    requestValidationMiddleware(adminListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminController.getAdminUsers,
    responseValidationMiddleware(adminListSchemas)
  )
  .post(
    requestValidationMiddleware(adminCreateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminController.createAdminUser,
    responseValidationMiddleware(adminCreateSchemas)
  )
  .put(
    requestValidationMiddleware(adminUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminController.updateAdmin,
    responseValidationMiddleware(adminUpdateSchemas)
  )
  .delete(
    requestValidationMiddleware(adminDeleteSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminController.deleteAdmin,
    responseValidationMiddleware(adminDeleteSchemas)
  )

adminRouter
  .route('/detail')
  .get(
    requestValidationMiddleware(adminDetailsSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminController.getAdminDetail,
    responseValidationMiddleware(adminDetailsSchemas)
  )

adminRouter
  .route('/roles')
  .get(
    requestValidationMiddleware(adminRolesSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminController.getRoles,
    responseValidationMiddleware(adminRolesSchemas)
  )

adminRouter
  .route('/group')
  .get(
    requestValidationMiddleware(adminGroupSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminController.getAllGroup,
    responseValidationMiddleware(adminGroupSchemas)
  )

adminRouter
  .route('/child')
  .get(
    requestValidationMiddleware(adminChildrenSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminController.getAdminChildren,
    responseValidationMiddleware(adminChildrenSchemas)
  )

adminRouter
  .route('/config')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminController.getConfig,
    responseValidationMiddleware({})
  )
  .put(
    upload.fields([{ name: 'image' }, { name: 'mobileImage' }]),
    requestValidationMiddleware(updateConfigSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminController.updateConfig,
    responseValidationMiddleware(updateConfigSchemas)
  )

adminRouter
  .route('/add-remove-balance')
  .put(
    requestValidationMiddleware(addBalanceSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    WalletController.addBalance,
    responseValidationMiddleware(addBalanceSchemas)
  )
adminRouter
  .route('/profile')
  .put(
    requestValidationMiddleware(updateProfileSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminController.updateProfile,
    responseValidationMiddleware({})
  )

adminRouter
  .route('/login')
  .post(
    requestValidationMiddleware(loginSchemas),
    AdminController.loginAdmin,
    responseValidationMiddleware({})
  )

adminRouter
  .route('/logout')
  .post(
    requestValidationMiddleware({}),
    isAdminAuthenticated,
    AdminController.logoutAdmin,
    responseValidationMiddleware({})
  )

adminRouter
  .route('/generate-otp-2fa')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    AdminController.generateOtp,
    responseValidationMiddleware({})
  )

adminRouter
  .route('/verify-otp-2fa')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    AdminController.verifyOtp,
    responseValidationMiddleware({})
  )

adminRouter
  .route('/disable-auth')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    AdminController.disableAuth,
    responseValidationMiddleware({})
  )

adminRouter
  .route('/update-user-tier')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    AdminController.manualUserTierUpdate,
    responseValidationMiddleware({})
  )

export default adminRouter
