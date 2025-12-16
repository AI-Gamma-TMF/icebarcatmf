import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'
// import moment from 'moment'
import { BONUS_TYPE, LOGICAL_ENTITY, OK } from '../../utils/constants/constant'
import { convertToWebPAndUpload, removeData, uploadFile, validateFile } from '../../utils/common'
import config from '../../configs/app.config'

export class EditBonus extends ServiceBase {
  async run () {
    let { bonusId, bonusName, bonusType, startDate, endDate, gcAmount = 0, scAmount = 0, fsAmount = 0, description, numberOfUser, isActive, minimumPurchase = '', percentage, btnText, termCondition, scSpinLimit, gcSpinLimit, postalCodeIntervalInMinutes, postalCodeValidityInDays, day, scratchCardId, freeSpinId } = this.args
    scratchCardId = scratchCardId && scratchCardId.trim() !== '' ? scratchCardId : null
    freeSpinId = freeSpinId && freeSpinId.trim() !== '' ? freeSpinId : null

    if (scratchCardId) {
      freeSpinId = null
    } else if (freeSpinId) {
      scratchCardId = null
    }

    const {
      dbModels: { Bonus: BonusModel, GlobalSetting: GlobalSettingModel },
      sequelizeTransaction: transaction
    } = this.context

    const file = this.context.req.file
    const isBonusExist = await BonusModel.findOne({
      where: { bonusId: bonusId },
      transaction
    })

    const bonusObj = {}
    if (!isBonusExist) return this.addError('BonusNotExistErrorType')

    if (!(gcAmount >= 0) || !(scAmount >= 0) || !(fsAmount >= 0)) return this.addError('AmountErrorType')
    // if (moment(startDate).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) {
    //   return this.addError('TodayDateErrorType')
    // }
    if (numberOfUser && !(numberOfUser >= 0)) return this.addError('InvalidNumberOfUserErrorType')

    if (+postalCodeIntervalInMinutes && (postalCodeIntervalInMinutes < 1)) {
      return this.addError('InvalidNumberOfBonusErrorType')
    }

    if (+postalCodeValidityInDays && (postalCodeValidityInDays < 1)) {
      return this.addError('InvalidNumberOfBonusErrorType')
    }
    if (bonusName) {
      const isNameExist = await BonusModel.findOne({
        where: { bonusName: { [Op.iLike]: bonusName } },
        transaction
      })
      if (isNameExist && isNameExist.bonusId === bonusId) return this.addError('BonusNameExistErrorType')
      bonusObj.bonusName = bonusName
    }
    if (+gcAmount < 0 || +scAmount < 0) {
      return this.addError('BonusValidationFailErrorType')
    }
    if (bonusType) {
      bonusObj.bonusType = bonusType
    }
    if (startDate) {
      bonusObj.validFrom = startDate
    }
    if (endDate) {
      bonusObj.validTo = endDate
    }
    if (gcAmount !== '') {
      bonusObj.gcAmount = Math.floor(gcAmount * 100) / 100
    }
    if (scAmount !== '') {
      bonusObj.scAmount = Math.floor(scAmount * 100) / 100
    }
    if (fsAmount !== '') {
      bonusObj.fsAmount = Math.floor(fsAmount * 100) / 100
    }
    if (description) {
      bonusObj.description = description
    }

    //  assign to bonus obj for scratch card and freeSpin:
    bonusObj.scratchCardId = scratchCardId ? +scratchCardId : null
    bonusObj.freeSpinId = freeSpinId ? +freeSpinId : null

    if (freeSpinId) bonusObj.freeSpinId = +freeSpinId || null
    if (minimumPurchase !== '' && (+minimumPurchase !== isBonusExist?.minimumPurchase)) {
      if (+minimumPurchase > 0) {
        const isBonusExist = await BonusModel.findOne({
          where: {
            bonusType: BONUS_TYPE.REFERRAL_BONUS,
            minimumPurchase: +minimumPurchase
          }
        })

        if (isBonusExist) return this.addError('BonusExistErrorType')

        bonusObj.minimumPurchase = minimumPurchase
      } else {
        return this.addError('MinimumPurchaseAmountInvalidErrorType')
      }
    }
    if (bonusType === BONUS_TYPE.DAILY_BONUS && day !== '') {
      if (+day > 0 && +day <= 7) bonusObj.day = +day
      else return this.addError('InvalidDayErrorType')
    }
    if (percentage !== '') {
      bonusObj.percentage = percentage
    }
    bonusObj.isActive = isActive
    if (BONUS_TYPE.DAILY_BONUS === bonusType && (isActive || startDate)) {
      await BonusModel.update(
        { isActive, validFrom: startDate },
        {
          where: { bonusType: BONUS_TYPE.DAILY_BONUS },
          transaction
        }
      )
    }
    if (BONUS_TYPE.WHEEL_SPIN_BONUS === bonusType && (isActive || startDate)) {
      if (scSpinLimit && !isNaN(scSpinLimit)) {
        await GlobalSettingModel.update(
          { value: scSpinLimit },
          {
            where: { key: 'MINIMUM_SC_SPIN_LIMIT' },
            transaction
          }
        )
      }
      if (gcSpinLimit && !isNaN(gcSpinLimit)) {
        await GlobalSettingModel.update(
          { value: gcSpinLimit },
          {
            where: { key: 'MINIMUM_GC_SPIN_LIMIT' },
            transaction
          }
        )
      }
    }

    if (BONUS_TYPE.POSTAL_CODE_BONUS === bonusType && (isActive || startDate)) {
      if (postalCodeIntervalInMinutes && !isNaN(postalCodeIntervalInMinutes)) {
        await GlobalSettingModel.update(
          { value: postalCodeIntervalInMinutes },
          {
            where: { key: 'POSTAL_CODE_TIME' },
            transaction
          }
        )
      }
      if (postalCodeValidityInDays && !isNaN(postalCodeValidityInDays)) {
        await GlobalSettingModel.update(
          { value: postalCodeValidityInDays },
          {
            where: { key: 'POSTAL_CODE_VALID_TILL' },
            transaction
          }
        )
      }
      await removeData('setting-data')
    }
    if (btnText) bonusObj.btnText = btnText
    if (termCondition && typeof termCondition === 'string') {
      bonusObj.termCondition = { EN: termCondition }
    }

    let fileName = ''
    if (file) {
      const fileCheckResponse = validateFile(null, file)
      if (fileCheckResponse !== OK) return this.addError('FileTypeNotSupportedErrorType')

      if (file && typeof file === 'object' && bonusType === BONUS_TYPE.DAILY_BONUS) {
        fileName = `${config.get('env')}/assets/${LOGICAL_ENTITY.BONUS}/daily-${bonusId}-${Date.now()}.webp`
        fileName = fileName.split(' ').join('')
        if (isBonusExist?.imageUrl) {
          const key = isBonusExist?.imageUrl.split(' ').join('')
          await convertToWebPAndUpload(file, fileName, key)
        } else {
          await convertToWebPAndUpload(file, fileName)
        }
      } else {
        fileName = `${config.get('env')}/assets/${
          LOGICAL_ENTITY.BONUS
        }/${bonusId}-${Date.now()}.${file.originalname.split('.')[1]}`
        await uploadFile(file, fileName)
      }
    }
    if (fileName) {
      bonusObj.imageUrl = fileName
    }
    await removeData('bonus-data')
    await BonusModel.update(
      { ...bonusObj },
      {
        where: { bonusId: bonusId },
        transaction
      }
    )
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
