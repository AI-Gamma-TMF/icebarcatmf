import { sendResponse } from '../../utils/response.helpers'
import {
  CreateTournamentService, GetAllTournamentService, UpdateTournamentService, GetTournamentDetailsService, UpdateTournamentStatusService, UpdateUserTournamentPlayerStatusService, CreateFreeEntryInTournamentService, /*, GetGamesTournamentService */
  GetGamesTournamentService,
  CreateTournamentPayoutService,
  TournamentOrderUpdateService,
  GetEligibleTournamentWinnerService,
  GetTournamentDashboardService,
  GetTournamentStatsDashboardService,
  AddVipTournamentUsersFromCSV,
  GetTournamentDashboardWinnerBootedSummary,
  GetTournamentStatsTotalScoreAndCount,
  GetTournamentStatsFilterDashboardService,
  RetrieveTournamentDetailsService
} from '../../services/tournament'
import { validateCsvFile, validateFile } from '../../utils/common'
import { OK } from '../../utils/constants/constant'
import { InvalidFileErrorType } from '../../utils/constants/errors'

export default class TournamentController {
  static async createTournament (req, res, next) {
    try {
      // validating the tournament image file
      if (req.file) {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await CreateTournamentService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllTournament (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllTournamentService.execute(req.query, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateTournament (req, res, next) {
    try {
      // validating the tournament image file
      if (req.file) {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await UpdateTournamentService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateTournamentStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateTournamentStatusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentDetailsService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
  // Tournament Details without LeaderBoard

  static async fetchTournamentDetail (req, res, next) {
    try {
      const { result, successful, errors } = await RetrieveTournamentDetailsService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getGames (req, res, next) {
    try {
      const { result, successful, errors } = await GetGamesTournamentService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateUserTournamentPlayerStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateUserTournamentPlayerStatusService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createFreeEntryInTournament (req, res, next) {
    try {
      const { result, successful, errors } = await CreateFreeEntryInTournamentService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async tournamentOrderUpdate (req, res, next) {
    try {
      const { result, successful, errors } = await TournamentOrderUpdateService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getEligibleTournamentWinners (req, res, next) {
    try {
      const { result, successful, errors } = await GetEligibleTournamentWinnerService.execute({ ...req.params, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createTournamentPayout (req, res, next) {
    try {
      const { result, successful, errors } = await CreateTournamentPayoutService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentDashboard (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentDashboardService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentStatsDashboard (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentStatsDashboardService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentStatsFilterDashboard (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentStatsFilterDashboardService.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentStatsWinnerBootedSummary (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentDashboardWinnerBootedSummary.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getTournamentStatsTotalScoreAndCount (req, res, next) {
    try {
      const { result, successful, errors } = await GetTournamentStatsTotalScoreAndCount.execute({ ...req.params, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async addVipTournamentUsersFromCsv (req, res, next) {
    try {
      if (req.file) {
        const fileCheckResponse = validateCsvFile(req.file)
        if (!fileCheckResponse) return next(InvalidFileErrorType)
      }
      const { result, successful, errors } = await AddVipTournamentUsersFromCSV.execute({ ...req.body, ...req.params, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
