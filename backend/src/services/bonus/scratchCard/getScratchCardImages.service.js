import config from '../../../configs/app.config'
import redisClient from '../../../libs/redisClient'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { Op } from 'sequelize'
export class GetAllScratchCardImagesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ScratchCardConfiguration: ScratchCardConfigurationModel
      }
    } = this.context

    try {
      const s3Config = config.getProperties().s3
      const scratchCardIdImageArray = await redisClient.client.smembers('scratchCardIdImageArray')
      if (scratchCardIdImageArray.length) {
        return { imageUrlArray: scratchCardIdImageArray, message: SUCCESS_MSG.GET_SUCCESS }
      } else {
        const scratchCardConfigList = await ScratchCardConfigurationModel.findAll({
          attributes: ['imageUrl'],
          where: { imageUrl: { [Op.ne]: null } },
          paranoid: true
        })

        if (scratchCardConfigList.length === 0) return this.addError('ScratchCardNotFoundErrorType')
        const imageUrlArray = scratchCardConfigList.map((item) => {
          return `${s3Config.S3_DOMAIN_KEY_PREFIX}${item?.imageUrl}`
        })
        await redisClient.client.del('scratchCardIdImageArray')

        await redisClient.client.sadd('scratchCardIdImageArray', imageUrlArray)
        return { imageUrlArray, message: SUCCESS_MSG.GET_SUCCESS }
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
