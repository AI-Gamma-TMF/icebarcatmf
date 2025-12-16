import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'
import { BONUS_TYPE } from '../../utils/constants/constant'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    bonusName: { type: 'string' },
    startDate: { type: 'string' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    description: { type: 'string' },
    minimumPurchase: { type: ['number', 'null'] },
    btnText: { type: ['string', 'null'] },
    termCondition: { type: ['string', 'null'] },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    }
  },
  required: ['startDate', 'description', 'isActive', 'minimumPurchase', 'scAmount', 'gcAmount' ]
}

const constraints = ajv.compile(schema)

export class ProgressiveReferralBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      id: adminId,
      bonusName,
      startDate,
      gcAmount = 0,
      scAmount = 0,
      isActive,
      minimumPurchase,
      description,
      btnText,
      termCondition,
    } = this.args

    const {
      dbModels: { Bonus: BonusModel },
      sequelizeTransaction: transaction
    } = this.context

    const file = this.context.req.file
    const bonusObj = {}
    try {

      const isBonusExist = await BonusModel.findOne({
        where: { bonusType: BONUS_TYPE.REFERRAL_BONUS, minimumPurchase: +minimumPurchase },
        raw: true
      })

      if (isBonusExist) return this.addError('BonusExistErrorType')

      //required fields
      bonusObj.parentType = 'admin'
      bonusObj.currency= {}
      bonusObj.parentId = adminId
      bonusObj.bonusName = bonusName
      bonusObj.validFrom = startDate
      bonusObj.description = description
      bonusObj.isActive = isActive

      bonusObj.bonusType = BONUS_TYPE.REFERRAL_BONUS

      if (minimumPurchase && +minimumPurchase > 0) {
        bonusObj.minimumPurchase = minimumPurchase
      } else {
        return this.addError('MinimumPurchaseAmountInvalidErrorType')
      }
  
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
      
      await BonusModel.create(bonusObj, { transaction })

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
