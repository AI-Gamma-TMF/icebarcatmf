import { literal } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAggregatorProviderDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      }
    } = this.context

    const { pageNo, limit, providerId, aggregatorId } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)

      let whereQuery = {}
      let providerWhereQuery = {}
      if (providerId) providerWhereQuery = { masterCasinoProviderId: +providerId }
      if (aggregatorId) whereQuery = { ...whereQuery, masterGameAggregatorId: +aggregatorId }

      whereQuery = { ...whereQuery, isHidden: false }
      providerWhereQuery = { ...providerWhereQuery, isHidden: false }

      const aggregatorProviderData = await MasterCasinoProviderModel.findAndCountAll({
        attributes: [
          'masterCasinoProviderId',
          'name',
          [
            literal(`EXISTS (
              SELECT 1
              FROM provider_rate AS "ProviderRates"
              WHERE "ProviderRates"."provider_id" = "MasterCasinoProvider"."master_casino_provider_id" AND "ProviderRates"."deleted_at" IS NULL
              LIMIT 1
            )`),
            'hasProviderRate'
          ]
        ],
        where: providerWhereQuery,
        include: {
          model: MasterGameAggregatorModel,
          where: whereQuery,
          attributes: ['masterGameAggregatorId', 'name']
        },
        limit: size,
        offset: (page - 1) * size
      })

      const finalResult = aggregatorProviderData.rows.map(row => {
        return {
          aggregatorId: row?.MasterGameAggregator?.masterGameAggregatorId,
          aggregatorName: row?.MasterGameAggregator?.name,
          providerId: row?.masterCasinoProviderId || null,
          providerName: row?.name || null,
          hasProviderRate: row?.getDataValue('hasProviderRate') === true
        }
      })

      return {
        success: true,
        finalResult: { count: aggregatorProviderData.count || 0, rows: finalResult },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
