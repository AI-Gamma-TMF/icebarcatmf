import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import config from '../../configs/app.config'
import { deleteSubCategoryKeys, refreshMaterializedView, uploadFile, validateFile } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, updateEntity, getOne } from '../../utils/crud'
import { OK, LOGICAL_ENTITY } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    isActive: {
      type: 'string',
      enum: ['true', 'false', 'all']
    },
    thumbnail: { type: ['object', 'null'] }
  },
  required: ['name', 'isActive']
}

const constraints = ajv.compile(schema)

export class CreateCasinoProvider extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { name, isActive } = this.args
    const {
      req: {
        file: image
      }
    } = this.context

    const fileCheckResponse = validateFile(null, image)
    const transaction = this.context.sequelizeTransaction
    const data = { name, isActive }
    let query

    try {
      const checkProviderExists = await getOne({ model: db.MasterCasinoProvider, data: { ...query, name }, transaction })
      if (checkProviderExists) return this.addError('CasinoProviderExistsErrorType')

      const createCasinoProvider = await createNewEntity({ model: db.MasterCasinoProvider, data: data, transaction })
      if (fileCheckResponse === OK) {
        if (image && typeof (image) === 'object') {
          const fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.PROVIDER}/${createCasinoProvider.masterCasinoProviderId}-${Date.now()}.${image.mimetype.split('/')[1]}`
          await uploadFile(image, fileName)

          await updateEntity({
            model: db.MasterCasinoProvider,
            values: { masterCasinoProviderId: createCasinoProvider.masterCasinoProviderId },
            data: { thumbnailUrl: fileName },
            transaction
          })
          createCasinoProvider.thumbnailUrl = fileName
        }
      }

      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { createCasinoProvider, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
