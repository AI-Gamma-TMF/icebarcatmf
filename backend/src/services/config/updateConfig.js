import db from '../../db/models'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../../libs/serviceBase'
import { updateEntity } from '../../utils/crud'
import { validateFile, uploadFile, removeData, setData } from '../../utils/common'
import { OK } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    siteName: { type: 'string' },
    origin: { type: 'string' },
    supportEmail: {
      type: 'string',
      maxLength: 150,
      format: 'email'
    },
    minRedeemableCoins: { type: 'string' },
    maxRedeemableCoins: { type: 'string' },
    scToGcRate: { type: 'string' },
    xpScToGcRate: { type: 'string' },
    scSpinLimit: { type: 'string' },
    gcSpinLimit: { type: 'string' },
    gcVaultPercentage: { type: 'string' },
    scVaultPercentage: { type: 'string' },
    kycDepositAmount: { type: 'string' },
    kycRedeemAmount: { type: 'string' },
    cardPurchaseAmount: { type: 'string' },
    amoeBonusTime: { type: 'string' },
    vipMinQuestionnaireBonus: { type: 'string' },
    vipMaxQuestionnaireBonus: { type: 'string' },
    vipNgrQuestionnaireMultiplier: { type: 'string' }

  },
  required: ['vipMinQuestionnaireBonus', 'vipMaxQuestionnaireBonus', 'vipNgrQuestionnaireMultiplier', 'supportEmail', 'siteName', 'origin', 'minRedeemableCoins', 'maxRedeemableCoins', 'scToGcRate', 'xpScToGcRate']
}
const constraints = ajv.compile(schema)
export class UpdateConfigService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { vipNgrQuestionnaireMultiplier, vipMaxQuestionnaireBonus, vipMinQuestionnaireBonus, supportEmail, siteName, origin, minRedeemableCoins, xpScToGcRate, scToGcRate, maxRedeemableCoins, scSpinLimit, gcSpinLimit, gcVaultPercentage, scVaultPercentage, kycDepositAmount, kycRedeemAmount, cardPurchaseAmount, amoeBonusTime } = this.args
    const {
      req: {
        files
      }
    } = this.context
    const image = files?.image?.[0]
    const mobileImage = files?.mobileImage?.[0]
    const transaction = this.context.sequelizeTransaction
    const extraData = []

    try {
      if (image) {
        const fileCheckResponse = validateFile(null, image)
        if (fileCheckResponse !== OK) {
          return this.addError('FileTypeNotSupportedErrorType')
        } else {
          if (image && typeof (image) === 'object') {
            const fileName = `${process.env.NODE_ENV}/admin_logo_image_${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${image.mimetype.split('/')[1]}`
            const s3Object = await uploadFile(image, fileName)
            await updateEntity({
              model: db.GlobalSetting,
              values: { key: 'LOGO_URL' },
              data: {
                value: s3Object.Location
              }
            })
          }
        }
      }
      if (mobileImage) {
        const fileCheckResponse = validateFile(null, mobileImage)
        if (fileCheckResponse !== OK) {
          return this.addError('FileTypeNotSupportedErrorType')
        } else {
          if (mobileImage && typeof (mobileImage) === 'object') {
            const fileName = `${process.env.NODE_ENV}/admin_mobile_logo_image_${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${mobileImage.mimetype.split('/')[1]}`
            const s3Object = await uploadFile(mobileImage, fileName)
            await updateEntity({
              model: db.GlobalSetting,
              values: { key: 'MOBILE_SITE_LOGO_URL' },
              data: {
                value: s3Object.Location
              }
            })
          }
        }
      }

      await db.GlobalSetting.bulkCreate([
        { key: 'ORIGIN', value: origin },
        { key: 'SUPPORT_EMAIL_ADDRESS', value: supportEmail },
        { key: 'SITE_NAME', value: siteName },
        { key: 'MINIMUM_REDEEMABLE_COINS', value: minRedeemableCoins },
        { key: 'MAXIMUM_REDEEMABLE_COINS', value: maxRedeemableCoins },
        { key: 'XP_SC_TO_GC_RATE', value: xpScToGcRate },
        { key: 'SC_TO_GC_RATE', value: scToGcRate },
        { key: 'MINIMUM_SC_SPIN_LIMIT', value: scSpinLimit },
        { key: 'MINIMUM_GC_SPIN_LIMIT', value: gcSpinLimit },
        { key: 'MAX_SC_VAULT_PER', value: scVaultPercentage },
        { key: 'MAX_GC_VAULT_PER', value: gcVaultPercentage },
        { key: 'KYC_DEPOSIT_AMOUNT', value: kycDepositAmount },
        { key: 'KYC_REDEEM_AMOUNT', value: kycRedeemAmount },
        { key: 'CARD_PURCHASE_AMOUNT', value: cardPurchaseAmount },
        { key: 'AMOE_BONUS_TIME', value: amoeBonusTime },
        { key: 'VIP_QUESTIONNAIRE_MIN_BONUS', value: vipMinQuestionnaireBonus },
        { key: 'VIP_QUESTIONNAIRE_MAX_BONUS', value: vipMaxQuestionnaireBonus },
        { key: 'VIP_QUESTIONNAIRE_NGR_MULTIPLIER', value: vipNgrQuestionnaireMultiplier },
        ...extraData
      ], {
        fields: ['key', 'value'],
        updateOnDuplicate: ['value']
      },
      transaction)

      const updateConfig = await db.GlobalSetting.findAll({
        attributes: ['value', 'key'],
        raw: true,
        where: {
          key: ['VIP_QUESTIONNAIRE_MIN_BONUS', 'VIP_QUESTIONNAIRE_MAX_BONUS', 'VIP_QUESTIONNAIRE_NGR_MULTIPLIER', 'SUPPORT_EMAIL_ADDRESS', 'SITE_NAME', 'ORIGIN', 'MOBILE_SITE_LOGO_URL', 'LOGO_URL', 'MINIMUM_REDEEMABLE_COINS', 'MAXIMUM_REDEEMABLE_COINS', 'XP_SC_TO_GC_RATE', 'SC_TO_GC_RATE', 'MINIMUM_SC_SPIN_LIMIT', 'MINIMUM_GC_SPIN_LIMIT', 'MAX_GC_VAULT_PER', 'MAX_SC_VAULT_PER', 'KYC_DEPOSIT_AMOUNT', 'KYC_REDEEM_AMOUNT', 'CARD_PURCHASE_AMOUNT', 'AMOE_BONUS_TIME']
        }
      })

      await Promise.all([removeData('setting-data'), removeData('siteLogoData'), removeData('tier-global-setting-data'), await setData('amoe-global-setting-data', JSON.stringify({ AMOE_BONUS_TIME: amoeBonusTime }))])
      return { updateConfig, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
