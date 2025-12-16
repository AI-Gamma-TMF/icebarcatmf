import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { QuickOrderingService } from './quickOrdering.service'

export class UpdateFtpBonusStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        PackageFirstPurchaseBonuses: PackageFirstPurchaseBonusesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId, isActive, packageFirstPurchaseId } = this.args

    try {
      const [checkFtpPackageBonusExist, ftpBonusCount] = await Promise.all([
        PackageFirstPurchaseBonusesModel.findOne({ where: { packageId, packageFirstPurchaseId }, transaction }),
        (PackageFirstPurchaseBonusesModel.count({ where: { packageId, isActive: true }, transaction }))
      ])

      if (!checkFtpPackageBonusExist) return this.addError('PackageNotFoundErrorType')
      if (!(ftpBonusCount > 1) && !isActive) return this.addError('FirstPurchasePackageMustContainAtLeastOneBonusErrorType')

      await PackageFirstPurchaseBonusesModel.update(
        { isActive },
        { where: { packageId, packageFirstPurchaseId }, transaction }
      )

      await QuickOrderingService.execute({ packageId }, this.context)

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
