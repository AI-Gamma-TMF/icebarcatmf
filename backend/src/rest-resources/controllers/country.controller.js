import { sendResponse } from '../../utils/response.helpers'

import {
  GetAllCountriesService,
  GetCountryListService,
  GetRestrictedItemsService,
  GetUnrestrictedCountriesService,
  GetRestrictedCountriesService,
  GetUnrestrictedItemsService,
  UpdateRestrictedCountryService,
  UpdateRestrictedItemsService,
  DeleteRestrictedItemsService,
  DeleteRestrictedCountriesService,
  GetCityService,
  GetStateService
} from '../../services/country'
import { StoreStateService } from '../../services/country/storeStates'
import GetAllowedStates from '../../services/country/getAllowedStates'
export default class CountryController {
  static async getAllCountry (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllCountriesService.execute()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCountryList (req, res, next) {
    try {
      const { result, successful, errors } = await GetCountryListService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateRestrictedCountry (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRestrictedCountryService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRestrictedItems (req, res, next) {
    try {
      const { result, successful, errors } = await GetRestrictedItemsService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateRestrictedItems (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateRestrictedItemsService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteRestrictedItems (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteRestrictedItemsService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUnrestrictedItems (req, res, next) {
    try {
      const { result, successful, errors } = await GetUnrestrictedItemsService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRestrictedCountries (req, res, next) {
    try {
      const { result, successful, errors } = await GetRestrictedCountriesService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUnrestrictedCountries (req, res, next) {
    try {
      const { result, successful, errors } = await GetUnrestrictedCountriesService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteRestrictedCountries (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteRestrictedCountriesService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getCity (req, res, next) {
    try {
      const { result, successful, errors } = await GetCityService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getState (req, res, next) {
    try {
      const { result, successful, errors } = await GetStateService.execute(req.query)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async storeStates (req, res, next) {
    try {
      const { result, successful, errors } = await StoreStateService.execute(req.body)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async allowStates (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllowedStates.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
