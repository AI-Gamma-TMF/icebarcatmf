import { sendResponse } from '../../utils/response.helpers'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import {
  UploadBannerService,
  UpdateBannerPageService,
  GetBannerService,
  GetBannerKeys,
  DeleteBannerPageService,
  OrderBannerService
} from '../../services/banner'

export default class BannerController {
  static async uploadBanner (req, res, next) {
    try {
      if (req.files?.desktopBannerImage && req.files?.desktopBannerImage[0] && typeof req.files?.desktopBannerImage[0] === 'object') {
        const desktopBannerFileCheckResponse = validateFile(res, req.files?.desktopBannerImage[0])
        if (desktopBannerFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      if (req.files?.mobileBannerImage && req.files?.mobileBannerImage[0] && typeof req.files?.mobileBannerImage[0] === 'object') {
        const mobileBannerImageCheckResponse = validateFile(res, req.files?.mobileBannerImage[0])
        if (mobileBannerImageCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      const { result, successful, errors } = await UploadBannerService.execute({ ...req.body }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBanner (req, res, next) {
    try {
      if (req.files?.desktopBannerImage && req.files?.desktopBannerImage[0] && typeof req.files?.desktopBannerImage[0] === 'object') {
        const desktopBannerFileCheckResponse = validateFile(res, req.files?.desktopBannerImage[0])
        if (desktopBannerFileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      if (req.files?.mobileBannerImage && req.files?.mobileBannerImage[0] && typeof req.files?.mobileBannerImage[0] === 'object') {
        const mobileBannerImageCheckResponse = validateFile(res, req.files?.mobileBannerImage[0])
        if (mobileBannerImageCheckResponse !== OK) return next(InvalidFileErrorType)
      }

      const { result, successful, errors } = await UpdateBannerPageService.execute({ ...req.body }, req.context)

      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBanner (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBannerPageService.execute(
        { ...req.body, image: req.file },
        req.context
      )
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllBanner (req, res, next) {
    try {
      const { result, successful, errors } = await GetBannerService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBannerKeys (req, res, next) {
    try {
      const { result, successful, errors } = await GetBannerKeys.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderBanner (req, res, next) {
    try {
      const { result, successful, errors } = await OrderBannerService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
