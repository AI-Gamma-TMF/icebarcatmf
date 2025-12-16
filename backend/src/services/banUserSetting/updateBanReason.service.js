import ServiceBase from '../../libs/serviceBase'
import { Sequelize, Op } from 'sequelize'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateBanReasonSettingService extends ServiceBase {
  async run () {
    const { reasonId, reasonTitle, reasonDescription } = this.args
    const {
      dbModels: {
        BanUserSetting: BanUserSettingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const isReasonExist = await BanUserSettingModel.findOne({
        where: { reasonId },
        transaction
      })
      if (!isReasonExist) {
        return this.addError('BanUserReasonNotExistErrorType')
      }

      const isReasonTitleExist = await BanUserSettingModel.findOne({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('reason_title')), // Compare case-insensitively
              reasonTitle.toLowerCase()
            )
          ],
          reasonId: { [Op.notIn]: [isReasonExist.reasonId] }
        }
      })
      if (isReasonTitleExist) {
        return this.addError('ReasonWithSameTitleAlreadyExistErrorType')
      }

      await BanUserSettingModel.update({
        reasonTitle,
        reasonDescription,
        isActive: true
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
