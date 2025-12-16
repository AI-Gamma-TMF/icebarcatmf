import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'

const schema = {
  type: 'object',
  properties: {
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetAllEmailTemplateCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // Todo wil Use this line - const { } = this.args
    try {
      const emailCategory = await db.TemplateCategory.findAll()
      return (!emailCategory)
        ? this.addError('EmailTemplateCategoryNotFoundErrorType')
        : { emailCategory }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
