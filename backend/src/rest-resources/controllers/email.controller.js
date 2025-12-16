import { sendResponse } from '../../utils/response.helpers'
import {
  GetAllEmailTemplateService,
  GetEmailTemplateService,
  UpdateEmailTemplateService,
  GetEmailDynamicDetails,
  DeleteEmailTemplateService,
  DeleteEmailTemplateLanguageService,
  TestEmailTemplateService,
  SetSendgridCredentialsService,
  GetAllEmailTemplateCategoryService,
  CreateEmailTemplateService,
  UpdateCustomEmailTemplateService
} from '../../services/emailTemplates'

export default class EmailTemplateController {
  static async getAllEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllEmailTemplateService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllCategoryEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllEmailTemplateCategoryService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getEmailTemplateById (req, res, next) {
    try {
      const { result, successful, errors } = await GetEmailTemplateService.execute({ ...req.body, ...req.params })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateEmailTemplateService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteEmailTemplateService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteEmailTemplateLanguage (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteEmailTemplateLanguageService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async testEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await TestEmailTemplateService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getEmailDynamicData (req, res, next) {
    try {
      const { result, successful, errors } = await GetEmailDynamicDetails.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async setSendgridCredentials (req, res, next) {
    try {
      const { result, successful, errors } = await SetSendgridCredentialsService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await CreateEmailTemplateService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCustomEmailTemplate (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCustomEmailTemplateService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
