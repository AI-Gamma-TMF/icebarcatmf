import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    masterGameAggregatorId: {
      type: 'number',
      pattern: '^[0-9]+$'
    }
  },
  required: ['masterGameAggregatorId']
}

const constraints = ajv.compile(schema)

export class HideCasinoAggregatorService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterGameAggregator: MasterGameAggregatorModel,
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterCasinoGame: MasterCasinoGameModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { masterGameAggregatorId } = this.args

    try {
      const isAggregatorExist = await MasterGameAggregatorModel.findOne({
        where: { masterGameAggregatorId, isHidden: false },
        transaction
      })

      if (!isAggregatorExist) return this.addError('GameAggregatorNotExistsErrorType')

      const isProviderExist = await MasterCasinoProviderModel.findAll({
        attributes: ['masterCasinoProviderId'],
        where: { masterGameAggregatorId },
        transaction
      })

      const providerIds = isProviderExist.map(providerData => { return +providerData.masterCasinoProviderId })

      await Promise.all([
        MasterCasinoProviderModel.update({
          isActive: false,
          isHidden: true
        }, { where: { masterGameAggregatorId }, transaction }),

        MasterCasinoGameModel.update({
          isActive: false,
          isHidden: true
        }, { where: { masterCasinoProviderId: { [Op.in]: providerIds } }, transaction }),

        MasterGameAggregatorModel.update({
          isActive: false,
          isHidden: true
        }, { where: { masterGameAggregatorId }, transaction })
      ])

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
