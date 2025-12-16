import multer from 'multer'
import express from 'express'
import CasinoController from '../../../controllers/casino.controller'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'

import {
  casinoProviderGetAllSchemas,
  // casinoProviderCreateSchemas,
  casinoProviderUpdateSchemas,
  getSubCategorySchemas,
  createSubCategorySchemas,
  updateSubCategorySchemas,
  deleteSubCategorySchemas,
  orderSubCategorySchemas,
  casinoGameCreateSchemas,
  casinoGameUpdateSchemas,
  casinoGameOrderUpdateSchemas,
  casinoGameDeleteSchemas,
  // getCasinoTransactionsSchemas,
  // casinoProviderDeleteSchemas,
  getAggregatorSchemas,
  updateAggregatorSchemas,
  addCasinoGameSchemas,
  providerOrderSchemas,
  hideCasinoProviderSchemas,
  hideCasinoAggregatorSchemas,
  hideCasinoGameSchemas
} from '../../../../rest-resources/middlewares/validation/casino-validation.schemas'
import gameDashboardControllers from '../../../controllers/gameDashboard.controller'
import freeSpinRoutes from './freeSpin.routes'

const upload = multer()
const args = { mergeParams: true }
const casinoRouter = express.Router(args)

casinoRouter
  .route('/providers')
  .get(
    requestValidationMiddleware(casinoProviderGetAllSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getAllProviders,
    responseValidationMiddleware(casinoProviderGetAllSchemas)
  )
  // .post(
  //   upload.single('thumbnail'),
  //   requestValidationMiddleware(casinoProviderCreateSchemas),
  //   contextMiddleware(true),
  //   isAdminAuthenticated,
  //   checkPermission,
  //   CasinoController.createCasinoProvider,
  //   responseValidationMiddleware(casinoProviderCreateSchemas)
  // )
  .put(
    upload.single('thumbnail'),
    requestValidationMiddleware(casinoProviderUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.updateCasinoProvider,
    responseValidationMiddleware(casinoProviderUpdateSchemas)
  )
// .delete(
//   requestValidationMiddleware(casinoProviderDeleteSchemas),
//   contextMiddleware(true),
//   isAdminAuthenticated,
//   checkPermission,
//   CasinoController.deleteCasinoProvider,
//   responseValidationMiddleware(casinoProviderDeleteSchemas)
// )

casinoRouter
  .route('/subcategory')
  .get(
    requestValidationMiddleware(getSubCategorySchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getSubCategory,
    responseValidationMiddleware(getSubCategorySchemas)
  )
  .post(
    upload.fields([{ name: 'thumbnail' }, { name: 'selectedThumbnail' }]),
    requestValidationMiddleware(createSubCategorySchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.createSubCategory,
    responseValidationMiddleware(createSubCategorySchemas)
  )
  .put(
    upload.fields([{ name: 'thumbnail' }, { name: 'selectedThumbnail' }]),
    requestValidationMiddleware(updateSubCategorySchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.updateSubCategory,
    responseValidationMiddleware(updateSubCategorySchemas)
  )
  .delete(
    requestValidationMiddleware(deleteSubCategorySchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.deleteSubCategory,
    responseValidationMiddleware(deleteSubCategorySchemas)
  )
casinoRouter
  .route('/subcategory/order')
  .put(
    requestValidationMiddleware(orderSubCategorySchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.orderSubCategory,
    responseValidationMiddleware(orderSubCategorySchemas)
  )

casinoRouter
  .route('/game')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getCasinoGame,
    responseValidationMiddleware({})
  )
  .post(
    requestValidationMiddleware(casinoGameCreateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.createCasinoGame,
    responseValidationMiddleware(casinoGameCreateSchemas)
  )
  .put(
    upload.single('thumbnailLong'),
    requestValidationMiddleware(casinoGameUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.updateCasinoGame,
    responseValidationMiddleware(casinoGameUpdateSchemas)
  )
  .delete(
    requestValidationMiddleware(casinoGameDeleteSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.deleteCasinoGame,
    responseValidationMiddleware({})
  )

casinoRouter
  .route('/games/order')
  .put(
    requestValidationMiddleware(casinoGameOrderUpdateSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.updateOrderGame,
    responseValidationMiddleware(casinoGameOrderUpdateSchemas)
  )
casinoRouter
  .route('/games')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getAllCasinoGame,
    responseValidationMiddleware({})
  )

casinoRouter
  .route('/aggregator')
  .get(
    requestValidationMiddleware(getAggregatorSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getAggregators,
    responseValidationMiddleware(getAggregatorSchemas)
  )
  .put(
    requestValidationMiddleware(updateAggregatorSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.updateAggregator,
    responseValidationMiddleware(updateAggregatorSchemas)
  )

casinoRouter
  .route('/add-game')
  .post(
    upload.single('thumbnail'),
    requestValidationMiddleware(addCasinoGameSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.addCasinoGame,
    responseValidationMiddleware(addCasinoGameSchemas)
  )

casinoRouter.route('/providers/order')
  .put(
    requestValidationMiddleware(providerOrderSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.providerOrder,
    responseValidationMiddleware(providerOrderSchemas)
  )

casinoRouter
  .route('/game-dashboard')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    gameDashboardControllers.getGameDashboardData,
    responseValidationMiddleware({ responseValidationMiddleware })
  )

casinoRouter
  .route('/game-dashboard/game-infos')
  .get(
    requestValidationMiddleware({}),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    gameDashboardControllers.getGameInfos,
    responseValidationMiddleware({})
  )

casinoRouter
  .route('/hide-aggregator')
  .put(
    requestValidationMiddleware(hideCasinoAggregatorSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.hideCasinoAggregator,
    responseValidationMiddleware(hideCasinoAggregatorSchemas)
  )

casinoRouter
  .route('/hide-provider')
  .put(
    requestValidationMiddleware(hideCasinoProviderSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.hideCasinoProvider,
    responseValidationMiddleware(hideCasinoProviderSchemas)
  )

casinoRouter
  .route('/hide-game')
  .put(
    requestValidationMiddleware(hideCasinoGameSchemas),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.hideCasinoGame,
    responseValidationMiddleware(hideCasinoGameSchemas)
  )

casinoRouter.use('/free-spin', freeSpinRoutes)
export default casinoRouter
