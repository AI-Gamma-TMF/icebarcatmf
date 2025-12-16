import {
  sendResponse,
  sendAccessTokenResponse
} from '../../utils/response.helpers'

import {
  GetAllAffiliatesService,
  CreateAffiliateService,
  UpdateAffiliatesService,
  DeleteAffiliateService,
  GetAffiliateDetailsService,
  LoginAffiliateService,
  GetAffiliatedUsersService,
  UpdateProfileAffiliatedUsersService,
  UploadProfileImageService,
  LogoutAffiliateService,
  StatusApprovedAffiliatesService,
  SetPasswordService,
  ForgetPasswordService,
  VerifyForgetPasswordService,
  ChangePasswordService,
  GetAffiliatesService,
  AffiliateDetailWebhookService
} from '../../services/affiliates'
import { ScaleoPlayerActivityService, ScaleoTransactionalActivityService } from '../../services/affiliates'

export default class AffiliatesController {
  static async createAffiliate (req, res, next) {
    try {
      const { result, successful, errors } =
        await CreateAffiliateService.execute(req.body, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getAllAffiliates (req, res, next) {
    try {
      const { result, successful, errors } =
        await GetAllAffiliatesService.execute(
          { ...req.body, ...req.query },
          req.context
        )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async updateAffiliate (req, res, next) {
    try {
      const { result, successful, errors } =
        await UpdateAffiliatesService.execute(
          { ...req.body, ...req.query },
          req.context
        )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async deleteAffiliate (req, res, next) {
    try {
      const { result, successful, errors } =
        await DeleteAffiliateService.execute(req.params, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getAffiliateDetails (req, res, next) {
    try {
      const { result, successful, errors } =
        await GetAffiliateDetailsService.execute(req.query, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async loginAffiliate (req, res, next) {
    try {
      const { result, successful, errors } =
        await LoginAffiliateService.execute(req.body, req.context)
      sendAccessTokenResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getAllAffiliateUsers (req, res, next) {
    try {
      const { result, successful, errors } =
        await GetAffiliatedUsersService.execute( { ...req.body, ...req.query }, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile (req, res, next) {
    try {
      const { result, successful, errors } =
        await UpdateProfileAffiliatedUsersService.execute(
          { ...req.body },
          req.context
        )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async uploadAffiliateProfileImage (req, res, next) {
    try {
      const { result, successful, errors } =
        await UploadProfileImageService.execute(
          { ...req.body, document: req.file },
          req.context
        )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async logoutAffiliate (req, res, next) {
    try {
      res.clearCookie('affiliateAccessToken')
      const { result, successful, errors } =
        await LogoutAffiliateService.execute(req.body, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async statusApprovedAffiliates (req, res, next) {
    try {
      const { result, successful, errors } =
        await StatusApprovedAffiliatesService.execute(
          { ...req.body, ...req.query },
          req.context
        )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async setPassword (req, res, next) {
    try {
      const { result, successful, errors } = await SetPasswordService.execute(
        { ...req.body, ...req.query },
        req.context
      )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async changePassword (req, res, next) {
    try {
      const { result, successful, errors } =
        await ChangePasswordService.execute(req.body, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async forgetPassword (req, res, next) {
    try {
      const { result, successful, errors } =
        await ForgetPasswordService.execute(req.body, req.context)
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async verifyForgetPassword (req, res, next) {
    try {
      const { result, successful, errors } =
        await VerifyForgetPasswordService.execute(
          { ...req.query, ...req.body },
          req.context
        )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async getAffiliates (req, res, next) {
    try {
      const { result, successful, errors } = await GetAffiliatesService.execute(
        { ...req.body, ...req.query },
        req.context
      )
      sendResponse(
        { req, res, next },
        { result, successful, serviceErrors: errors }
      )
    } catch (error) {
      next(error)
    }
  }

  static async detailWebhook (req, res, next) {
    try {
      const { result, successful, errors } = await AffiliateDetailWebhookService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async detailWebhookV2 (req, res, next) {
    try {
      const { result, successful, errors } = await ScaleoPlayerActivityService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async scaleoTransactionActivity (req, res, next) {
    try {
      const { result, successful, errors } = await ScaleoTransactionalActivityService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
