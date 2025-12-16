import { Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class CreateBanReasonSettingService extends ServiceBase {
  async run () {
    const { reasonTitle, reasonDescription, isAccountClose } = this.args
    const {
      dbModels: {
        BanUserSetting: BanUserSettingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const title = reasonTitle.trim().toLowerCase()
      const isReasonExist = await BanUserSettingModel.findOne({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('reason_title')), title)
      })
      if (isReasonExist) {
        return this.addError('ReasonWithSameTitleAlreadyExistErrorType')
      }
      await BanUserSettingModel.create({
        reasonTitle,
        reasonDescription,
        deactivateReason: isAccountClose,
        isActive: true
      },
      { transaction }
      )
      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      console.log('Error Occur in CreateBanReasonSettingService')
      return this.addError('InternalServerErrorType', error)
    }
  }
}
