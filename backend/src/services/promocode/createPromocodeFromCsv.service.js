import moment from 'moment'
import ServiceBase from '../../libs/serviceBase'
import { parse } from 'csv-parse'
import { Op } from 'sequelize'
import { PROMOCODE_STATUS, TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'
import { CreatePromocodesService } from './createPromocode'

export class CreatePromocodesFromCSV extends ServiceBase {
  async run () {
    const { file, timezone } = this.args
    const {
      dbModels: {
        Package: PackageModel,
        Promocode: PromocodeModel
      },
      sequelizeTransaction: transaction
    } = this.context

    if (!file || !file.buffer) { return this.addError('RequestInputValidationErrorType') }

    try {
      // Parse the CSV file
      const [promocodesObjectArray, promocodes, allPackageUnfiltered, rejectedPromocodes, rejectedIndex] = await this.parseCsv(file.buffer, timezone)

      const createdPromocodes = []
      const allPackageIds = [...new Set(allPackageUnfiltered)]

      // check existing promocodes and active packages in one query
      const [isPromocodeAlreadyExist, activePackages] = await Promise.all([
        PromocodeModel.findAll({
          where: { promocode: { [Op.in]: promocodes } },
          attributes: ['promocode'],
          transaction,
          raw: true
        }),
        PackageModel.findAll({
          where: { packageId: { [Op.in]: allPackageIds }, isActive: true },
          attributes: ['packageId'],
          transaction,
          raw: true
        })])

      const existingPromocodeArray = isPromocodeAlreadyExist.map(record => record.promocode)
      const activePackageArray = activePackages.map(p => p.packageId)

      for (const promocodeObj of promocodesObjectArray) {
        // skip duplicates
        if (existingPromocodeArray.includes(promocodeObj.promocode)) {
          this.rejectedPromocodeMap(promocodeObj, 'Promocode already exists', rejectedPromocodes, rejectedIndex)
          continue
        }

        // discount logic
        if (promocodeObj.discountOnAmount && promocodeObj.discountPercentage > 99) {
          this.rejectedPromocodeMap(promocodeObj, 'Discount percentage > 99', rejectedPromocodes, rejectedIndex)
          continue
        }

        // check any inActive or Invalid Package logic
        const inActivePackage = promocodeObj.package.filter(packageId => !activePackageArray.includes(packageId))
        if (inActivePackage.length) {
          this.rejectedPromocodeMap(promocodeObj, `Invalid / Inactive package IDs: ${inActivePackage.join(',')}`, rejectedPromocodes, rejectedIndex)
          continue
        }

        // Create promo-code object
        const createPromocodeObject = {
          promocode: promocodeObj.promocode,
          status: PROMOCODE_STATUS.UPCOMING,
          discountPercentage: promocodeObj.discountPercentage,
          perUserLimit: promocodeObj.perUserLimit,
          isDiscountOnAmount: promocodeObj.discountOnAmount,
          description: promocodeObj.description,
          validFrom: promocodeObj.validFrom,
          validTill: promocodeObj.validTill,
          maxUsersAvailed: promocodeObj.maxUsersAvailed,
          packages: promocodeObj.package
        }
        const { result, successful } = await CreatePromocodesService.execute(createPromocodeObject, this.context)

        if (!successful) { this.rejectedPromocodeMap(promocodeObj, 'Failed to create promocode', rejectedPromocodes, rejectedIndex); continue }

        promocodeObj.promocodeId = result?.data?.promocodeId
        promocodeObj.status = PROMOCODE_STATUS.UPCOMING
        createdPromocodes.push(promocodeObj)
      }

      return {
        success: true,
        data: { createdPromocodes, rejectedPromocodes },
        message: `Out of ${promocodesObjectArray.length} promocodes submitted, ${createdPromocodes.length} were successfully created, ${rejectedPromocodes.length} promocodes were rejected due to being invalid or already existing.`
      }
    } catch (error) {
      const errorMessage = `Error parsing CSV file: ${error.message}`
      console.error(errorMessage)
      if (error.status === 422) {
        return {
          status: error.status,
          message: errorMessage
        }
      }
      throw new Error(`Error processing CSV: ${error.message}`)
    }
  }

  async parseCsv (fileBuffer, timezone) {
    return new Promise((resolve, reject) => {
      const promocodes = []
      const allPackageUnfiltered = []
      const promocodesObjectArray = []
      const rejectedPromocodes = []
      const rejectedIndex = new Map()
      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record
        while ((record = parser.read())) {
          try {
            // 1. Promocode (required string)
            if (!record.Promocode) throw this.validationError('Promocode is required')

            // 2. Discount on Amount (Y/N)
            const disc = record['Discount on Amount (Y/N)']
            if (!['Y', 'N'].includes(disc)) throw this.validationError('Discount on Amount must be "Y" or "N"')

            // 3. Bonus Coins Percentage: integer > 0 and < 99
            const discountPercentage = +record['Bonus Coins Percentage / Discount Percentage']
            if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage >= 99) {
              throw this.validationError('Bonus Coins Percentage must be an integer > 0 and < 99')
            }

            // 4. Max Users Availed: integer >= 0
            const maxUsers = +record['Max Users Availed']
            if (isNaN(maxUsers) || maxUsers < 0) {
              throw this.validationError('Max Users Availed must be a non-negative integer')
            }

            // 5. Per Promocode User Limit: integer >= 0
            const perLimit = +record['Per Promocode User Limit']
            if (isNaN(perLimit) || perLimit < 0) {
              throw this.validationError('Per Promocode User Limit must be a non-negative integer')
            }

            // 6. Promo Code Description: non-empty string
            if (!record['Promo Code Description']) {
              throw this.validationError('Promo Code Description is required')
            }

            // Date fields ValidFrom, ValidTill

            const validFrom = moment.tz(record['Valid From'], 'MM/DD/YYYY hh:mm A', true, TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone])
            const validTill = moment.tz(record['Valid Until'], 'MM/DD/YYYY hh:mm A', true, TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone])
            const now = moment()

            if (!validFrom.isValid()) throw this.validationError('Valid From must be in format MM/DD/YYYY hh:mm AM/PM')
            if (!validTill.isValid()) throw this.validationError('Valid Until must be in format MM/DD/YYYY hh:mm AM/PM')

            // 9. Package ID's: comma-separated integers
            const packageIdArray = []
            for (const raw of record["Package ID's"].split(',')) {
              const trimmed = raw.trim()
              const value = trimmed === '' ? 0 : Number(trimmed)
              if (!Number.isInteger(value)) {
                throw this.validationError('Each Package ID must be an integer')
              }
              if (value !== 0) { packageIdArray.push(value) }
            }
            // If all validations pass, push normalized object
            const promocodeObject = {
              promocode: record.Promocode,
              discountOnAmount: disc === 'Y',
              discountPercentage: discountPercentage,
              maxUsersAvailed: maxUsers,
              perUserLimit: perLimit,
              description: record['Promo Code Description'],
              validFrom: validFrom,
              validTill: validTill,
              package: packageIdArray
            }
            promocodesObjectArray.push(promocodeObject)
            if (!validFrom.isAfter(now)) this.rejectedPromocodeMap(promocodeObject, 'Valid From must be a future date/time', rejectedPromocodes, rejectedIndex)
            if (!validTill.isAfter(now)) this.rejectedPromocodeMap(promocodeObject, 'Valid Until must be a future date/time', rejectedPromocodes, rejectedIndex)
            if (!validTill.isAfter(now)) this.rejectedPromocodeMap(promocodeObject, 'Valid Until must be after Valid From', rejectedPromocodes, rejectedIndex)
            promocodes.push(record.Promocode)
            allPackageUnfiltered.push(...packageIdArray)
          } catch (err) {
            // Stop parsing and reject with validation error
            err.status = 422
            parser.destroy(err)
            return
          }
        }
      })

      parser.on('end', () => resolve([promocodesObjectArray, promocodes, allPackageUnfiltered, rejectedPromocodes, rejectedIndex]))
      parser.on('error', (err) => reject(err))

      parser.write(fileBuffer)
      parser.end()
    })
  }

  rejectedPromocodeMap (promocodeObj, reason, rejectedPromocodes, rejectedIndex) {
    const key = promocodeObj.promocode
    if (rejectedIndex.has(key)) {
      // O(1) lookup
      const existing = rejectedIndex.get(key)
      existing.reason += ' & ' + reason
    } else {
      const entry = { ...promocodeObj, reason }
      rejectedPromocodes.push(entry)
      rejectedIndex.set(key, entry)
    }
  }

  validationError (message) {
    const e = new Error(`Invalid CSV file: ${message}`)
    return e
  }
}
