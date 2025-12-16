import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'

export class GetAdminNotificationSettings extends ServiceBase {
  async run () {
    const {
      dbModels: { GlobalSetting: GlobalSettingModel }
    } = this.context

    try {
      const data = await GlobalSettingModel.findAll({
        where: {
          [Op.or]: [
            { key: { [Op.like]: '%ADMIN_NOTIFICATION%' } },
            { key: { [Op.like]: '%ADMIN_CRITICAL_ALERT%' } },
            { key: { [Op.like]: '%ADMIN_LIVE_WINNER%' } }
          ]
        }
      })

      return { message: SUCCESS_MSG.GET_SUCCESS, settings: data }
    } catch (error) {
      console.error(
        'Error fetching admin notifications:',
        error.message,
        error.stack
      )

      return this.addError('InternalServerErrorType', error)
    }
  }
}
