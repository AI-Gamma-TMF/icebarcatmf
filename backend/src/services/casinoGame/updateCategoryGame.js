import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne, updateEntity, deleteEntity, createNewEntity } from '../../utils/crud'
import { convertStringToLowercaseWithDash, deleteSubCategoryKeys, refreshMaterializedView, uploadFile } from '../../utils/common'
const schema = {
  type: 'object',
  properties: {
    masterCasinoGameId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    masterGameSubCategoryId: {
      type: 'string'
    },
    isActive: {
      type: 'string',
      enum: ['true', 'false', '', 'null']
    },
    name: { type: 'string' },
    user: { type: 'object' },
    thumbnail: { type: ['object', 'null'] },
    thumbnailLong: { type: ['object', 'null'] },
    thumbnailShort: { type: ['object', 'null'] }
  },
  required: ['masterCasinoGameId', 'isActive', 'name']
}

const constraints = ajv.compile(schema)

export class UpdateCasinoGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let { isActive, masterCasinoGameId, masterGameSubCategoryId, name } = this.args
    if (masterGameSubCategoryId) masterGameSubCategoryId = masterGameSubCategoryId.split(',')
    const {
      req: {
        file
      }
    } = this.context

    const updateData = { isActive, name }
    const transaction = this.context.sequelizeTransaction

    try {
      const checkCategoryGameExists = await getOne({
        model: db.MasterCasinoGame,
        data: { masterCasinoGameId },
        include: [{ as: 'masterCasinoProvider', model: db.MasterCasinoProvider, attributes: ['name'] }],
        transaction
      })

      if (!checkCategoryGameExists) return this.addError('CategoryGameNotFoundErrorType')
      if (file && typeof (file) === 'object') {
        const imageUrl = `${config.get('env')}/games/assets/${await convertStringToLowercaseWithDash(checkCategoryGameExists?.masterCasinoProvider?.name)}/${checkCategoryGameExists.masterCasinoGameId}-long-${Date.now()}.${file.mimetype.split('/')[1]}`
        await uploadFile(file, imageUrl)
        updateData.imageUrl = imageUrl
      }

      const updatedCategoryGame = await updateEntity(
        {
          model: db.MasterCasinoGame,
          data: updateData,
          values: { masterCasinoGameId },
          transaction
        })

      if (masterGameSubCategoryId) {
        await deleteEntity({
          model: db.GameSubCategory,
          values: { masterCasinoGameId },
          transaction
        })

        for (const subCategoryId of masterGameSubCategoryId) {
          if (subCategoryId !== '') {
            await createNewEntity({
              model: db.GameSubCategory,
              data: {
                masterCasinoGameId: +(masterCasinoGameId),
                masterGameSubCategoryId: +(subCategoryId)
              },
              transaction
            })
          }
        }
      }

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { updatedCategoryGame, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
