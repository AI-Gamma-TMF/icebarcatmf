import ServiceBase from '../../libs/serviceBase'
import { isValidAmount } from '../../utils/common'
import { round } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'
export class CreateConfigPackageService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        // package: PackageModel,
        NonPurchasePackages: NonPurchasePackagesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId, intervalsConfig } = this.args
    try {
      if (intervalsConfig === null) {
        await NonPurchasePackagesModel.update({ deletedAt: new Date(), isActive: false }, { where: { packageId }, transaction })
        return { createPackage: [], success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
      }
      const subPackageDetails = await NonPurchasePackagesModel.findAll({ where: { packageId, deletedAt: null }, attributes: ['nonPurchasePackageId'], raw: true, transaction })
      if (subPackageDetails.length > 0) {
        const intervalPackageIds = intervalsConfig.map(interval => interval.nonPurchasePackageId)
        const subPackageIds = subPackageDetails.map(pkg => pkg.nonPurchasePackageId)
        const missingIds = subPackageIds.filter(id => !intervalPackageIds.includes(id))

        if (missingIds.length > 0) await NonPurchasePackagesModel.update({ deletedAt: new Date(), isActive: false }, { where: { nonPurchasePackageId: { [Op.in]: missingIds } }, transaction })
      }
      const promises = intervalsConfig.map((pkg) => {
        if (isValidAmount(+pkg.discountedAmount)) {
          throw new Error('AmountInvalidErrorType')
        }
        return this.upsertNonPurchasePackage(pkg, packageId, NonPurchasePackagesModel, transaction)
      })

      await Promise.all(promises)
      return { createPackage: promises, success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async upsertNonPurchasePackage (pkg, packageId, NonPurchasePackagesModel, transaction) {
    let whereCondition = {}
    pkg.nonPurchasePackageId ? whereCondition = { packageId, nonPurchasePackageId: pkg.nonPurchasePackageId, deletedAt: null } : whereCondition = { packageId, intervalDay: pkg.intervalDays }
    const existingRecord = await NonPurchasePackagesModel.findOne({
      where: whereCondition,
      transaction
    })
    const packageData = {
      intervalDay: pkg.intervalDays,
      discountedAmount: +round(+pkg.discountedAmount, 2),
      bonusPercentage: pkg.subpackageBonusPercentage,
      isActive: pkg.subpackageIsActive,
      scCoin: pkg.subpackageScCoin,
      gcCoin: pkg.subpackageGcCoin,
      scBonus: pkg.subpackageScBonus,
      gcBonus: pkg.subpackageGcBonus,
      noOfPurchases: pkg.subpackageNoOfPurchase,
      lastPurchased: pkg.subpackagePurchaseDate
    }
    return existingRecord ? existingRecord.update(packageData, { transaction }) : NonPurchasePackagesModel.create({ packageId, ...packageData }, { transaction })
  }
}
