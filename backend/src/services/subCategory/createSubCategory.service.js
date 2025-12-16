import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import { deleteSubCategoryKeys, refreshMaterializedView, uploadFile, validateIconFile } from '../../utils/common'
import {
  OK,
  defaultLanguage,
  LOGICAL_ENTITY
} from '../../utils/constants/constant'
import config from '../../configs/app.config'
import { Op } from 'sequelize'
export class CreateSubCategory extends ServiceBase {
  async run () {
    try {
      const {
        dbModels: {
          MasterGameSubCategory: MasterGameSubCategoryModel
        },
        req: { files },
        sequelizeTransaction: transaction
      } = this.context

      const thumbnail = files?.thumbnail?.[0]
      const selectedThumbnail = files?.selectedThumbnail?.[0]

      const { isActive, name, isFeatured, slug } = this.args

      let responseMessage = SUCCESS_MSG.CREATE_SUCCESS

      if (thumbnail) {
        const fileCheckResponse = validateIconFile(null, thumbnail)
        if (fileCheckResponse !== OK) { return this.addError('FileTypeNotSupportedErrorType') }
      }

      if (selectedThumbnail) {
        const fileCheckResponse = validateIconFile(null, selectedThumbnail)
        if (fileCheckResponse !== OK) { return this.addError('FileTypeNotSupportedErrorType') }
      }

      const nameJSON = JSON.parse(name)
      const isSubCategoryExist = await getOne({
        model: MasterGameSubCategoryModel,
        data: {
          isActive,
          name: {
            [Op.contains]: {
              EN: nameJSON[defaultLanguage]
            }
          },
          slug: slug ?? null
        },
        raw: true
      })

      if (isSubCategoryExist) { return this.addError('GameSubCategoryExistsErrorType') }

      let lastOrderId = await MasterGameSubCategoryModel.max('orderId')
      if (!lastOrderId) lastOrderId = 0

      if (slug) {
        const isSlugExist = await MasterGameSubCategoryModel.findOne({
          attributes: ['masterGameSubCategoryId', 'name'],
          where: {
            slug: slug
          }
        })

        if (isSlugExist) {
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

          responseMessage = `${SUCCESS_MSG.CREATE_SUCCESS}, also 'jackpot' slug removed from the subcategory '${isSlugExist.name.EN}' and assigned to '${nameJSON[defaultLanguage]}' subcategory`
        }
      }

      const subcategoryData = {
        name: nameJSON,
        isActive,
        thumbnailType: 'short',
        orderId: lastOrderId + 1,
        isFeatured: slug ? false : JSON.parse(isFeatured)
      }

      if (slug) subcategoryData.slug = slug

      const createdSubCategory = await createNewEntity({
        model: MasterGameSubCategoryModel,
        data: subcategoryData,
        transaction
      })

      const filesNameObj = {}

      const uploadThumbnail = async (thumbnail, key) => {
        if (thumbnail && typeof thumbnail === 'object') {
          const fileName = `${config.get('env')}/assets/${
            LOGICAL_ENTITY.SUB_CATEGORY
          }/${createdSubCategory.masterGameSubCategoryId}-${Date.now()}.${
            thumbnail.originalname.split('.')[1]
          }`
          filesNameObj[key] = fileName
          await uploadFile(thumbnail, fileName)
        }
      }

      await Promise.all([
        uploadThumbnail(thumbnail, 'thumbnail'),
        uploadThumbnail(selectedThumbnail, 'selectedThumbnail'),
        deleteSubCategoryKeys(),
        refreshMaterializedView(transaction)
      ])
      await updateEntity({
        model: MasterGameSubCategoryModel,
        values: {
          masterGameSubCategoryId: createdSubCategory.masterGameSubCategoryId
        },
        data: { imageUrl: filesNameObj },
        transaction
      })
      return { success: true, message: responseMessage }
    } catch (error) {
      this.addError('InternalServerErrorType', error.message)
    }
  }
}
