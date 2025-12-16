import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetProvidersRateDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ProviderRate: ProviderRateModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      }
    } = this.context

    const { providerId, rateId, orderBy, sort } = this.args

    try {
      let whereQuery = {}

      if (providerId) whereQuery = { providerId }
      if (rateId) whereQuery = { ...whereQuery, rateId: +rateId }

      const [providerRateDetail, getAggregatorProviderData] = await Promise.all([
        ProviderRateModel.findAll({
          attributes: ['rateId', 'ggrMinimum', 'ggrMaximum', 'rate'],
          where: whereQuery,
          order: [[orderBy || 'createdAt', sort || 'DESC']]
        }),
        MasterCasinoProviderModel.findOne({
          attributes: ['name', 'masterCasinoProviderId'],
          where: { masterCasinoProviderId: +providerId },
          include: {
            model: MasterGameAggregatorModel,
            attributes: ['name', 'masterGameAggregatorId']
          }
        })
      ])

      return {
        success: true,
        providerRateDetail: { count: providerRateDetail.length || 0, rows: providerRateDetail },
        aggregatorId: getAggregatorProviderData?.MasterGameAggregator?.masterGameAggregatorId,
        aggregatorName: getAggregatorProviderData?.MasterGameAggregator?.name,
        providerId: getAggregatorProviderData?.masterCasinoProviderId,
        providerName: getAggregatorProviderData?.name,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
