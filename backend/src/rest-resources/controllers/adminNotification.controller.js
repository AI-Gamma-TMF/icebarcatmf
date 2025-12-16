import { GetAdminNotifications } from '../../services/notification/getAdminNotifications.service'
import { GetAdminNotificationSettings } from '../../services/notification/getAdminNotificationSettings.service'
import { MarkAllNotificationAsRead } from '../../services/notification/markAllNotificationAsRead.service'
import { MarkNotificationAsRead } from '../../services/notification/markNotificationAsRead.service'
import { UpdateNotificationSettings } from '../../services/notification/updateNotificationSettings.service'
import { sendResponse } from '../../utils/response.helpers'

export default class AdminNotificationController {
  static async getNotifications (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminNotifications.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async markAsRead (req, res, next) {
    try {
      const { result, successful, errors } = await MarkNotificationAsRead.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async markAllAsRead (req, res, next) {
    try {
      const { result, successful, errors } = await MarkAllNotificationAsRead.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getNotificationSettings (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminNotificationSettings.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateNotificationSettings (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateNotificationSettings.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
