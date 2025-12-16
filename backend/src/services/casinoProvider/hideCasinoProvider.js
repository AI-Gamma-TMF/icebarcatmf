import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    masterCasinoProviderId: {
      type: 'number',
      pattern: '^[0-9]+$'
    }
  },
  required: ['masterCasinoProviderId']
}

const constraints = ajv.compile(schema)

export class HideCasinoProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterCasinoProvider: MasterCasinoProviderModel,
        MasterCasinoGame: MasterCasinoGameModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { masterCasinoProviderId } = this.args

    try {
      const isProviderExists = await MasterCasinoProviderModel.findOne({
        where: { masterCasinoProviderId, isHidden: false },
        transaction
      })

      if (!isProviderExists) return this.addError('CasinoProviderNotFoundErrorType')

      await Promise.all([
        MasterCasinoGameModel.update({
          isActive: false,
          isHidden: true
        }, { where: { masterCasinoProviderId }, transaction }),

        MasterCasinoProviderModel.update({
          isActive: false,
          isHidden: true
        }, { where: { masterCasinoProviderId }, transaction })
      ])

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
