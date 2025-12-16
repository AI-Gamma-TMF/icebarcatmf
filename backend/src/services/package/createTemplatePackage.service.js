import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'
import { CreatePackageService } from './createPackage.service'
import { DeletePackageService } from './deletePackage.service'

export class CreateTemplatePackageService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId, validFrom, validTill, overwriteSpecialPackage } = this.args

    try {
      const s3Config = config.getProperties().s3
      const isPackageExist = await PackageModel.findOne({
        where: { packageId },
        transaction
      })

      if (!isPackageExist) return this.addError('PackageNotFoundErrorType')

      if (isPackageExist?.isSpecialPackage && !validFrom && !validTill) return this.addError('SpecialPackageValidFromValidTillRequiredErrorType')

      if ((validFrom && !validTill) || (!validFrom && validTill)) return this.addError('ValidFromValidTillRequiredErrorType')

      const options = {
        amount: +isPackageExist.amount,
        gcCoin: +isPackageExist.gcCoin,
        scCoin: +isPackageExist.scCoin,
        isActive: true,
        image: isPackageExist.imageUrl,
        validTill: validTill,
        currency: 'USD',
        isVisibleInStore: isPackageExist.isVisibleInStore,
        purchaseLimitPerUser: isPackageExist.purchaseLimitPerUser,
        welcomePurchaseBonusApplicable: isPackageExist.welcomePurchaseBonusApplicable,
        welcomePurchaseBonusApplicableMinutes: isPackageExist.welcomePurchaseBonusApplicableMinutes,
        welcomePurchasePercentage: isPackageExist.welcomePurchasePercentage,
        validFrom: validFrom,
        bonusSc: +isPackageExist.bonusSc,
        bonusGc: +isPackageExist.bonusGc,
        isSpecialPackage: isPackageExist.isSpecialPackage,
        packageName: isPackageExist.packageName,
        purchaseNo: isPackageExist.purchaseNo,
        overwriteSpecialPackage: overwriteSpecialPackage,
        scratchCardId: isPackageExist.scratchCardId,
        freeSpinId: isPackageExist.freeSpinId
      }

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
        options.validFrom = packageValidFrom
        options.validTill = packageValidTill
        // Schedule the cron Job to update the active status of the package
        options.isActive = false
      }

      // need to check on special package
      let specialPackage = options?.isSpecialPackage
      let successMessage

      if (isPackageExist?.isSpecialPackage === true) {
        if (isPackageExist?.firstPurchaseApplicable === 'true' || isPackageExist?.welcomePurchaseBonusApplicable === 'true') specialPackage = false

        if (+isPackageExist?.purchaseNo === 0) {
          const specialPackage = await PackageModel.findOne({
            exclude: { attributes: ['createdAt', 'updatedAt'] },
            where: {
              isSpecialPackage: true,
              firstPurchaseApplicable: false,
              welcomePurchaseBonusApplicable: false,
              purchaseNo: 0,
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
            options.overwriteSpecialPackage = true
            successMessage = `A package with Package Id: ${specialPackage.packageId} was converted to a basic package.`
          }
        }
      }
      options.isSpecialPackage = specialPackage

      const count = await TransactionBankingModel.count({ where: { packageId, status: [TRANSACTION_STATUS.SUCCESS, TRANSACTION_STATUS.PENDING] }, transaction })
      if (count === 0) return this.addError('NoNeedToCreateTemplatePackageErrorType')

      await DeletePackageService.run({ packageId }, this.context)

      const result = await CreatePackageService.run(options, this.context)

      result.message = successMessage || result.message
      return result
    } catch (error) {
      throw new Error(error)
    }
  }
}
