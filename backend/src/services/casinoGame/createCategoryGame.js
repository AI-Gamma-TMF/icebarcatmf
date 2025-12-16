import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, createNewEntity } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    games: { type: 'array' },
    masterGameSubCategoryId: { type: 'number' }
  },
  required: ['games', 'masterGameSubCategoryId']
}

const constraints = ajv.compile(schema)

export class CreateGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { masterGameSubCategoryId, games } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCasinoSubCategoryExists = await getOne({
        model: db.MasterGameSubCategory,
        data: { masterGameSubCategoryId },
        transaction
      })

      if (!checkCasinoSubCategoryExists) return this.addError('GameSubCategoryNotFoundErrorType')

      for (const game of games) {
        const checkMasterGameExists = await getOne({
          model: db.MasterCasinoGame,
          data: { masterCasinoGameId: game },
          transaction
        })
        const checkSubCategaryGameExists = await getOne({
          model: db.GameSubCategory,
          data: { masterCasinoGameId: game, masterGameSubCategoryId },
          transaction
        })

        if (checkMasterGameExists && !checkSubCategaryGameExists) {
          await createNewEntity({
            model: db.GameSubCategory,
            data: {
              masterCasinoGameId: checkMasterGameExists.masterCasinoGameId,
              masterGameSubCategoryId
            },
            transaction
          })
        }
      }

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
