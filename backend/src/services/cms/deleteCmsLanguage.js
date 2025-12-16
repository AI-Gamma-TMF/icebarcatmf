import db from '../../db/models'
import ajv from '../../libs/ajv'
import { getOne, updateEntity } from '../../utils/crud'
import ServiceBase from '../../libs/serviceBase'
import { defaultLanguage } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    language: { type: 'string' },
    cmsPageId: { type: 'number' }
  },
  required: ['cmsPageId', 'language']
}

const constraints = ajv.compile(schema)

export class DeleteCmsLanguageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { cmsPageId, language } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    try {
      query = { cmsPageId }

      const cmsPage = await getOne({ model: db.CmsPage, data: query, transaction })
      if (!cmsPage) return this.addError('CmsNotFoundErrorType')

      if (language === defaultLanguage) return this.addError('ActionNotAllowedErrorType') // Todo due to english is default language

      delete cmsPage.title[language]
      delete cmsPage.content[language]

      const updateCmsPage = await updateEntity({
        model: db.CmsPage,
        data: {
          title: cmsPage.title || '',
          content: cmsPage.content
        },
        values: { cmsPageId },
        transaction
      })
      return { success: true, updateCmsPage }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
