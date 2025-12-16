import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetSubPackagesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        NonPurchasePackages: NonPurchasePackagesModel
      }
    } = this.context

    try {
      const { packageId } = this.args
      const packageList = await PackageModel.findAndCountAll({
        where: { packageId: packageId },
        attributes: ['packageId', 'packageName', 'amount', 'gcCoin', 'scCoin', 'bonusSc', 'bonusGc', 'purchaseNo', 'createdAt', 'updatedAt'],
        include: [
          {
            as: 'nonPurchasePackages',
            model: NonPurchasePackagesModel,
            required: false
          }
        ],
        order: [['nonPurchasePackages', 'intervalDay', 'ASC']]
      })
      return { packageList, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('error', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
