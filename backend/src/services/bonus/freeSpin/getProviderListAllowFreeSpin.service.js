import { sequelize } from '../../../db/models'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetProviderListAllowFreeSpin extends ServiceBase {
  async run () {
    const {
      dbModels: { MasterCasinoProvider: MasterCasinoProviderModel, MasterGameAggregator: MasterGameAggregatorModel }
    } = this.context

    try {
      const freeSpinProviders = await MasterCasinoProviderModel.findAll({
        attributes: ['masterCasinoProviderId', 'name', 'masterGameAggregatorId', sequelize.literal('"MasterGameAggregator"."name" AS "aggregatorName"')],
        where: {
          freeSpinAllowed: true,
          isActive: true,
          adminEnabledFreespin: true
        },
        include: {
          model: MasterGameAggregatorModel,
          attributes: [],
          required: true,
          where: {
            freeSpinAllowed: true,
            isActive: true,
            adminEnabledFreespin: true
          }
        },
        raw: true
      })

      return { message: SUCCESS_MSG.GET_SUCCESS, data: freeSpinProviders }
    } catch (error) {
      console.log('Error in GetProviderListAllowSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
