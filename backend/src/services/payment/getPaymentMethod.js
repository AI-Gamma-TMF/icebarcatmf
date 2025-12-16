import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetPaymentMethodService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        PaymentMethod: PaymentMethodModel
      }
    } = this.context

    try {
      const { orderBy, sort } = this.args
      const isProviderExist = await PaymentMethodModel.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        useMaster: true,
        order: [[orderBy || 'createdAt', sort || 'DESC']]
      })
      if (!isProviderExist) {
        return this.addError('PaymentProviderNotExistErrorType')
      }

      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        data: isProviderExist
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
