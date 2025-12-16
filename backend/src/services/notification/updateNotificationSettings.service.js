import { Op } from 'sequelize'
import { setData } from '../../utils/common'
import ServiceBase from '../../libs/serviceBase'

export class UpdateNotificationSettings extends ServiceBase {
  async run () {
    const {
      ADMIN_NOTIFICATION_MIN_BET_SLOTS,
      ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES,
      ADMIN_NOTIFICATION_MIN_WIN,
      ADMIN_NOTIFICATION_PACKAGE_ACTIVATION,
      ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION,
      ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION,
      ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME,
      ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME,
      ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME,
      ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME,
      ADMIN_LIVE_WINNER_SC_AMOUNT,
      ADMIN_LIVE_WINNER_GC_AMOUNT
    } = this.args

    const {
      sequelizeTransaction: transaction,
      dbModels: { GlobalSetting: GlobalSettingModel }
    } = this.context

    try {
      const oldSettings = await GlobalSettingModel.findAll({
        where: {
          [Op.or]: [
            { key: { [Op.like]: '%ADMIN_NOTIFICATION%' } },
            { key: { [Op.like]: '%ADMIN_CRITICAL_ALERT%' } },
            { key: { [Op.like]: '%ADMIN_LIVE_WINNER%' } }
          ]
        },
        transaction
      })

      const oldSettingsMap = oldSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {})

      const newSettings = [
        { key: 'ADMIN_NOTIFICATION_MIN_BET_SLOTS', value: ADMIN_NOTIFICATION_MIN_BET_SLOTS ?? oldSettingsMap.ADMIN_NOTIFICATION_MIN_BET_SLOTS },
        { key: 'ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES', value: ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES ?? oldSettingsMap.ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES },
        { key: 'ADMIN_NOTIFICATION_MIN_WIN', value: ADMIN_NOTIFICATION_MIN_WIN ?? oldSettingsMap.ADMIN_NOTIFICATION_MIN_WIN },
        { key: 'ADMIN_NOTIFICATION_PACKAGE_ACTIVATION', value: ADMIN_NOTIFICATION_PACKAGE_ACTIVATION ?? oldSettingsMap.ADMIN_NOTIFICATION_PACKAGE_ACTIVATION },
        { key: 'ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION', value: ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION ?? oldSettingsMap.ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION },
        { key: 'ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION', value: ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION ?? oldSettingsMap.ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION },
        { key: 'ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME', value: ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME ?? oldSettingsMap.ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME },
        { key: 'ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME', value: ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME ?? oldSettingsMap.ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME },
        { key: 'ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME', value: ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME ?? oldSettingsMap.ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME },
        { key: 'ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME', value: ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME ?? oldSettingsMap.ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME },
        { key: 'ADMIN_LIVE_WINNER_SC_AMOUNT', value: ADMIN_LIVE_WINNER_SC_AMOUNT ?? oldSettingsMap.ADMIN_LIVE_WINNER_SC_AMOUNT },
        { key: 'ADMIN_LIVE_WINNER_GC_AMOUNT', value: ADMIN_LIVE_WINNER_GC_AMOUNT ?? oldSettingsMap.ADMIN_LIVE_WINNER_GC_AMOUNT }

      ].filter(setting => setting.value !== undefined) // Remove undefined values

      await GlobalSettingModel.bulkCreate(newSettings, {
        updateOnDuplicate: ['value'],
        transaction
      })

      // Save new settings to Redis
      for (const setting of newSettings) {
        await setData(setting.key, setting.value)
      }

      return { message: 'Notification settings updated successfully.' }
    } catch (error) {
      console.error(
        'Error updating admin notifications:',
        error.message,
        error.stack
      )

      return this.addError('InternalServerErrorType', error)
    }
  }
}
