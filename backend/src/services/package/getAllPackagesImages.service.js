import config from '../../configs/app.config'
import redisClient from '../../libs/redisClient'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllPackagesImagesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel
      }
    } = this.context

    try {
      const s3Config = config.getProperties().s3
      const packageIdImageArray = await redisClient.client.smembers('packageIdImageArray')
      //  await redisClient.client.lrange('packageIdImageArray', 0, -1)

      if (packageIdImageArray.length) {
        return { imageUrlArray: packageIdImageArray, message: SUCCESS_MSG.GET_SUCCESS }
      } else {
        const packageList = await PackageModel.findAll({
          attributes: ['imageUrl'],
          where: { isActive: true }
        })

        if (!packageList) return this.addError('PackageNotFoundErrorType')
        if (packageList.length === 0) return this.addError('PackageNotFoundErrorType')
        const imageUrlArray = packageList.map((item) => {
          return `${s3Config.S3_DOMAIN_KEY_PREFIX}${item?.imageUrl}`
        })
        await redisClient.client.del('packageIdImageArray')
        // await redisClient.client.lpush('packageIdImageArray', imageUrlArray)

        await redisClient.client.sadd('packageIdImageArray', imageUrlArray)
        return { imageUrlArray, message: SUCCESS_MSG.GET_SUCCESS }
      }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
