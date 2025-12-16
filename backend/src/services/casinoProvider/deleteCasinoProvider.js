import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteEntity, getOne } from '../../utils/crud'

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

export class DeleteCasinoProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { masterCasinoProviderId } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      const checkProviderExists = await getOne({
        model: db.MasterCasinoProvider,
        data: { masterCasinoProviderId },
        transaction
      })

      if (!checkProviderExists) return this.addError('CasinoProviderNotFoundErrorType')

      const checkGameExist = await getOne({ model: db.MasterCasinoGame, data: { masterCasinoProviderId }, transaction })

      if (checkGameExist) return this.addError('ActionNotAllowedErrorType')
      await deleteEntity({
        model: db.MasterCasinoProvider,
        values: { masterCasinoProviderId },
        transaction
      })

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
