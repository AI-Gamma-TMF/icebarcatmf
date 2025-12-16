import { sendResponse } from '../../utils/response.helpers'
import { EditBonus, GetBonus, CreateProgressiveBonus, CreateBonus, DeleteBonus, GetSpinWheelListService, UpdateSpinWheelService, ProgressiveReferralBonusService, CreateStreakDailyBonusService, GetScratchCardListService, UpdateScratchCardService, GetScratchCardDropDownService, CreateScratchCardService, DeleteScratchCardService, CreateTemplateScratchCardService, ScratchCardBonusGraphReportService, ScratchCardBonusDetailsReportService, GetAllScratchCardImagesService, CreateScratchCardBudgetsService, ResetScratchCardBudgetsService, UploadScratchCardImageUrlService, GetAttachedGrantDropDownService } from '../../services/bonus'
import { BONUS_TYPE, OK } from '../../utils/constants/constant'
import { validateFile } from '../../utils/common'
import { InvalidFileErrorType } from '../../utils/constants/errors'

const actions = {
  CREATE: 'create',
  EDIT: 'edit',
  GET: 'get',
  REMOVE: 'remove'
}

export default class BonusController {
  static getServicesByBonusType (action, req) {
    let services
    switch (req.body.bonusType) {
      case BONUS_TYPE.DAILY_BONUS: {
        services = {
          [actions.CREATE]: CreateProgressiveBonus
        }
        break
      }
      case BONUS_TYPE.MONTHLY_BONUS: {
        services = {
          [actions.CREATE]: CreateProgressiveBonus
        }
        break
      }
      default: {
        services = {
          [actions.CREATE]: CreateBonus,
          [actions.EDIT]: EditBonus,
          [actions.GET]: GetBonus,
          [actions.REMOVE]: DeleteBonus
        }
      }
    }

    return services[action]
  }

  static async createBonus (req, res, next) {
    try {
      const service = BonusController.getServicesByBonusType(actions.CREATE, req)
      const { result, successful, errors } = await service.execute({ ...req.body, image: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async editBonus (req, res, next) {
    try {
      const { result, successful, errors } = await EditBonus.execute({ ...req.body, ...req.query, bonusImage: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getBonus (req, res, next) {
    try {
      const { result, successful, errors } = await GetBonus.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteBonus (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteBonus.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // spin-wheel
  static async getSpinWheelList (req, res, next) {
    try {
      const { result, successful, errors } = await GetSpinWheelListService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateSpinWheel (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateSpinWheelService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createProgressiveReferralBonus (req, res, next) {
    try {
      const { result, successful, errors } = await ProgressiveReferralBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createStreakDailyBonus (req, res, next) {
    try {
      if (req.file) {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await CreateStreakDailyBonusService.execute({ ...req.body, ...req.query, dailyBonusImg: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getScratchCardList (req, res, next) {
    try {
      const { result, successful, errors } = await GetScratchCardListService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createScratchCard (req, res, next) {
    try {
      const { result, successful, errors } = await CreateScratchCardService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateScratchCard (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await UpdateScratchCardService.execute({ ...req.body, image: req?.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getScratchCardDropDown (req, res, next) {
    try {
      const { result, successful, errors } = await GetScratchCardDropDownService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteScratchCard (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteScratchCardService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createTemplateScratchCard (req, res, next) {
    try {
      const { result, successful, errors } = await CreateTemplateScratchCardService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async scratchCardBonusGraph (req, res, next) {
    try {
      const { result, successful, errors } = await ScratchCardBonusGraphReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async scratchCardBonusDetails (req, res, next) {
    try {
      const { result, successful, errors } = await ScratchCardBonusDetailsReportService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllScratchCardImages (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllScratchCardImagesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createScratchCardBudgets (req, res, next) {
    try {
      const { result, successful, errors } = await CreateScratchCardBudgetsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async resetScratchCardBudgets (req, res, next) {
    try {
      const { result, successful, errors } = await ResetScratchCardBudgetsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  } // uploadScratchCardImages

  static async uploadScratchCardImages (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await UploadScratchCardImageUrlService.execute({ ...req.body, image: req?.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAttachedGrantDropDown (req, res, next) {
    try {
      const { result, successful, errors } = await GetAttachedGrantDropDownService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
