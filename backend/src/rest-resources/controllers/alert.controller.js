import { AdminListService, AgentOverviewService, AssignTicketService, ResolveUserTicketService, UserTicketListService } from '../../services/alert'
import { sendResponse } from '../../utils/response.helpers'

export default class AlertController {
  static async getUserTickets (req, res, next) {
    try {
      const { result, successful, errors } = await UserTicketListService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async resolveUserTicket (req, res, next) {
    try {
      const { result, successful, errors } = await ResolveUserTicketService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async assignTicket (req, res, next) {
    try {
      const { result, successful, errors } = await AssignTicketService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAgentOverview (req, res, next) {
    try {
      const { result, successful, errors } = await AgentOverviewService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAdmins (req, res, next) {
    try {
      const { result, successful, errors } = await AdminListService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
