import { CreateBlogPostFaqService, CreateBlogPostService, DeleteBlogPostFaqService, DeleteBlogPostService, GetBlogPostFaqService, GetBlogPostService, UpdateBlogPostService, UpdateBlogPostStatusService } from '../../services/blogPost'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { sendResponse } from '../../utils/response.helpers'

export default class BlogPostController {
  static async createBlogPost (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await CreateBlogPostService.execute({ ...req.body, bannerImageUrl: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBlogPost (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await UpdateBlogPostService.execute({ ...req.body, bannerImageUrl: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBlogPost (req, res, next) {
    try {
      const { result, successful, errors } = await GetBlogPostService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateBlogPostStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateBlogPostStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBlogPost (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBlogPostService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createBlogPostFaq (req, res, next) {
    try {
      const { result, successful, errors } = await CreateBlogPostFaqService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBlogPostFaq (req, res, next) {
    try {
      const { result, successful, errors } = await GetBlogPostFaqService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBlogPostFaq (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBlogPostFaqService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
