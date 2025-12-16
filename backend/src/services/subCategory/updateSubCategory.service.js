import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { updateEntity, getOne } from '../../utils/crud'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { deleteSubCategoryKeys, refreshMaterializedView, uploadFile, validateIconFile } from '../../utils/common'
import { OK, LOGICAL_ENTITY, defaultLanguage } from '../../utils/constants/constant'

export class UpdateSubCategory extends ServiceBase {
  async run () {
    const {
      dbModels: {
        MasterGameSubCategory: MasterGameSubCategoryModel
      },
      req: { files = {} },
      sequelizeTransaction: transaction
    } = this.context

    const thumbnail = files?.thumbnail?.[0]
    const selectedThumbnail = files?.selectedThumbnail?.[0]

    const {
      isActive,
      name,
      masterGameSubCategoryId,
      isFeatured,
      slug
    } = this.args

    // if subcategory have slug then isFeatured can't be set to true
    let updateObj = {
      name: JSON.parse(name),
      isActive,
      isFeatured: slug ? false : JSON.parse(isFeatured),
      slug
    }

    let responseMessage = SUCCESS_MSG.UPDATE_SUCCESS

    if (thumbnail) {
      const fileCheckResponse = validateIconFile(null, thumbnail)
      if (fileCheckResponse !== OK) { return this.addError('FileTypeNotSupportedErrorType') }
    }

    if (selectedThumbnail) {
      const fileCheckResponse = validateIconFile(null, selectedThumbnail)
      if (fileCheckResponse !== OK) { return this.addError('FileTypeNotSupportedErrorType') }
    }

    const isSubCategoryExist = await getOne({
      model: MasterGameSubCategoryModel,
      data: { masterGameSubCategoryId },
      attributes: ['isActive', 'isFeatured', 'imageUrl']
    })
    if (!isSubCategoryExist) {
      return this.addError('GameSubCategoryNotExistsErrorType')
    }

    const filesNameObj = {}

    const uploadThumbnail = async (thumbnail, key) => {
      if (thumbnail && typeof thumbnail === 'object') {
        const fileName = `${config.get('env')}/assets/${
          LOGICAL_ENTITY.SUB_CATEGORY
        }/${masterGameSubCategoryId}-${Date.now()}.${
          thumbnail.originalname.split('.')[1]
        }`
        filesNameObj[key] = fileName
        await uploadFile(thumbnail, fileName)
      } else {
        filesNameObj[key] = isSubCategoryExist.imageUrl[key]
      }
    }

    await Promise.all([
      uploadThumbnail(thumbnail, 'thumbnail'),
      uploadThumbnail(selectedThumbnail, 'selectedThumbnail')
    ])

    if (slug) {
      const isSlugExist = await MasterGameSubCategoryModel.findOne({
        attributes: ['masterGameSubCategoryId', 'name'],
        where: {
          slug: slug
        }
      })

      if (isSlugExist && isSlugExist.masterGameSubCategoryId !== +masterGameSubCategoryId) {
        await MasterGameSubCategoryModel.update(
          {
            slug: null
          },
          {
            where: {
              masterGameSubCategoryId: +isSlugExist.masterGameSubCategoryId
            },
            transaction
          }
        )

        const nameJSON = JSON.parse(name)

        responseMessage = `${SUCCESS_MSG.UPDATE_SUCCESS}, also 'jackpot' slug removed from the subcategory '${isSlugExist.name.EN}' and assigned to '${nameJSON[defaultLanguage]}' subcategory`
      }
    }

    updateObj = { ...updateObj, imageUrl: filesNameObj }
    await updateEntity({
      model: MasterGameSubCategoryModel,
      data: updateObj,
      values: { masterGameSubCategoryId },
      transaction
    })

    await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

    return { success: true, message: responseMessage }
  }
}
