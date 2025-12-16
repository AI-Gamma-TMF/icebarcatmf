import { AntiFraudRulesService } from '../../services/antiFraud/antiFraudRules'
import { CreateUserGroup } from '../../services/antiFraud/createUserGroup'
import { CreateRule } from '../../services/antiFraud/createUserRules'
import { UpdateRule } from '../../services/antiFraud/updateRules'
import { UserGroup } from '../../services/antiFraud/userGroups'
import { GetfraudUserDetailsService } from '../../services/user'
import { sendResponse } from '../../utils/response.helpers'

export default class AntiFraudController {
  static async addPlayersToGroup (req, res, next) {
    try {
      const { result, successful, errors } = await CreateUserGroup.execute({ ...req.body, userCsv: req.file })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGroups (req, res, next) {
    try {
      const { result, successful, errors } = await UserGroup.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createRules (req, res, next) {
    try {
      const { result, successful, errors } = await CreateRule.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRules (req, res, next) {
    try {
      const { result, successful, errors } = await AntiFraudRulesService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateRules (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRule.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async fraudUsersData (req, res, next) {
    try {
      const { result, successful, errors } = await GetfraudUserDetailsService.execute({ ...req.body, ...req.query }, req.context )
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
