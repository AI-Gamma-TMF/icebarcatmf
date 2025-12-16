import db from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { ERRORS } from '../../utils/constants/errors'

export class GetConfigService extends ServiceBase {
  async run () {
    try {
      const getConfig = await db.GlobalSetting.findAll({
        attributes: ['value', 'key'],
        raw: true,
        where: {
          key: ['VIP_QUESTIONNAIRE_MIN_BONUS', 'VIP_QUESTIONNAIRE_MAX_BONUS', 'VIP_QUESTIONNAIRE_NGR_MULTIPLIER', 'SUPPORT_EMAIL_ADDRESS', 'SITE_NAME', 'ORIGIN', 'MOBILE_SITE_LOGO_URL', 'LOGO_URL', 'MINIMUM_REDEEMABLE_COINS', 'MAXIMUM_REDEEMABLE_COINS', 'XP_SC_TO_GC_RATE', 'SC_TO_GC_RATE', 'MINIMUM_SC_SPIN_LIMIT', 'MINIMUM_GC_SPIN_LIMIT', 'MAX_SC_VAULT_PER', 'MAX_GC_VAULT_PER', 'POSTAL_CODE_TIME', 'POSTAL_CODE_VALID_TILL', 'KYC_DEPOSIT_AMOUNT', 'KYC_REDEEM_AMOUNT', 'CARD_PURCHASE_AMOUNT', 'AMOE_BONUS_TIME']
        }
      })
      return { config: getConfig }
    } catch (error) {
      this.addError(ERRORS.INTERNAL, error)
    }
  }
}
