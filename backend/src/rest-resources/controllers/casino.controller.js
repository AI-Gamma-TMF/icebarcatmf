import { sendResponse } from '../../utils/response.helpers'
import { GetAggregatorService, HideCasinoAggregatorService, UpdateAggregatorStatusService } from '../../services/casinoAggregator'
import { GetSubCategoryList, CreateSubCategory, UpdateSubCategory, DeleteSubCategory, OrderSubCategory } from '../../services/subCategory'
import { CreateCasinoProvider, UpdateCasinoProviderService, GetMasterCasinoProvidersService, DeleteCasinoProviderService, HideCasinoProviderService } from '../../services/casinoProvider'
import { CreateGameService, UpdateCasinoGameService, GetCasinoGamesService, GetAllCasinoGamesService, OrderCategoryGamesService, DeleteCategoryGameService, AddCasinoGameService, OrderProviderService, HideCasinoGameService } from '../../services/casinoGame'
import { validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'

export default class CasinoController {
  static async createCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await CreateCasinoProvider.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCasinoProviderService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCasinoProviderService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllProviders (req, res, next) {
    try {
      const { result, successful, errors } = await GetMasterCasinoProvidersService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await GetSubCategoryList.execute({ ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await CreateSubCategory.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSubCategory.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteSubCategory.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderSubCategory (req, res, next) {
    try {
      const { result, successful, errors } = await OrderSubCategory.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await CreateGameService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await GetCasinoGamesService.execute({ ...req.body, ...req.query })
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllCasinoGamesService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateCasinoGameService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateOrderGame (req, res, next) {
    try {
      const { result, successful, errors } = await OrderCategoryGamesService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteCategoryGameService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAggregators (req, res, next) {
    try {
      const { result, successful, errors } = await GetAggregatorService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateAggregator (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateAggregatorStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addCasinoGame (req, res, next) {
    try {
      if (req.file) {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await AddCasinoGameService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async providerOrder (req, res, next) {
    try {
      const { result, successful, errors } = await OrderProviderService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async hideCasinoAggregator (req, res, next) {
    try {
      const { result, successful, errors } = await HideCasinoAggregatorService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async hideCasinoProvider (req, res, next) {
    try {
      const { result, successful, errors } = await HideCasinoProviderService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async hideCasinoGame (req, res, next) {
    try {
      const { result, successful, errors } = await HideCasinoGameService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
