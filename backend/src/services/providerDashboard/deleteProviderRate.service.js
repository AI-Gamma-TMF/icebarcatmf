import sequelize from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteProviderRateService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ProviderRate: ProviderRateModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { providerId } = this.args

    try {
      const existingRate = await ProviderRateModel.findOne({
        attributes: [[sequelize.literal('1'), 'exists']],
        where: {
          providerId: +providerId
        },
        transaction
      })

      if (!existingRate) return this.addError('ProviderRateNotExistErrorType')

      // delete provider rate
      await ProviderRateModel.destroy({ where: { providerId: +providerId }, transaction })

      return {
        success: true,
        message: SUCCESS_MSG.DELETE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
