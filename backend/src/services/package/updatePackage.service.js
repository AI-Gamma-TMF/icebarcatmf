import { Op, Sequelize } from 'sequelize'
import { round } from 'number-precision'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'
import { isDateValid, isValidAmount, statusUpdateJobScheduler, triggerPackageActivationNotification, uploadFile } from '../../utils/common'
import { CreateConfigPackageService } from './createConfigPackage.service'
import redisClient from '../../libs/redisClient'
export class UpdatePackageService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const { id } = this.context.req.body

    const {
      image, amount, gcCoin, scCoin, isActive, packageId, validTill, isVisibleInStore, purchaseLimitPerUser, firstPurchaseApplicable, welcomePurchaseBonusApplicable, welcomePurchaseBonusApplicableMinutes,
      welcomePurchasePercentage, validFrom, bonusSc, bonusGc, playerIds, filterType, filterOperator, filterValue, isSpecialPackage, packageName, purchaseNo, intervalsConfig, imageUrl, overwriteSpecialPackage,
      scratchCardId, freeSpinId, isSubscriberOnly, packageTag
    } = this.args

    let successMessage = SUCCESS_MSG.UPDATE_SUCCESS
    try {
      const s3Config = config.getProperties().s3
      if (amount && isValidAmount(amount)) return this.addError('AmountInvalidErrorType')
      // if (welcomePurchaseBonusApplicable === 'true' && firstPurchaseApplicable === 'true') return this.addError('FirstAndWelcomePurchaseBonusNotApplicableErrorType')
      if (scCoin && isValidAmount(scCoin)) return this.addError('InvalidCoinAmountErrorType')
      if (gcCoin && isValidAmount(gcCoin)) return this.addError('InvalidCoinAmountErrorType')

      const checkPackageExist = await PackageModel.findOne({
        where: { packageId },
        raw: true,
        transaction
      })

      if (!checkPackageExist) return this.addError('PackageNotFoundErrorType')

      // Cannot Deactivate/ Activate a Scheduled Packages
      if (isActive !== undefined && checkPackageExist?.validFrom && checkPackageExist?.validTill) return this.addError('PackageIsAlreadyScheduledErrorType')

      // Special Package Check for Valid From and Valid Till
      if (isSpecialPackage === 'true' && !(validFrom || checkPackageExist?.validFrom) && !(validTill || checkPackageExist?.validTill)) { return this.addError('SpecialPackageValidFromValidTillRequiredErrorType') }

      const updatedArray = {
        amount: amount ? +round(+amount, 2) : undefined,
        gcCoin: gcCoin ? +round(+gcCoin, 2) : undefined,
        scCoin: scCoin ? +round(+scCoin, 2) : undefined,
        isActive,
        isVisibleInStore,
        purchaseLimitPerUser: purchaseLimitPerUser ? +purchaseLimitPerUser : undefined,
        bonusSc: bonusSc || undefined,
        bonusGc: bonusGc || undefined,
        isSubscriberOnly,
        packageTag
      }

      // Current Date
      const currentDate = new Date()

      let packageValidFrom, packageValidTill
      // checking the dates
      if (validFrom && validTill) {
        const updatedvalidFrom = new Date(validFrom)
        const updatedvalidTill = new Date(validTill)
        if (
          isDateValid(updatedvalidFrom) &&
          isDateValid(updatedvalidTill) &&
          updatedvalidFrom >= currentDate &&
          updatedvalidTill >= currentDate &&
          updatedvalidFrom <= updatedvalidTill
        ) {
          updatedArray.validFrom = updatedvalidFrom
          updatedArray.validTill = updatedvalidTill
          updatedArray.isActive = false
          packageValidFrom = updatedvalidFrom
          packageValidTill = updatedvalidTill
        } else {
          this.addError('InvalidDateErrorType')
        }
      } else if (validFrom) {
        const updatedvalidFrom = new Date(validFrom)
        if (
          !isDateValid(updatedvalidFrom) ||
          updatedvalidFrom < currentDate ||
          updatedvalidFrom > checkPackageExist?.validTill
        ) {
          this.addError('InvalidDateErrorType')
        } else if (checkPackageExist.isActive) {
          this.addError('PromocodeIsAlreadyActiveErrorType')
        } else {
          packageValidFrom = updatedvalidFrom
          updatedArray.validFrom = updatedvalidFrom
        }
      } else if (validTill) {
        const updatedvalidTill = new Date(validTill)
        if (
          !isDateValid(updatedvalidTill) ||
          updatedvalidTill < currentDate ||
          checkPackageExist?.validFrom > updatedvalidTill
        ) {
          this.addError('InvalidDateErrorType')
        } else {
          packageValidTill = updatedvalidTill
          updatedArray.validTill = updatedvalidTill
        }
      } else {
        packageValidFrom = checkPackageExist?.validFrom
        packageValidTill = checkPackageExist?.validTill
      }

      // Updating Package Name
      if (packageName) {
        const isPackageNameExist = await PackageModel.findOne({
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('package_name')),
                packageName.trim().toLowerCase()
              )
            ],
            packageId: { [Op.notIn]: [checkPackageExist.packageId] }
          }
        })
        if (isPackageNameExist) {
          return this.addError('PackageWithSameNameAlreadyExistErrorType')
        }
        updatedArray.packageName = packageName
      }

      // Checking the conditions of Special Packages
      let specialPackage = isSpecialPackage
      if (isSpecialPackage === 'true' || checkPackageExist?.isSpecialPackage) {
        if (welcomePurchaseBonusApplicable === 'true' || checkPackageExist?.welcomePurchaseBonusApplicable === 'true') specialPackage = false
        if (+purchaseNo === 0 || checkPackageExist?.purchaseNo === 0) {
          const specialPackage = await PackageModel.findOne({
            exclude: { attributes: ['createdAt', 'updatedAt'] },
            where: {
              isSpecialPackage: true,
              firstPurchaseApplicable: false,
              welcomePurchaseBonusApplicable: false,
              purchaseNo: 0,
              // isActive: true,
              [Op.and]: [
                { validFrom: { [Op.lte]: packageValidTill || checkPackageExist?.validFrom } },
                { validTill: { [Op.gte]: packageValidFrom || checkPackageExist?.validTill } }
              ]
            },
            transaction,
            raw: true
          })

          if (specialPackage && specialPackage?.packageId !== checkPackageExist?.packageId && !overwriteSpecialPackage) {
            // send the actual URL by prefix the env value
            specialPackage.imageUrl = specialPackage.imageUrl !== null ? `${s3Config.S3_DOMAIN_KEY_PREFIX}${specialPackage.imageUrl}` : specialPackage.imageUrl
            return { success: false, data: specialPackage, message: 'A special package with below details is already scheduled for this time. Overwriting it will convert it to a basic package with existing scheduled details. Do you want to proceed ?' }
          } else if (specialPackage && specialPackage?.packageId !== checkPackageExist?.packageId && overwriteSpecialPackage) {
            await PackageModel.update({ isSpecialPackage: false }, { where: { packageId: specialPackage.packageId }, transaction })
            successMessage = `A package with Package Id: ${specialPackage.packageId} was converted to a basic package.`
          }
        }
      }
      // Updating the special package status after checks
      updatedArray.isSpecialPackage = specialPackage

      if (welcomePurchaseBonusApplicable !== undefined && welcomePurchaseBonusApplicable === 'false') {
        const moreData = {
          filterType,
          filterOperator,
          filterValue: +filterValue
        }
        updatedArray.moreDetails = { ...checkPackageExist?.moreDetails, ...moreData }
        updatedArray.welcomePurchaseBonusApplicable = false
      }

      if (playerIds !== undefined) updatedArray.playerId = playerIds
      if (welcomePurchaseBonusApplicableMinutes !== undefined) updatedArray.welcomePurchaseBonusApplicableMinutes = welcomePurchaseBonusApplicableMinutes

      if (welcomePurchasePercentage) updatedArray.welcomePurchasePercentage = welcomePurchasePercentage

      if (purchaseNo !== undefined && +purchaseNo === 0) {
        updatedArray.purchaseNo = +purchaseNo
      } else if (purchaseNo && +purchaseNo > 0) {
        const isPurchaseNoExist = await PackageModel.findOne({
          attributes: ['packageId'],
          where: {
            [Op.and]: [
              { purchaseNo: +purchaseNo },
              { packageId: { [Op.notIn]: [checkPackageExist.packageId] } }
            ]
          },
          raw: true,
          transaction
        })
        if (isPurchaseNoExist) {
          return this.addError('PackageWithSamePurchaseNoAlreadyExistErrorType')
        }
        updatedArray.purchaseNo = +purchaseNo
      }

      if (welcomePurchaseBonusApplicable === 'true') {
        const ifWelcomePurchasePackageExist = await PackageModel.findOne({
          where: {
            welcomePurchaseBonusApplicable: true,
            packageId: {
              [Op.not]: checkPackageExist.packageId
            }
          },
          transaction,
          raw: true
        })

        if (ifWelcomePurchasePackageExist) return this.addError('WelcomePurchaseBonusAlreadyExistErrorType')
        updatedArray.welcomePurchaseBonusApplicable = true
      }

      if (welcomePurchaseBonusApplicableMinutes) {
        if (+welcomePurchaseBonusApplicableMinutes > 1440) return this.addError('WelcomePurchaseBonusMinutesErrorType')
        updatedArray.welcomePurchaseBonusApplicableMinutes = +welcomePurchaseBonusApplicableMinutes
      }
      if (firstPurchaseApplicable) updatedArray.firstPurchaseApplicable = firstPurchaseApplicable === 'true' ? true : false || false

      if (imageUrl) {
        // Create a URL object
        const parsedUrl = new URL(imageUrl)
        // Get the pathname (removes domain part)
        const fileName = parsedUrl.pathname.slice(1)
        updatedArray.imageUrl = fileName
      } else if (image && typeof image === 'object') {
        const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PACKAGE}/${packageId}-${Date.now()}.${image.mimetype.split('/')[1]}`

        await uploadFile(image, fileName)
        updatedArray.imageUrl = fileName
        const imageUrlArray = `${s3Config.S3_DOMAIN_KEY_PREFIX}${fileName}`
        // await redisClient.client.lpush('packageIdImageArray', imageUrlArray)
        await redisClient.client.sadd('packageIdImageArray', imageUrlArray)
      }

      if (scratchCardId) {
        updatedArray.scratchCardId = +scratchCardId
        updatedArray.freeSpinId = null
      }
      if (freeSpinId) {
        updatedArray.freeSpinId = +freeSpinId
        updatedArray.scratchCardId = null
      }

      await PackageModel.update(updatedArray, { where: { packageId }, transaction })
      const intervalsConfiguration = intervalsConfig ? JSON.parse(intervalsConfig) : null
      await CreateConfigPackageService.run({ packageId, intervalsConfig: intervalsConfiguration }, this.context)

      triggerPackageActivationNotification(
        updatedArray.packageName,
        updatedArray.amount,
        updatedArray.gcCoin,
        updatedArray.scCoin,
        id,
        checkPackageExist.packageId,
        'updated'
      )

      if (packageValidFrom || packageValidTill) statusUpdateJobScheduler('PUT', 'package', +checkPackageExist.packageId)

      return { success: true, message: successMessage }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
