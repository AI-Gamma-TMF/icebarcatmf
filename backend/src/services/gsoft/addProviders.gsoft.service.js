import axios from 'axios'
import Logger from '../../libs/logger'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
export default class AddProvidersGSoftService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterGameAggregator: MasterGameAggregatorModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { jwtToken } = this.args

    try {
      const { sinartra_game_url: gameUrl, version } =
        config.getProperties().gSoft

      let aggregatorId

      let aggregator = await MasterGameAggregatorModel.findOne({
        where: {
          name: 'gsoft'
        },
        transaction
      })

      if (aggregator) aggregatorId = aggregator.masterGameAggregatorId
      else
        aggregator = await MasterGameAggregatorModel.create(
          {
            name: 'gsoft'
          },
          { transaction }
        )
        aggregatorId = aggregator.masterGameAggregatorId

        const options = {
        method: 'GET',
        url: `${gameUrl}/vendors/${version}/view/available`,
        headers: {
          'jwt-auth': jwtToken,
        }
      }

      const { status, data } = await axios(options)

      if (status !== 200) return this.addError('GSoftApiErrorType')

      const alreadyAddedProviders = await MasterCasinoProviderModel.findAll({
        where: {
          masterGameAggregatorId: +aggregatorId
        },
        transaction
      })
      const newProviders = []

      await Promise.allSettled(
        data.map(async newProvider => {
          let found = false
          for (const oldProvider of alreadyAddedProviders) {
            if (newProvider.name.toUpperCase() === oldProvider.name.toUpperCase()) {
              found = true
              break
            }
          }
          if (!found) {
            newProviders.push({
              name: newProvider.name.toUpperCase(),
              isActive: true,
              masterGameAggregatorId: aggregatorId
            })
          }
        })
      )

      await MasterCasinoProviderModel.bulkCreate(newProviders, { transaction })

      return { status: 200, message: 'Updated Successfully' }
    } catch (error) {
      console.log(error)
      Logger.error('Error while adding Providers', error)
      throw 'InternalServerErrorType'
    }
  }
}
