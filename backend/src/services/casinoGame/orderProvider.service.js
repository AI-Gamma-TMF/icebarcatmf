import ServiceBase from '../../libs/serviceBase'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class OrderProviderService extends ServiceBase {
  async run () {
    const {
      dbModels: { MasterCasinoProvider: MasterCasinoProviderModel },
      sequelizeTransaction: transaction
    } = this.context
    const { order } = this.args

    try {
      const orderPromises = order.map(async (id, index) => {
        await MasterCasinoProviderModel.update({ orderId: index + 1 }, { where: { masterCasinoProviderId: id }, transaction })
      })
      await Promise.all(orderPromises)

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
