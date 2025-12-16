import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import ajv from '../../../libs/ajv'
import { uploadFile } from '../../../utils/common'
import config from '../../../configs/app.config'
import { LOGICAL_ENTITY } from '../../../utils/constants/constant'
import redisClient from '../../../libs/redisClient'

const s3Config = config.getProperties().s3
const schema = {
  type: 'object',
  properties: {
    image: { type: ['object', 'null'] }
  },
  required: ['image']

}

const constraints = ajv.compile(schema)

export class UploadScratchCardImageUrlService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { image } = this.args
    let fileName
    try {
      if (image && typeof image === 'object') {
        fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.SCRATCH_CARD}/${Date.now()}.${image.mimetype.split('/')[1]}`

        await uploadFile(image, fileName)

        const imageUrl = `${s3Config.S3_DOMAIN_KEY_PREFIX}${fileName}`
        await redisClient.client.sadd('scratchCardIdImageArray', imageUrl)
      }

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS, url: fileName }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
