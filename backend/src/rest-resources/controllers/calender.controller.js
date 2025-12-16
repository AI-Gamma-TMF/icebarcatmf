import { GetCalenderViewEventsService } from '../../services/calender/getCalenderViewEvents.service'
import { sendResponse } from '../../utils/response.helpers'

export default class CalenderController {
  static async getCalenderEvents (req, res, next) {
    try {
      const { result, successful, errors } = await GetCalenderViewEventsService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
