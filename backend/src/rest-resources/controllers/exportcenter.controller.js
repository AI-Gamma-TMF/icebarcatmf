import { sendResponse } from '../../utils/response.helpers'
import { GetExportCenterListService } from '../../services/exportCenter'

export default class getExportCenterListController {
  static async getlist (req, res, next) {
    try {
      const { result, successful, errors } = await GetExportCenterListService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
