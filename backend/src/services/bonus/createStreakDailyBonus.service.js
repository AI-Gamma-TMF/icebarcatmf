import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { BONUS_TYPE, LOGICAL_ENTITY } from '../../utils/constants/constant'
import config from '../../configs/app.config'
import { convertToWebPAndUpload } from '../../utils/common'

export class CreateStreakDailyBonusService extends ServiceBase {
  async run () {
    const {
      id: adminId,
      bonusName,
      startDate,
      gcAmount = 0,
      scAmount = 0,
      isActive,
      day,
      description,
      btnText,
      termCondition
    } = this.args

    const {
      dbModels: { Bonus: BonusModel },
      req: { file: dailyBonusImg },
      sequelizeTransaction: transaction
    } = this.context

    let fileName
    const bonusObj = {}
    try {
      if (+day && +day > 0 && +day <= 7) {
        bonusObj.day = +day
      } else {
        return this.addError('InvalidDayErrorType')
      }
      const isBonusExist = await BonusModel.findOne({
        where: {
          bonusType: BONUS_TYPE.DAILY_BONUS,
          day: +day
        },
        raw: true
      })

      if (isBonusExist) return this.addError('BonusExistErrorType')

      // required fields
      bonusObj.parentType = 'admin'
      bonusObj.currency = {}
      bonusObj.parentId = +adminId
      bonusObj.bonusName = bonusName
      bonusObj.validFrom = startDate
      bonusObj.description = description || ''
      bonusObj.isActive = isActive || true
      bonusObj.btnText = btnText || ''
      bonusObj.bonusType = BONUS_TYPE.DAILY_BONUS

      if (+gcAmount < 0 || +scAmount < 0) {
        return this.addError('BonusValidationFailErrorType')
      }

      if (+gcAmount) {
        bonusObj.gcAmount = Math.floor(gcAmount * 100) / 100
      }
      if (+scAmount !== '') {
        bonusObj.scAmount = Math.floor(scAmount * 100) / 100
      }

      if (btnText) bonusObj.btnText = btnText

      if (termCondition && typeof termCondition === 'string') {
        bonusObj.termCondition = { EN: termCondition }
      }

      const createBonus = await BonusModel.create(bonusObj, { transaction })
      // upload daily image
      if (createBonus && dailyBonusImg) {
        if (dailyBonusImg && typeof dailyBonusImg === 'object') {
          fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.BONUS}/daily-${createBonus?.bonusId}-${Date.now()}.webp`
          fileName = fileName.split(' ').join('')
          const webpFileName = await convertToWebPAndUpload(dailyBonusImg, fileName)
          bonusObj.imageUrl = webpFileName
          await BonusModel.update({
            imageUrl: webpFileName
          },
          {
            where: {
              bonusId: createBonus?.bonusId
            },
            transaction
          })
        }
      }

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
