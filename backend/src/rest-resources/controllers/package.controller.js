import { generateCsvFilename, validateFile } from '../../utils/common'
import { CSV_FILE_STATIC_NAMES, OK } from '../../utils/constants/constant'
import { sendResponse } from '../../utils/response.helpers'
import { InvalidFileErrorType } from '../../utils/constants/errors'
import { OrderPackageService, DeletePackageService, UpdatePackageStatusService, CreatePackageService, GetPackageDetailService, UpdatePackageService, GetPlayerIdsPerFilterService, GetPackageUserDetailsService, CreateFtpBonusService, UpdateFtpBonusService, UpdateFtpBonusStatusService, DeleteFtpBonusService, RestorePackageService, CreateTemplatePackageService, CreateLadderPackageService, GetUserDetailsService, GetRestorePackageUserDetailsService, CreateConfigPackageService, GetSubPackagesService, GetPlayerIdsPerImportCsvService, GetAllPackagesImagesService, GetAllPackagesService } from '../../services/package'
import { ReorderingFtpBonusService } from '../../services/package/progressiveFirstPurchase/reorderingFtpBonus.service'

export default class PackageController {
  static async getPackageDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetPackageDetailService.execute({ ...req.body, ...req.query }, req.context)
      if (result && result.stream) {
        // Generate dynamic filename based on filters
        const filename = `packageId-${result.packageId}_data.csv`
        // Streaming logic
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`) // Set filename for download
        // Pipe the stream to the response
        result.stream.pipe(res)
        // Handle stream errors
        result.stream.on('error', (error) => {
          console.error('Error streaming data:', error)
          res.status(500).end()
        })
        // Handle stream end
        result.stream.on('end', () => {
          console.log('Stream completed successfully.')
        })
        result.stream.on('finish', () => {
          console.log('Stream finished successfully.')
        })
        return
      }
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllPackagesList (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllPackagesService.execute({ ...req.body, ...req.query }, req.context)
      if (result && result.stream) {
        // Generate dynamic filename based on filters
        const filename = `packageId-${result.packageId}_data.csv`
        // Streaming logic
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`) // Set filename for download
        // Pipe the stream to the response
        result.stream.pipe(res)
        // Handle stream errors
        result.stream.on('error', (error) => {
          console.error('Error streaming data:', error)
          res.status(500).end()
        })
        // Handle stream end
        result.stream.on('end', () => {
          console.log('Stream completed successfully.')
        })
        result.stream.on('finish', () => {
          console.log('Stream finished successfully.')
        })
        return
      }
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async create (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await CreatePackageService.execute({ ...req.body, image: req?.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async update (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await UpdatePackageService.execute({ ...req.body, image: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async order (req, res, next) {
    try {
      const { result, successful, errors } = await OrderPackageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updatePackageStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdatePackageStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deletePackage (req, res, next) {
    try {
      const { result, successful, errors } = await DeletePackageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPlayerIdsPerFilter (req, res, next) {
    try {
      const { result, successful, errors } = await GetPlayerIdsPerFilterService.execute({ ...req.body, ...req.query }, req.context)

      if (result && result.stream) {
        const filters = req.query
        const staticCsvName = CSV_FILE_STATIC_NAMES.PLAYERS_DATA
        // Generate dynamic filename based on filters
        const filename = generateCsvFilename(filters, staticCsvName)

        // Streaming logic
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`) // Set filename for download

        // Pipe the stream to the response
        result.stream.pipe(res)

        // Handle stream errors
        result.stream.on('error', (error) => {
          console.error('Error streaming data:', error)
          res.status(500).end()
        })

        // Handle stream end
        result.stream.on('end', () => {
          console.log('Stream completed successfully.')
        })
        result.stream.on('finish', () => {
          console.log('Stream finished successfully.')
        })
      }
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPackageUserDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetPackageUserDetailsService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  // progressive first-purchase
  static async createFtpBonus (req, res, next) {
    try {
      const { result, successful, errors } = await CreateFtpBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateFtpBonus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateFtpBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async updateFtpBonusStatus (req, res, next) {
    try {
      const { result, successful, errors } = await UpdateFtpBonusStatusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async deleteFtpBonus (req, res, next) {
    try {
      const { result, successful, errors } = await DeleteFtpBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async orderFtpBonus (req, res, next) {
    try {
      const { result, successful, errors } = await ReorderingFtpBonusService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async restorePackage (req, res, next) {
    try {
      const { result, successful, errors } = await RestorePackageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createTemplatePackage (req, res, next) {
    try {
      const { result, successful, errors } = await CreateTemplatePackageService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createLadderPackages (req, res, next) {
    try {
      if (req && typeof req.file !== 'undefined') {
        const fileCheckResponse = validateFile(res, req.file)
        if (fileCheckResponse !== OK) {
          return next(InvalidFileErrorType)
        }
      }
      const { result, successful, errors } = await CreateLadderPackageService.execute({ ...req.body, ...req.query, image: req?.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getExternalUsers (req, res, next) {
    try {
      const { result, successful, errors } = await GetUserDetailsService.execute({ ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRestoreUserPackage (req, res, next) {
    try {
      const { result, successful, errors } = await GetRestorePackageUserDetailsService.execute({ ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async createConfig (req, res, next) {
    try {
      const { result, successful, errors } = await CreateConfigPackageService.execute({ ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getSubPackages (req, res, next) {
    try {
      const { result, successful, errors } = await GetSubPackagesService.execute({ ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getPlayerIdsPerImportCsv (req, res, next) {
    try {
      const { result, successful, errors } = await GetPlayerIdsPerImportCsvService.execute({ ...req.body, file: req.file }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getAllPackagesImages (req, res, next) {
    try {
      const { result, successful, errors } = await GetAllPackagesImagesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
