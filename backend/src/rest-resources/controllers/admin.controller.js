import passport from 'passport'

import { sendResponse } from '../../utils/response.helpers'
import { LoginErrorType } from '../../utils/constants/errors'
import { TICKET_TYPE } from '../../utils/constants/constant'
import db from '../../db/models'

import {
  GetRolesService,
  GetAdminUsers,
  GetAdminDetail,
  GetAllGroupService,
  GetAdminChildren,
  CreateAdminUser,
  UpdateAdminUser,
  UpdateStatusService,
  UpdateAdminProfileUser,
  DeleteAdminUser
} from '../../services/adminUsers'

import {
  GetConfigService,
  UpdateConfigService
} from '../../services/config'

import {
  ElasticHealthCheckService
} from '../../services/report'

import {
  DisableAuthService,
  GenerateOtpService,
  VerifyOtpService
} from '../../services/2fa'

import { ManualUserTierUpdateService } from '../../services/tiers'

export default class AdminController {
  static async loginAdmin (req, res, next) {
    req.next = next
    passport.authenticate('login', (err, adminDetail) => {
      res.cookie('adminAccessToken', '', { expires: new Date(0) })
      if (err) {
        LoginErrorType.description = err.message
        LoginErrorType.name = err.code
        return req.next(LoginErrorType)
      }

      req.login(adminDetail, async (loginErr) => {
        if (loginErr) {
          LoginErrorType.description = loginErr.message
          LoginErrorType.name = loginErr.code
          return req.next(LoginErrorType)
        }
        res.cookie('adminAccessToken', adminDetail.accessToken, { httpOnly: true })

        // Alert tickets Counts w.r.t. admin
        if (adminDetail.userPermission.permission.Alert?.includes('R')) {
          let ticketQuery
          if (+(adminDetail.adminUserId) !== 1) {
            ticketQuery = { assignTo: adminDetail.adminUserId }
          }

          const totalVerificationTicket = await db.UserTickets.count({
            col: 'id',
            where: {
              ...ticketQuery,
              ticketType: TICKET_TYPE.VERIFICATION
            }
          })

          const totalRedemptionTicket = await db.UserTickets.count({
            col: 'id',
            where: {
              ...ticketQuery,
              ticketType: TICKET_TYPE.REDEMPTION
            }
          })

          const totalExpiryTicket = await db.UserTickets.count({
            col: 'id',
            where: {
              ...ticketQuery,
              ticketType: TICKET_TYPE.EXPIRY
            }
          })

          const totalFraudTicket = await db.UserTickets.count({
            col: 'id',
            where: {
              ...ticketQuery,
              ticketType: TICKET_TYPE.FRAUD
            }
          })

          adminDetail.totalVerificationTickets = totalVerificationTicket
          adminDetail.totalRedemptionTickets = totalRedemptionTicket
          adminDetail.totalExpiryTickets = totalExpiryTicket
          adminDetail.totalFraudTickets = totalFraudTicket
        }
        delete adminDetail.password
        delete adminDetail.accessToken
        sendResponse({ req, res, next }, {
          result: {
            ...adminDetail,
            message: (adminDetail.authEnable) ? '2FA enabled' : 'admin logged in Successfully!'
          },
          successful: true,
          serviceErrors: {}
        })
      })
    })(req, res)
  }

  static async getRoles (req, res, next) {
    try {
      const { result, successful, errors } = await GetRolesService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAdminUsers (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminUsers.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAdminDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminDetail.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllGroup (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllGroupService.execute()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAdminChildren (req, res, next) {
    try {
      const { result, successful, errors } = await GetAdminChildren.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getConfig (req, res, next) {
    try {
      const { result, successful, errors } = await GetConfigService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createAdminUser (req, res, next) {
    try {
      const { result, successful, errors } = await CreateAdminUser.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateAdmin (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateAdminUser.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteAdmin (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteAdminUser.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateConfig (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateConfigService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async logoutAdmin (req, res, next) {
    res.clearCookie('accessToken')
    sendResponse({ req, res, next }, { result: { success: true }, successful: true, serviceErrors: {} })
  }

  static async updateStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateStatusService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateAdminProfileUser.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async elasticHealthCheck (req, res, next) {
    try {
      const { result, successful, errors } = await ElasticHealthCheckService.execute({ ...req.body })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async generateOtp (req, res, next) {
    try {
      const { result, successful, errors } = await GenerateOtpService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verifyOtp (req, res, next) {
    try {
      const { result, successful, errors } = await VerifyOtpService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async disableAuth (req, res, next) {
    try {
      const { result, successful, errors } = await DisableAuthService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async manualUserTierUpdate (req, res, next) {
    try {
      const { result, successful, errors } = await ManualUserTierUpdateService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
