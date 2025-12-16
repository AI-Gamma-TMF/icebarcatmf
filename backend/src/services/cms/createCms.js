import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    title: { type: 'object' },
    slug: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_#]*$'
    },
    content: { type: 'object' },
    category: { type: 'number' },
    cmsType: { type: 'number' },
    targetUrl: { type: 'string' },
    isActive: { type: 'boolean' },
    isHidden: { type: 'boolean' },
    showTermAndConditions: { type: 'boolean' }
  },
  required: ['title', 'category', 'isActive', 'cmsType']
}

const constraints = ajv.compile(schema)

export class CreateCmsPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { title, slug, content, isActive, category, cmsType, targetUrl, isHidden, showTermAndConditions } = this.args
    const { CmsPage: CmsPageModel, User: UserModel } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction
    let query

    try {
      if (+category && +category === 4) {
        query = { category }
      } else {
        if (slug && slug !== '') {
          query = { slug }
        }
      }
      if (query) {
        const checkCmsExist = await CmsPageModel.findOne({
          where: { ...query },
          transaction
        })
        if (checkCmsExist) {
          return ((+category && +category === 4) ? this.addError('FooterExistErrorType') : this.addError('CmsExistsErrorType'))
        }
      }

      if (+cmsType && +cmsType === 2 && !targetUrl) {
        return this.addError('TargetUrlRequiredErrorType')
      }
      await CmsPageModel.create({
        title: title,
        slug: slug || '',
        content: content || '',
        isActive,
        cmsType: cmsType || null,
        targetUrl: targetUrl || null,
        category,
        isHidden
      },
      { transaction }
      )

      if (showTermAndConditions) {
        await UserModel.update(
          {
            isTermsAccepted: false
          },
          { where: {}, transaction }
        )
      }

      await transaction.commit()

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
