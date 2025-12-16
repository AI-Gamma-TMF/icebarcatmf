import { removeData } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'

import { getAffiliateTokenCacheKey } from '../../utils/affiliate.util'

export class LogoutAffiliateService extends ServiceBase {
  async run () {
    const { req: { affiliate: { detail: affiliate } } } = this.context
    const { dbModels: { Affiliate: AffiliateModel } } = this.context
    const affiliateData = await AffiliateModel.findOne(
      { where: { affiliateId: affiliate.affiliateId } }
    )
    // delete token from redis
    const cacheTokenKey = getAffiliateTokenCacheKey(affiliateData.affiliateId)
    removeData(cacheTokenKey)

    return { affiliateId: affiliateData.affiliateId, message: 'Logout successfully', success: true }
  }
}
