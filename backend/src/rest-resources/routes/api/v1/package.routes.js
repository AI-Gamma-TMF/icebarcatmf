import express from 'express'
import packageController from '../../../controllers/package.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import { packageDetailSchemas, packageCreateSchemas, packageUpdateSchemas, packageOrderSchemas, packageDeleteSchemas, defaultResponseSchemas, packageUserDetailSchemas, packageConfigCreateSchemas, getPlayeridsImportCsvSchemas, getAllPackageListSchemas } from '../../../middlewares/validation/package-validation.schemas'
import multer from 'multer'

const args = { mergeParams: true }
const packageRouter = express.Router(args)
const upload = multer()

packageRouter.route('/')
  .get(
    requestValidationMiddleware(getAllPackageListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    packageController.getAllPackagesList,
    responseValidationMiddleware(getAllPackageListSchemas)
  )
  .post(
    upload.single('image'),
    requestValidationMiddleware(packageCreateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.create,
    responseValidationMiddleware(packageCreateSchemas)
  )
  .put(
    upload.single('image'),
    requestValidationMiddleware(packageUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.update,
    responseValidationMiddleware({})
  )
  .delete(
    requestValidationMiddleware(packageDeleteSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    packageController.deletePackage,
    responseValidationMiddleware(defaultResponseSchemas)
  )

packageRouter.route('/detail/:packageId')
  .get(
    requestValidationMiddleware(packageDetailSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    packageController.getPackageDetails,
    responseValidationMiddleware(packageDetailSchemas)
  )

packageRouter.route('/order')
  .put(
    requestValidationMiddleware(packageOrderSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.order,
    responseValidationMiddleware(packageOrderSchemas)
  )

packageRouter.route('/status')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    packageController.updatePackageStatus,
    responseValidationMiddleware({})
  )

packageRouter.route('/user-filter')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    packageController.getPlayerIdsPerFilter,
    responseValidationMiddleware()
  )

packageRouter.route('/user-details')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    packageController.getPackageUserDetails,
    responseValidationMiddleware()
  )

packageRouter.route('/restore-package')
  .put(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.restorePackage,
    responseValidationMiddleware({})
  )
  .get(
    requestValidationMiddleware(packageUserDetailSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.getRestoreUserPackage,
    responseValidationMiddleware({})
  )
// Not used Currently
packageRouter.route('/ladder-package')
  .post(
    upload.single('image'),
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.createLadderPackages,
    responseValidationMiddleware({})
  )

packageRouter.route('/template-package')
  .post(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.createTemplatePackage,
    responseValidationMiddleware({})
  )

packageRouter.route('/user')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.getExternalUsers,
    responseValidationMiddleware({})
  )

packageRouter.route('/create-config')
  .post(
    requestValidationMiddleware(packageConfigCreateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.createConfig,
    responseValidationMiddleware(packageConfigCreateSchemas)
  )
packageRouter.route('/getSubPackages')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.getSubPackages,
    responseValidationMiddleware({})
  )
packageRouter.route('/import-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware(getPlayeridsImportCsvSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.getPlayerIdsPerImportCsv,
    responseValidationMiddleware(getPlayeridsImportCsvSchemas)
  )

packageRouter.route('/all-package-images')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    packageController.getAllPackagesImages,
    responseValidationMiddleware({})
  )

export default packageRouter
