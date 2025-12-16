import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { removeData } from '../../utils/common'

const schema = {
  type: 'object',
  properties: {
    pageBannerId: { type: 'number' }
  },
  required: ['pageBannerId']
}

const constraints = ajv.compile(schema)

export class DeleteBannerPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { pageBannerId } = this.args
    const {
      dbModels: {
        PageBanner: PageBannerModel
      },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const isBannerExist = await PageBannerModel.findOne({
        attributes: ['pageBannerId', 'pageName'],
        where: { pageBannerId },
        transaction,
        raw: true
      })
      if (!isBannerExist) return this.addError('BannerNotFoundErrorType')

      const bannerCount = await PageBannerModel.count({
        where: { pageName: isBannerExist.pageName },
        transaction
      })

      if (bannerCount <= 1) {
        return this.addError('RouteRequiresAtLeastOneBannerErrorType')
      }

      // await deleteEntity({
      //   model: db.PageBanner,
      //   values: { pageBannerId },
      //   transaction
      // })

      await PageBannerModel.update(
        {
          deletedAt: new Date(),
          isActive: false
        },
        {
          where: { pageBannerId },
          transaction
        }
      )
      await removeData('bannerData')
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
