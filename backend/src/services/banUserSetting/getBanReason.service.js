import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetBanReasonService extends ServiceBase {
  async run () {
    const { reasonId } = this.args
    const {
      dbModels: { BanUserSetting: BanUserSettingModel }
    } = this.context
    try {
      const isReasonExist = await BanUserSettingModel.findOne({
        where: {
          reasonId,
          isActive: true
        }
      })

      if (!isReasonExist) {
        return this.addError('BanUserReasonNotFoundErrorType')
      }
      return { data: isReasonExist, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log('Error Occur in GetReasonService')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
