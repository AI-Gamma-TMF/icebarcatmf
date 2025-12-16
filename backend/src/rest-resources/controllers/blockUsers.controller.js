import { sendResponse } from '../../utils/response.helpers'
import { AddBlockedUsers, AddBlockedUsersFromCsv, GetBlockedUsersList } from '../../services/blockUsers'

export default class BlockedUsersControllers {
  static async addBlockedUsers (req, res, next) {
    try {
      const { result, successful, errors } = await AddBlockedUsers.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBlockedUsersList (req, res, next) {
    try {
      const { result, successful, errors } = await GetBlockedUsersList.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addBlockedUsersFromCsv (req, res, next) {
    try {
      const { result, successful, errors } = await AddBlockedUsersFromCsv.execute({ ...req.body, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
