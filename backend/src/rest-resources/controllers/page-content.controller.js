import { sendResponse } from '../../utils/response.helpers'
import { AddNewPageAsset, AddNewPageService, DeletePageAsset, DeletePageService, EditPageService, GetPageDetails, GetPagesService, UpdatePageAsset, UpdatePageSEOInfo } from '../../services/pageContent'

export default class PageContentController {
  static async addNewPage (req, res, next) {
    try {
      const { result, successful, errors } = await AddNewPageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async editPage (req, res, next) {
    try {
      const { result, successful, errors } = await EditPageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePage (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPageDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetPageDetails.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPages (req, res, next) {
    try {
      const { result, successful, errors } = await GetPagesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addNewPageAsset (req, res, next) {
    try {
      const { result, successful, errors } = await AddNewPageAsset.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePageAsset (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePageAsset.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePageAsset (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePageAsset.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePageSEOInfo (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePageSEOInfo.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
