import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { RESPONSIBLE_GAMBLING_STATUS } from '../../utils/constants/constant'

export class ResetUserResponsibleSetting extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ResponsibleGambling: ResponsibleGamblingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { responsibleGamblingType, userId, amount, limitType, selfExclusion } = this.args

    try {
      const whereConditions = { responsibleGamblingType, userId, status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE }

      if (amount < 0) return this.addError('AmountShouldNotNegativeErrorType')
      if (limitType) whereConditions.limitType = limitType
      if (amount) whereConditions.amount = amount
      if (selfExclusion === true) whereConditions.selfExclusion = true

      const existingSetting = await ResponsibleGamblingModel.findOne({ where: whereConditions }, transaction)

      if (!existingSetting) return this.addError('UserResponsibleSettingNotExistType')

      const updateObj = { status: RESPONSIBLE_GAMBLING_STATUS.IN_ACTIVE }
      if (selfExclusion === true) updateObj.selfExclusion = false
      if (existingSetting && existingSetting.status === RESPONSIBLE_GAMBLING_STATUS.ACTIVE) {
        await ResponsibleGamblingModel.update(updateObj, { where: whereConditions, transaction })
      }
      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
