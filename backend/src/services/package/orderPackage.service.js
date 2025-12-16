import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class OrderPackageService extends ServiceBase {
  async run () {
    const {
      dbModels: { Package: PackageModel },
      sequelizeTransaction: transaction
    } = this.context

    const { order } = this.args
    try {
      const promises = order.map(async (id, index) => {
        const checkExists = await PackageModel.findOne({ where: { packageId: id }, transaction })

        if (checkExists) await PackageModel.update({ orderId: index + 1 }, { where: { packageId: id }, transaction })
      })

      await Promise.all(promises)

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
