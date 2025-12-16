import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  required: ['title', 'category', 'cmsPageId', 'cmsType']
}

const constraints = ajv.compile(schema)

export class UpdateCmsPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { cmsPageId, title, slug, content, isActive, category, targetUrl, cmsType, isHidden, showTermAndConditions } = this.args
    const { CmsPage: CmsPageModel, User: UserModel } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCmsExist = await CmsPageModel.findOne({
        where: { cmsPageId },
        transaction
      })
      if (!checkCmsExist) return this.addError('CmsNotFoundErrorType')

      if (checkCmsExist.category !== 4) {
        const checkCmsSlugExist = await CmsPageModel.findOne({
          where: { slug },
          transaction
        })
        if (checkCmsSlugExist && checkCmsSlugExist.cmsPageId !== cmsPageId) return this.addError('CmsExistsErrorType')
      }

      const updateCmsPage = await CmsPageModel.update({
        slug,
        isActive,
        category,
        title,
        content,
        targetUrl,
        cmsType,
        isHidden
      },
      {
        where: { cmsPageId },
        transaction
      })

      if (showTermAndConditions) {
        await UserModel.update(
          {
            isTermsAccepted: false
          },
          { where: {}, transaction }
        )
      }

      return { updateCmsPage, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
