import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne } from '../../utils/crud'

export class GetAffiliateDetailsService extends ServiceBase {
  async run () {
    const {
      req: {
        affiliate: { detail }
      },
      dbModels: { Affiliate: AffiliateModel },
      sequelizeTransaction: transaction
    } = this.context

    const affiliateId = detail.affiliateId

    try {
      const affiliate = await getOne({
        model: AffiliateModel,
        data: { affiliateId },
        transaction
      })
      if (!affiliate) {
        return this.addError('AffiliatesNotExistErrorType')
      }
      delete affiliate.dataValues.password

      affiliate.dataValues.affiliateUrl = `${config.get(
        'userFrontendUrl'
      )}/?affiliateCode=${affiliate.affiliateCode}`

      return { getAffiliateDetail: affiliate, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
