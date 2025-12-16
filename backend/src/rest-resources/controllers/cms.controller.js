import { sendResponse } from '../../utils/response.helpers'
import {
  GetAllCmsPageService,
  GetCmsPageService,
  CreateCmsPageService,
  UpdateCmsPageService,
  GetCmsDynamicKeys,
  DeleteCmsLanguageService,
  DeleteCmsService
} from '../../services/cms'
export default class CmsController {
  static async createCmsPage (req, res, next) {
    try {
      const { result, successful, errors } = await CreateCmsPageService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCmsPage (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCmsPageService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllCmsPage (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllCmsPageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCmsPage (req, res, next) {
    try {
      const { result, successful, errors } = await GetCmsPageService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCmsDynamicData (req, res, next) {
    try {
      const { result, successful, errors } = await GetCmsDynamicKeys.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCmsPageLanguage (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCmsLanguageService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCmsPage (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCmsService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
