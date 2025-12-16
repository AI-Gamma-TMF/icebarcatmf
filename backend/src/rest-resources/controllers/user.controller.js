import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { sendResponse } from '../../utils/response.helpers'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { UpdateUserBanStatus } from '../../services/user/updateUserBanStatus.service'
import { SetDailyLimitService, SetDepositLimitService, SetLossLimitService, SetTimeLimitService } from '../../services/userLimit'
import { GetUsersService, GetUserByIdService, GetUserDocumentService, VerifyUserDocumentService, DashboardUserService, UpdateKycStatusService, GetUserResponsibleSetting, UpdateUserResponsibleSetting, UpdateUserPassword, GetUserCasinoDetailService, RemoveUserPwLock, UpdateUserStatus, UpdateUserSsnNumber, GetBankDetailService, GetActivityLogsService, FavoriteLogService, GetEmailCommsDetails, UpdateUserProfileService, UpdateBankDetails, forceLogoutService, AddCommentService, UploadDocumentsService, GetUserActivityService, UpdateUserKyc, GetUserKycHistory, ResetUserResponsibleSetting, GetfraudUserDetailsService, GetReferredUserDetailsService, UpdateSumsubKycStatus, DeleteSumsubKycProfileService, DisableUser2FAService, DeleteUserName, AddUserForSkillBasedQuestionService } from '../../services/user'

export default class UserController {
  static async getUsers (req, res, next) {
    try {
      const { result, successful, errors } = await GetUsersService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUser (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserByIdService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserDocument (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserDocumentService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBankDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetBankDetailService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBankDetails (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateBankDetails.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setDailyLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetDailyLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setLossLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetLossLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setDepositLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetDepositLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setTimeLimit (req, res, next) {
    try {
      const { result, successful, errors } = await SetTimeLimitService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async verifyUserDocument (req, res, next) {
    try {
      const { result, successful, errors } = await VerifyUserDocumentService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async dashboardUser (req, res, next) {
    try {
      const { result, successful, errors } = await DashboardUserService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async kycStatusUpdate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateKycStatusService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserResponsibleSetting (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserResponsibleSetting.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserResponsibleSetting (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserResponsibleSetting.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async resetUserResponsible (req, res, next) {
    try {
      const { result, successful, errors } = await ResetUserResponsibleSetting.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserPassword (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserPassword.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserStatus.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteUserName (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteUserName.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserCasinoDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserCasinoDetailService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async removeUserPwLock (req, res, next) {
    try {
      const { result, successful, errors } = await RemoveUserPwLock.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSsn (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserSsnNumber.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getActivityLogs (req, res, next) {
    try {
      const { result, successful, errors } = await GetActivityLogsService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async markLogFavorite (req, res, next) {
    try {
      const { result, successful, errors } = await FavoriteLogService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getEmailCommsDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetEmailCommsDetails.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async forceLogout (req, res, next) {
    try {
      const { result, successful, errors } = await forceLogoutService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserProfileService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async uploadDocument (req, res, next) {
    try {
      const fileCheckResponse = validateFile(res, req.file)
      if (fileCheckResponse !== OK) return next(InvalidFileErrorType)

      const { result, successful, errors } = await UploadDocumentsService.execute({ ...req.body, document: req.file },
        req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addComment (req, res, next) {
    try {
      const { result, successful, errors } = await AddCommentService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async userActivity (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserActivityService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserKycHistory (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserKycHistory.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserKyc (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserKyc.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async fraudUserDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetfraudUserDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async referredUserDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetReferredUserDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSumsubKycStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSumsubKycStatus.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteSumsubKycStatus (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteSumsubKycProfileService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async disable2FA (req, res, next) {
    try {
      const { result, successful, errors } = await DisableUser2FAService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserBanStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserBanStatus.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addUserForSkillQuestion (req, res, next) {
    try {
      const { result, successful, errors } = await AddUserForSkillBasedQuestionService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
