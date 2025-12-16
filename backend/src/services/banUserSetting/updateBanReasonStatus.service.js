import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateBanReasonStatusService extends ServiceBase {
  async run () {
    const { reasonId, isActive } = this.args
    const {
      dbModels: {
        BanUserSetting: BanUserSettingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    if (reasonId <= 0) return this.addError('InvalidIdErrorType')
    try {
      const isReasonExist = await BanUserSettingModel.findOne({
        where: { reasonId },
        transaction
      })
      if (!isReasonExist) {
        return this.addError('BanUserReasonNotExistErrorType')
      }
      await BanUserSettingModel.update({
        isActive
      },
      {
        where: { reasonId: +reasonId },
        transaction
      }
      )
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log('Error Occur in UpdateBanReasonSettingService')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
