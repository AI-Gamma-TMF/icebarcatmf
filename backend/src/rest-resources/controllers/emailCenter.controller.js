import { OK } from '../../utils/constants/constant.js'
import { isValidCsvFile } from '../../utils/common.js'
import { sendResponse } from '../../utils/response.helpers'
import { InvalidFileErrorType } from '../../utils/constants/errors.js'
import { CreateEmailCenterTemplateService, DeleteEmailCenterTemplateService, GetEmailCenterUserDetailsService, GetAllEmailCenterTemplateService, ProcessUserEmailFromCsvService, SendUserEmailService, UpdateEmailCenterTemplateService, GetDynamicValueEmailCenterService, GetFreeSpinTemplates } from '../../services/emailCenter'

export default class EmailCenterController {
  static async getAllEmailCenterTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllEmailCenterTemplateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await CreateEmailCenterTemplateService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateEmailCenterTemplateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteEmailCenterTemplateService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async sendUserEmail (req, res, next) {
    try {
      const { result, successful, errors } = await SendUserEmailService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserDetailsEmail (req, res, next) {
    try {
      const { result, successful, errors } = await GetEmailCenterUserDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserFromCsv (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = isValidCsvFile(req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await ProcessUserEmailFromCsvService.execute({ ...req.body, ...req.query, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getDynamicValueEmail (req, res, next) {
    try {
      const { result, successful, errors } = await GetDynamicValueEmailCenterService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getFreeSpinTemplates (req, res, next) {
    try {
      const { result, successful, errors } = await GetFreeSpinTemplates.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
