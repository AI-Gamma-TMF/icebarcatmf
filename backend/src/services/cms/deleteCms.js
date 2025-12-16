import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne, deleteEntity } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    cmsPageId: { type: 'number' }
  },
  required: ['cmsPageId']
}

const constraints = ajv.compile(schema)

export class DeleteCmsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { cmsPageId } = this.args
    const transaction = this.context.sequelizeTransaction
    let query
    try {
      query = { cmsPageId }
      const cmsPage = await getOne({ model: db.CmsPage, data: query, transaction })
      if (!cmsPage) return this.addError('CmsNotFoundErrorType')

      const deleteCmsPage = await deleteEntity({
        model: db.CmsPage,
        values: { cmsPageId },
        transaction
      })
      return { success: true, deleteCmsPage, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
