import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class QuickOrderingService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        PackageFirstPurchaseBonuses: PackageFirstPurchaseBonusesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { packageId } = this.args

    await PackageFirstPurchaseBonusesModel.update({ orderId: null }, { where: { isActive: false }, transaction })

    const findAllPackageFirstPurchase = await PackageFirstPurchaseBonusesModel.findAll({
      where: { packageId, isActive: true },
      order: [['orderId', 'ASC']],
      transaction
    })

    for (let i = 0; i < findAllPackageFirstPurchase.length; i++) {
      await PackageFirstPurchaseBonusesModel.update({ orderId: i + 1 }, { where: { packageFirstPurchaseId: findAllPackageFirstPurchase[i].packageFirstPurchaseId }, transaction })
    }
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
