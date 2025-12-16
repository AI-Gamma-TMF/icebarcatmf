import express from 'express'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import TournamentController from '../../../controllers/tournament.controller'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import multer from 'multer'
import {
  addVipTournamentUsersFromCsvSchema,
  createFreeEntryInTournamentPlayerSchema,
  createTournamentPayoutSchema,
  createTournamentSchema,
  defaultResponseSchema,
  getTournamentDashboardSchema,
  getTournamentDetailSchema,
  getTournamentGamesSchema,
  getTournamentSchema,
  getTournamentStatsDashboardSchema,
  tournamentOrderUpdateSchema,
  updateBootPlayerSchema,
  updateTournamentSchema,
  updateTournamentStatusSchema
} from '../../../middlewares/validation/tournament-validation.schemas'
import CasinoController from '../../../controllers/casino.controller'
import { casinoProviderGetAllSchemas, getSubCategorySchemas } from '../../../middlewares/validation/casino-validation.schemas'
import { userListSchemas } from '../../../middlewares/validation/user-validation.schemas'
import UserController from '../../../controllers/user.controller'
import { getAllTierSchema } from '../../../middlewares/validation/tier-validation.schema'
import TierController from '../../../controllers/tier.controller'

const upload = multer()
const args = { mergeParams: true }
const tournamentRouter = express.Router(args)

tournamentRouter
  .route('/')
  .get(
    requestValidationMiddleware(getTournamentSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getAllTournament,
    responseValidationMiddleware(defaultResponseSchema)
  )
  .post(
    upload.single('tournamentImg'),
    requestValidationMiddleware(createTournamentSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.createTournament,
    responseValidationMiddleware(defaultResponseSchema)
  )
  .put(
    upload.single('tournamentImg'),
    requestValidationMiddleware(updateTournamentSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.updateTournament,
    responseValidationMiddleware(defaultResponseSchema)
  )
  .patch(
    requestValidationMiddleware(updateTournamentStatusSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.updateTournamentStatus,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/games')
  .get(
    requestValidationMiddleware(getTournamentGamesSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getGames,
    responseValidationMiddleware()
  )
tournamentRouter
  .route('/subcategory')
  .get(
    requestValidationMiddleware(getSubCategorySchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getSubCategory,
    responseValidationMiddleware(getSubCategorySchemas)
  )
tournamentRouter
  .route('/providers')
  .get(
    requestValidationMiddleware(casinoProviderGetAllSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    CasinoController.getAllProviders,
    responseValidationMiddleware(casinoProviderGetAllSchemas)
  )
tournamentRouter
  .route('/user')
  .get(
    requestValidationMiddleware(userListSchemas),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    UserController.getUsers,
    responseValidationMiddleware(userListSchemas)
  )
tournamentRouter
  .route('/user/tiers')
  .get(
    requestValidationMiddleware(getAllTierSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TierController.getAllTier,
    responseValidationMiddleware(getAllTierSchema)
  )
tournamentRouter
  .route('/:tournamentId')
  .get(
    requestValidationMiddleware(getTournamentDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getTournamentDetails,
    responseValidationMiddleware(defaultResponseSchema)
  )

// Get Tournament Details by Id without LeaderBoard
tournamentRouter
  .route('/detail/:tournamentId')
  .get(
    requestValidationMiddleware(getTournamentDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.fetchTournamentDetail,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/upload-csv')
  .post(
    upload.single('file'),
    requestValidationMiddleware(addVipTournamentUsersFromCsvSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.addVipTournamentUsersFromCsv,
    responseValidationMiddleware(defaultResponseSchema)

  )

tournamentRouter
  .route('/boot-player')
  .patch(
    requestValidationMiddleware(updateBootPlayerSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.updateUserTournamentPlayerStatus,
    responseValidationMiddleware(defaultResponseSchema)
  )
tournamentRouter
  .route('/free-entry')
  .post(
    requestValidationMiddleware(createFreeEntryInTournamentPlayerSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.createFreeEntryInTournament,
    responseValidationMiddleware(defaultResponseSchema)
  )
tournamentRouter
  .route('/order')
  .put(
    requestValidationMiddleware(tournamentOrderUpdateSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.tournamentOrderUpdate,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/:tournamentId/payout')
  .get(
    requestValidationMiddleware(getTournamentDetailSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getEligibleTournamentWinners,
    responseValidationMiddleware(defaultResponseSchema)
  )
  .post(
    requestValidationMiddleware(createTournamentPayoutSchema),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.createTournamentPayout,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/:tournamentId/dashboard')
  .get(
    requestValidationMiddleware(getTournamentDashboardSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getTournamentDashboard,
    responseValidationMiddleware(defaultResponseSchema)
  )
tournamentRouter
  .route('/:tournamentId/dashboard/stats')
  .get(
    requestValidationMiddleware(getTournamentStatsDashboardSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getTournamentStatsDashboard,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/:tournamentId/dashboard/stats/filters')
  .get(
    requestValidationMiddleware(getTournamentDashboardSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getTournamentStatsFilterDashboard,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/:tournamentId/dashboard/winner-booted-summary')
  .get(
    requestValidationMiddleware(getTournamentDashboardSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getTournamentStatsWinnerBootedSummary,
    responseValidationMiddleware(defaultResponseSchema)
  )

tournamentRouter
  .route('/:tournamentId/dashboard/total-score-players-count')
  .get(
    requestValidationMiddleware(getTournamentDashboardSchema),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    TournamentController.getTournamentStatsTotalScoreAndCount,
    responseValidationMiddleware(defaultResponseSchema)
  )
export default tournamentRouter
