import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    masterCasinoGameId: { type: 'number' }
  },
  required: ['masterCasinoGameId']
}

const constraints = ajv.compile(schema)

export class HideCasinoGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MasterCasinoGame: MasterCasinoGameModel,
        GameSubCategory: GameSubCategoryModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { masterCasinoGameId } = this.args

    try {
      const isGameExists = await MasterCasinoGameModel.findOne({
        where: { masterCasinoGameId },
        transaction
      })

      if (!isGameExists) return this.addError('CategoryGameNotFoundErrorType')

      const isGameExistsInGameSubCategory = await GameSubCategoryModel.findOne({
        where: { masterCasinoGameId },
        transaction
      })

      if (isGameExistsInGameSubCategory) {
        await GameSubCategoryModel.destroy({
          where: {
            masterCasinoGameId
          },
          transaction
        })
      }

      await MasterCasinoGameModel.update({
        isActive: false,
        isHidden: true
      }, { where: { masterCasinoGameId }, transaction })

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
