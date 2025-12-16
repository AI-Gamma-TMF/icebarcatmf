import { sendResponse } from '../../utils/response.helpers'
import { CreateDynamoPopup } from '../../services/dynamo/CreateDynamoPopup.service'
import { GetDynamoPopups } from '../../services/dynamo/GetDynamoPopUp.service'
import { DeleteDynamoPopup } from '../../services/dynamo/DeleteDynamoPopup.service'
import { UpdateDynamoPopup } from '../../services/dynamo/UpdateDynamoPopup.service'
import { PatchDynamoPopup } from '../../services/dynamo/PatchDynamoPopup.service'

export default class DynamoController {
  static async createDynamoPopup (req, res, next) {
    try {
      const { result, successful, errors } = await CreateDynamoPopup.execute({ ...req.body, ...req.query, bonusImage: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getDynamoPopup (req, res, next) {
    try {
      const { result, successful, errors } = await GetDynamoPopups.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async UpdateDynamoPopup (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateDynamoPopup.execute({ ...req.body, ...req.query, bonusImage: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async PatchDynamoPopup (req, res, next) {
    try {
      const { result, successful, errors } = await PatchDynamoPopup.execute({ ...req.body, ...req.query, bonusImage: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteDynamoPopup (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteDynamoPopup.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}