import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    masterCasinoGameId: { type: 'number' },
    masterGameSubCategoryId: { type: 'number' },
    masterCasinoGameIds: { type: 'array' }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class DeleteCategoryGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { masterCasinoGameId, masterCasinoGameIds, masterGameSubCategoryId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      if (masterCasinoGameId) {
        const checkCategoryGameExists = await getOne(
          {
            model: db.MasterCasinoGame,
            data: { masterCasinoGameId },
            transaction
          }
        )
        const checkCategoryGameUse = await getOne(
          {
            model: db.GameSubCategory,
            data: { masterCasinoGameId },
            transaction
          }
        )
        if (!checkCategoryGameExists) return this.addError('CategoryGameNotFoundErrorType')

        if (checkCategoryGameUse) return this.addError('ActionNotAllowedErrorType')

        await checkCategoryGameExists.destroy({ transaction })
      } else if (masterCasinoGameIds && masterCasinoGameIds.length && masterGameSubCategoryId) {
        await db.GameSubCategory.destroy({
          where: {
            masterCasinoGameId: masterCasinoGameIds,
            masterGameSubCategoryId
          },
          transaction
        })
      }

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
