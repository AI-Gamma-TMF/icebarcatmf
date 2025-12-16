import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { updateEntity, getOne } from '../../utils/crud'

export class UpdateAffiliatesService extends ServiceBase {
  async run () {
    const {
      dbModels: { Affiliate: AffiliateModel },
      sequelizeTransaction: transaction
    } = this.context

    let { affiliateId, permission, isActive } = this.args

    try {
      const query = { affiliateId: affiliateId }

      const checkAffiliateExist = await getOne({
        model: AffiliateModel,
        data: query,
        transaction
      })

      if (!checkAffiliateExist)
        return this.addError('AffiliatesNotExistErrorType')

      const updateObj = { isActive }
      if (permission) updateObj.permission = permission

      const updateAffiliateData = await updateEntity({
        model: AffiliateModel,
        values: query,
        data: updateObj,
        transaction: transaction
      })
      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
