import db from '../../db/models'
import ajv from '../../libs/ajv'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'
import { uploadFile, getKey, validateFile, deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { OK, LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    masterCasinoProviderId: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    name: { type: 'string' },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    thumbnail: { type: ['object', 'null'] }
  },
  required: ['masterCasinoProviderId', 'name', 'isActive']
}

const constraints = ajv.compile(schema)

export class UpdateCasinoProviderService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { masterCasinoProviderId, name, isActive } = this.args
    const {
      req: {
        file: image
      }
    } = this.context

    const fileCheckResponse = validateFile(null, image)
    const transaction = this.context.sequelizeTransaction
    let updateData = { name, isActive }
    let key

    try {
      const checkProviderExists = await getOne({
        model: db.MasterCasinoProvider,
        data: { masterCasinoProviderId },
        transaction
      })

      if (!checkProviderExists) return this.addError('CasinoProviderNotFoundErrorType')
      if (checkProviderExists.name !== name) {
        const nameExists = await getOne({ model: db.MasterCasinoProvider, data: { name }, attributes: [], transaction })
        if (nameExists) return this.addError('NameExistsErrorType')
      }

      if (fileCheckResponse === OK && image && typeof (image) === 'object') {
        const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PROVIDER}/${checkProviderExists.masterCasinoProviderId}-${Date.now()}.${image.mimetype.split('/')[1]}`
        if (checkProviderExists.dataValues.thumbnailUrl) key = getKey(checkProviderExists.dataValues.thumbnailUrl)

        await uploadFile(image, fileName, key)
        updateData = { ...updateData, thumbnailUrl: fileName }
      }

      const updatedCasinoProvider = await updateEntity({
        model: db.MasterCasinoProvider,
        values: { masterCasinoProviderId },
        data: updateData,
        transaction
      })

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { updatedCasinoProvider, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
