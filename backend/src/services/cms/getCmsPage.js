import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import config from '../../configs/app.config'

const schema = {
  type: 'object',
  properties: {
    cmsPageId: {
      type: 'string',
      pattern: '^[0-9]+$'
    }
  },
  required: ['cmsPageId']
}

const constraints = ajv.compile(schema)

export class GetCmsPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { cmsPageId } = this.args
    let query = { cmsPageId }

    try {
      query = { ...query }

      const cmsDetails = await getOne({ model: db.CmsPage, data: query })
      if (!cmsDetails) return this.addError('CmsNotFoundErrorType')
      cmsDetails.dataValues.link = `${config.get('userFrontendUrl')}/cms/${cmsDetails.dataValues.slug}`
      return { cmsDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
