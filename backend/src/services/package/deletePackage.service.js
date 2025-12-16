import ServiceBase from '../../libs/serviceBase'
import { statusUpdateJobScheduler, triggerPackageActivationNotification } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeletePackageService extends ServiceBase {
  async run () {
    const { packageId } = this.args
    const {
      dbModels: { Package: PackageModel, NonPurchasePackages: NonPurchasePackagesModel },
      sequelizeTransaction: transaction
    } = this.context
    const { id } = this.context.req.body

    try {
      const isPackageExist = await PackageModel.findOne({
        where: { packageId },
        include: [
          {
            as: 'nonPurchasePackages',
            model: NonPurchasePackagesModel,
            where: { isActive: true },
            required: false
          }
        ],
        transaction
      })

      if (!isPackageExist) return this.addError('PackageNotFoundErrorType')
      if (isPackageExist.nonPurchasePackages.length > 0) {
        await NonPurchasePackagesModel.update({ isActive: false }, { where: { packageId }, transaction })
      }

      await PackageModel.update(
        {
          deletedAt: new Date(),
          isActive: false,
          isSpecialPackage: false,
          welcomePurchaseBonusApplicable: false
        },
        { where: { packageId }, transaction }
      )

      triggerPackageActivationNotification(
        isPackageExist.packageName,
        isPackageExist.amount,
        isPackageExist.gcCoin,
        isPackageExist.scCoin,
        id,
        isPackageExist.packageId,
        'deleted'
      )
      if (isPackageExist?.validTill || isPackageExist?.validFrom) statusUpdateJobScheduler('DELETE', 'package', +isPackageExist.packageId)
      return { message: SUCCESS_MSG.DELETE_SUCCESS, success: true }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
