import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class DeleteBanReasonService extends ServiceBase {
  async run () {
    const { reasonId } = this.args
    const {
      dbModels: { BanUserSetting: BanUserSettingModel },
      sequelizeTransaction: transaction
    } = this.context
    try {
      const isReasonExist = await BanUserSettingModel.findOne({
        where: {
          reasonId
        },
        transaction
      })
      if (!isReasonExist) return this.addError('ReasonNotFoundErrorType')

      await BanUserSettingModel.destroy({
        where: { reasonId: +reasonId }
      })
      return { success: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      console.log('Error Occur in DeleteBanReasonService')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
