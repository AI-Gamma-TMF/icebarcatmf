import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { QuickOrderingService } from './quickOrdering.service'

export class DeleteFtpBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        PackageFirstPurchaseBonuses: PackageFirstPurchaseBonusesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId, packageFirstPurchaseId } = this.args

    try {
      const [checkFtpPackageBonusExist, ftpBonusCount] = await Promise.all([
        (PackageFirstPurchaseBonusesModel.findOne({
          where: { packageId, packageFirstPurchaseId },
          transaction
        })),
        (
          PackageFirstPurchaseBonusesModel.count({
            where: { packageId },
            transaction
          })
        )
      ])
      if (!(ftpBonusCount > 1)) {
        return this.addError('FirstPurchasePackageMustContainAtLeastOneBonusErrorType')
      }

      if (!checkFtpPackageBonusExist) return this.addError('PackageNotFoundErrorType')

      await PackageFirstPurchaseBonusesModel.destroy(
        { where: { packageId, packageFirstPurchaseId }, transaction }
      )

      await QuickOrderingService.execute({ packageId }, this.context)
      return { message: SUCCESS_MSG.DELETE_SUCCESS, success: true }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
