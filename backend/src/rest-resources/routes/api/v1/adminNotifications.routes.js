import express from 'express'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import contextMiddleware from '../../../middlewares/context.middleware'
import { checkPermission, isAdminAuthenticated } from '../../../middlewares'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import AdminNotificationController from '../../../controllers/adminNotification.controller'

const args = { mergeParams: true }
const adminNotificationsRouter = express.Router(args)

adminNotificationsRouter
  .route('/')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    // checkPermission,
    AdminNotificationController.getNotifications,
    responseValidationMiddleware()
  )

adminNotificationsRouter
  .route('/mark-read/:notificationId')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    // checkPermission,
    AdminNotificationController.markAsRead,
    responseValidationMiddleware()
  )

adminNotificationsRouter
  .route('/mark-all-read')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    // checkPermission,
    AdminNotificationController.markAllAsRead,
    responseValidationMiddleware()
  )

adminNotificationsRouter
  .route('/settings')
  .get(
    requestValidationMiddleware(),
    contextMiddleware(false),
    isAdminAuthenticated,
    checkPermission,
    AdminNotificationController.getNotificationSettings,
    responseValidationMiddleware()
  )

adminNotificationsRouter
  .route('/settings')
  .put(
    requestValidationMiddleware(),
    contextMiddleware(true),
    isAdminAuthenticated,
    checkPermission,
    AdminNotificationController.updateNotificationSettings,
    responseValidationMiddleware()
  )

export default adminNotificationsRouter
