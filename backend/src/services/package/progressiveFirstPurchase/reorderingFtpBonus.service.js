import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class ReorderingFtpBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        PackageFirstPurchaseBonuses: PackageFirstPurchaseBonusesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId, order } = this.args
    try {
      const checkPackageExist = await PackageModel.findOne({
        where: {
          packageId
        },
        transaction
      })

      if (!checkPackageExist) return this.addError('PackageNotFoundErrorType')
      const promises = order.map(async (id, index) => {
        const checkExists = await PackageFirstPurchaseBonusesModel.findOne({ where: { packageFirstPurchaseId: id }, transaction })
        if (checkExists) await PackageFirstPurchaseBonusesModel.update({ orderId: index + 1 }, { where: { packageId, packageFirstPurchaseId: id }, transaction })
      })
      await Promise.all(promises)
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
