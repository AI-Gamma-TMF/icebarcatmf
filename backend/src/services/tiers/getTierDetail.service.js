import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetTierDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: { Tier: TierModel }
    } = this.context

    const { tierId } = this.args

    const tierDetail = await TierModel.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      where: {
        tierId
      }
    })

    if (!tierDetail) {
      return {
        success: false,
        message: SUCCESS_MSG.GET_SUCCESS,
        tierDetail: []
      }
    }

    tierDetail.dataValues.icon = tierDetail.icon
      ? `${config.get('s3.S3_DOMAIN_KEY_PREFIX')}${tierDetail.icon}`
      : null

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      tierDetail
    }
  }
}
