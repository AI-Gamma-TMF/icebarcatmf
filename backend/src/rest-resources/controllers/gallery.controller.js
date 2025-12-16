
import { sendResponse } from '../../utils/response.helpers'
import { GetImageList, UploadImage, DeleteImage } from '../../services/gallery'

export default class ImageGalleryController {
  static async getList (req, res, next) {
    try {
      const { result, successful, errors } = await GetImageList.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async uploadImage (req, res, next) {
    try {
      const { result, successful, errors } = await UploadImage.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteImage (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteImage.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
