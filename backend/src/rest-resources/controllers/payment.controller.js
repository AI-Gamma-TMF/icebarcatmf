import { sendResponse } from '../../utils/response.helpers'
import { GetCasinoTransactionsService } from '../../services/casinoTransaction'
import { GetRedeemRequestsService, GetTransactionsService, RedeemRequestActionService, UpdatePaymentStatusService, GetUserRedeemRequestService, GetSkrillBalanceService, ApproveAllRedeemRequestService, GetUsersWithVaultCoinsService, GetRedeemDashboardDataService, GetPaymentMethodService, UpdatePaymentMethodStatusService } from '../../services/payment'
import { CreateRedeemRuleService, DeleteRedeemRuleService, GetRedeemRuleService, GetRuleUserDetailsService, GetUsersFromCsvService, GetWithdrawRequestDetailsService, RemoveUsersFromRuleService, UpdateRedeemRuleService } from '../../services/payment/redeem-rule'
// import { generateCsvFilename } from '../../utils/common'
// import { CSV_FILE_STATIC_NAMES } from '../../utils/constants/constant'

export default class PaymentController {
  static async transactions (req, res, next) {
    try {
      const { result, successful, errors } = await GetTransactionsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async redeemRequest (req, res, next) {
    try {
      const { result, successful, errors } = await RedeemRequestActionService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRedeemRequest (req, res, next) {
    try {
      const { result, successful, errors } = await GetRedeemRequestsService.execute({ ...req.body, ...req.query }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateRedeemRequestStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePaymentStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCasinoTransactions (req, res, next) {
    try {
      const { result, successful, errors } = await GetCasinoTransactionsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // get user redeem request:
  static async getUserRedeemRequest (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserRedeemRequestService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSkrillBalance (req, res, next) {
    try {
      const { result, successful, errors } = await GetSkrillBalanceService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createRedeemRule (req, res, next) {
    try {
      const { result, successful, errors } = await CreateRedeemRuleService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateRedeemRule (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRedeemRuleService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRedeemRule (req, res, next) {
    try {
      const { result, successful, errors } = await GetRedeemRuleService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteRedeemRule (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteRedeemRuleService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async approveAllRedeemRequest (req, res, next) {
    try {
      const { result, successful, errors } = await ApproveAllRedeemRequestService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getVaultCoinStorage (req, res, next) {
    try {
      const { result, successful, errors } = await GetUsersWithVaultCoinsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUsersFromCsv (req, res, next) {
    try {
      const { result, successful, errors } = await GetUsersFromCsvService.execute({ ...req.body, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRuleUserDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetRuleUserDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRedeemDashboardData (req, res, next) {
    try {
      const { result, successful, errors } = await GetRedeemDashboardDataService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async removeUsersFromRedeemRule (req, res, next) {
    try {
      const { result, successful, errors } = await RemoveUsersFromRuleService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRuleWiseWithdrawRequestDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetWithdrawRequestDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllPaymentMethods (req, res, next) {
    try {
      const { result, successful, errors } = await GetPaymentMethodService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePaymentMethodStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePaymentMethodStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
