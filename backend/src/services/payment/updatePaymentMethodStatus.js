import ServiceBase from '../../libs/serviceBase'

export class UpdatePaymentMethodStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        PaymentMethod: PaymentMethodModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { isActive, paymentMethodId } = this.args

    try {
      const isProviderExist = await PaymentMethodModel.findOne({
        where: {
          paymentMethodId: +paymentMethodId
        }
      })
      if (!isProviderExist) {
        return this.addError('PaymentProviderNotExistErrorType')
      }

      const { methodName } = isProviderExist
      let message

      // Check if the method is PAY_BY_BANK or TRUSTLY

      if (['PAY_BY_BANK', 'TRUSTLY'].includes(methodName)) {
        const alteredMethodName = methodName === 'TRUSTLY' ? 'PAY_BY_BANK' : 'TRUSTLY'

        await Promise.all([
          PaymentMethodModel.update({ isActive: !isActive }, { where: { methodName: alteredMethodName }, transaction }),
          isProviderExist.update({ isActive }, { transaction })
        ])
        message = `${isProviderExist.methodName} ${isActive ? 'Activated' : 'Deactivated'} & ${alteredMethodName} ${isActive ? 'Deactivated' : 'Activated'} Successfully`
      } else {
        await PaymentMethodModel.update(
          { isActive },
          { where: { paymentMethodId }, transaction }
        )
        message = `${isProviderExist.methodName} ${isActive ? 'Activated' : 'Deactivated'} Successfully`
      }

      return { success: true, message }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
