import { round } from 'number-precision'
import { Op, Sequelize } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { LOGICAL_ENTITY } from '../../utils/constants/constant'
import { isValidAmount, prepareImageUrl, statusUpdateJobScheduler, triggerPackageActivationNotification, uploadFile } from '../../utils/common'
import { CreateConfigPackageService } from './createConfigPackage.service'
import redisClient from '../../libs/redisClient'
export class CreatePackageService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel
      },
      sequelizeTransaction: transaction
    } = this.context
    const { id } = this.context.req.body

    const {
      amount, gcCoin, scCoin, isActive, image, validTill, currency = 'USD', isVisibleInStore, purchaseLimitPerUser, firstPurchaseApplicable, welcomePurchaseBonusApplicable, welcomePurchaseBonusApplicableMinutes, welcomePurchasePercentage,
      validFrom, bonusSc, bonusGc, playerIds, filterType, filterOperator, filterValue, isSpecialPackage, packageName, purchaseNo, intervalsConfig, imageUrl, overwriteSpecialPackage, scratchCardId, freeSpinId, isSubscriberOnly, packageTag
    } = this.args

    let successMessage = SUCCESS_MSG.CREATE_SUCCESS
    try {
      const s3Config = config.getProperties().s3
      if (isValidAmount(+amount)) return this.addError('AmountInvalidErrorType')
      if (isValidAmount(gcCoin) && isValidAmount(scCoin)) return this.addError('InvalidCoinAmountErrorType')

      // Creating package Object
      const createPackage = {
        amount: +round(+amount, 2),
        gcCoin: +round(+gcCoin, 2),
        scCoin: +round(+scCoin, 2),
        currency,
        isActive,
        isVisibleInStore,
        purchaseLimitPerUser: purchaseLimitPerUser ? +purchaseLimitPerUser : 0,
        bonusSc: bonusSc || 0,
        bonusGc: bonusGc || 0,
        isSubscriberOnly,
        packageTag
      }

      if (isSpecialPackage === true && !validFrom && !validTill) return this.addError('SpecialPackageValidFromValidTillRequiredErrorType')
      if ((validFrom && !validTill) || (!validFrom && validTill)) return this.addError('ValidFromValidTillRequiredErrorType')

      // need to check on valid from and valid till on the special package
      let packageValidFrom, packageValidTill
      if (validFrom && validTill) {
        packageValidFrom = new Date(validFrom)
        packageValidTill = new Date(validTill)
        if (
          !(packageValidFrom instanceof Date) ||
          isNaN(packageValidFrom) ||
          !(packageValidTill instanceof Date) ||
          isNaN(packageValidTill) ||
          packageValidFrom <= new Date() ||
          packageValidTill <= new Date() ||
          packageValidFrom >= packageValidTill
        ) { return this.addError('InvalidDateErrorType') }
        createPackage.validFrom = packageValidFrom
        createPackage.validTill = packageValidTill
        // Schedule the cron Job to update the active status of the package
        createPackage.isActive = false
      }

      // need to check on special package
      let specialPackage = isSpecialPackage

      if (isSpecialPackage === true) {
        if (welcomePurchaseBonusApplicable === 'true') specialPackage = false

        if (+purchaseNo === 0) {
          const specialPackage = await PackageModel.findOne({
            exclude: { attributes: ['createdAt', 'updatedAt'] },
            where: {
              isSpecialPackage: true,
              firstPurchaseApplicable: false,
              welcomePurchaseBonusApplicable: false,
              purchaseNo: 0,
              // isActive: true,
              [Op.and]: [
                { validFrom: { [Op.lte]: packageValidTill } },
                { validTill: { [Op.gte]: packageValidFrom } }
              ]
            },
            transaction,
            raw: true
          })
          if (specialPackage && !overwriteSpecialPackage) {
            // send the actual URL by prefix the env value
            specialPackage.imageUrl = specialPackage.imageUrl !== null ? `${s3Config.S3_DOMAIN_KEY_PREFIX}${specialPackage.imageUrl}` : specialPackage.imageUrl
            return { success: false, data: specialPackage, message: 'A special package with below details is already scheduled for this time. Overwriting it will convert it to a basic package with existing scheduled details. Do you want to proceed ?' }
          } else if (specialPackage && overwriteSpecialPackage) {
            await PackageModel.update({ isSpecialPackage: false }, { where: { packageId: specialPackage.packageId }, transaction })
            successMessage = `A package with Package Id: ${specialPackage.packageId} was converted to a basic package.`
          }
        }
      }

      createPackage.isSpecialPackage = specialPackage

      if ((!welcomePurchaseBonusApplicable || welcomePurchaseBonusApplicable === 'false') && filterType && filterOperator && filterValue !== '') {
        const moreData = {
          filterType,
          filterOperator,
          filterValue: +filterValue
        }
        createPackage.playerId = playerIds
        createPackage.moreDetails = moreData
      }

      if (welcomePurchasePercentage) createPackage.welcomePurchasePercentage = welcomePurchasePercentage
      if (welcomePurchaseBonusApplicable === 'true') {
        const ifWelcomePurchasePackageExist = await PackageModel.findOne({
          where: {
            welcomePurchaseBonusApplicable: true
          },
          transaction
        })

        if (ifWelcomePurchasePackageExist) return this.addError('WelcomePurchaseBonusAlreadyExistErrorType')
        if (+welcomePurchaseBonusApplicableMinutes > 1440) return this.addError('WelcomePurchaseBonusMinutesErrorType')

        createPackage.welcomePurchaseBonusApplicable = true
        createPackage.welcomePurchaseBonusApplicableMinutes = +welcomePurchaseBonusApplicableMinutes
      }

      if (packageName) {
        const name = packageName.trim().toLowerCase()
        const isPackageNameExist = await PackageModel.findOne({
          where: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('package_name')), name),
          transaction
        })
        if (isPackageNameExist) {
          return this.addError('PackageWithSameNameAlreadyExistErrorType')
        }
        createPackage.packageName = packageName
      }

      if (+purchaseNo > 0) {
        const isPurchaseNoExist = await PackageModel.findOne({
          where: {
            purchaseNo: +purchaseNo
          },
          transaction
        })
        if (isPurchaseNoExist) {
          return this.addError('PackageWithSamePurchaseNoAlreadyExistErrorType')
        }
        createPackage.purchaseNo = +purchaseNo
      }
      createPackage.firstPurchaseApplicable = firstPurchaseApplicable === 'true' ? true : false || false

      //  assign to bonus obj for scratch card and freeSpin:
      if (scratchCardId) {
        createPackage.scratchCardId = +scratchCardId
        createPackage.freeSpinId = null
      }
      if (freeSpinId) {
        createPackage.freeSpinId = +freeSpinId
        createPackage.scratchCardId = null
      }

      const newPackage = await PackageModel.create(createPackage, { transaction })
      if (intervalsConfig) await CreateConfigPackageService.run({ packageId: newPackage.packageId, intervalsConfig: JSON.parse(intervalsConfig) }, this.context)

      let fileName
      // For Package Thumbnail Upload
      if (imageUrl) {
        // Create a URL object
        const parsedUrl = new URL(imageUrl)
        // Get the pathname (removes domain part)
        fileName = parsedUrl.pathname.slice(1)
        await PackageModel.update({ imageUrl: fileName }, { where: { packageId: +newPackage.packageId }, transaction })
        newPackage.imageUrl = prepareImageUrl(fileName)
      } else if (image && typeof image === 'object') {
        fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PACKAGE}/${newPackage.packageId}-${Date.now()}.${image.mimetype.split('/')[1]}`

        await uploadFile(image, fileName)

        await PackageModel.update(
          {
            imageUrl: fileName
          },
          {
            where: {
              packageId: +newPackage.packageId
            },
            transaction
          }
        )
        newPackage.imageUrl = prepareImageUrl(fileName)
      } else if (image && typeof image === 'string') { // In case of template Packages
        await PackageModel.update(
          {
            imageUrl: image
          },
          {
            where: {
              packageId: +newPackage.packageId
            },
            transaction
          }
        )
        newPackage.imageUrl = prepareImageUrl(image)
      }

      // Push into redis list
      if (!imageUrl) {
        const imageUrlArray = `${s3Config.S3_DOMAIN_KEY_PREFIX}${fileName}`
        // await redisClient.client.lpush('packageIdImageArray', imageUrlArray)
        await redisClient.client.sadd('packageIdImageArray', imageUrlArray)
      }

      if (validFrom && validTill) statusUpdateJobScheduler('POST', 'package', newPackage.packageId)

      triggerPackageActivationNotification(
        newPackage.packageName,
        newPackage.amount,
        newPackage.gcCoin,
        newPackage.scCoin,
        id,
        +newPackage.packageId,
        'added'
      )

      return { createPackage: newPackage, success: true, message: successMessage }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
