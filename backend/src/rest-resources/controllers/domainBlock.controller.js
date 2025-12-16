import { CreateBlockedDomainsService, DeleteBlockedDomainService, GetBlockedDomainsService } from '../../services/blockedDomain'
import { sendResponse } from '../../utils/response.helpers'

export default class DomainBlockController {
  static async addBlockedDomains (req, res, next) {
    try {
      const { result, successful, errors } = await CreateBlockedDomainsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBlockedDomains (req, res, next) {
    try {
      const { result, successful, errors } = await GetBlockedDomainsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBlockedDomains (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBlockedDomainService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
