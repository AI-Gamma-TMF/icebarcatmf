import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { DeleteCRMPromocodeService } from '../crmPromotions'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'
import { statusUpdateJobScheduler } from '../../utils/common'

export class DeletePromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { Promocode: PromocodeModel },
      sequelizeTransaction: transaction
    } = this.context

    const { promocode } = this.args

    try {
      const promocodeExist = await PromocodeModel.findOne({
        attributes: ['promocode', 'crmPromocode', 'promocodeId'],
        where: { promocode },
        transaction,
        raw: true
      })

      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')

      if (promocodeExist.crmPromocode) {
        await DeleteCRMPromocodeService.execute({ promocode }, this.context)
        await PromocodeModel.destroy({ where: { promocode }, transaction })
        statusUpdateJobScheduler('DELETE', 'promocode', +promocodeExist.promocodeId)
        return {
          success: true,
          message: SUCCESS_MSG.DELETE_SUCCESS
        }
      }

      await PromocodeModel.update({
        deletedAt: new Date(),
        status: PROMOCODE_STATUS.DELETED
      },
      { where: { promocode, crmPromocode: false }, transaction })

      statusUpdateJobScheduler('DELETE', 'promocode', +promocodeExist.promocodeId)

      return {
        success: true,
        message: SUCCESS_MSG.DELETE_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
