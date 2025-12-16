import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import moment from 'moment'
import { BONUS_TYPE } from '../../utils/constants/constant'
const schemaObject = {
  type: 'object',
  properties: {
    bonusName: { type: 'string' },
    startDate: { type: 'string' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    fsAmount: { type: 'number' },
    description: { type: 'string' },
    minimumPurchase: { type: 'number' },
    percentage: { type: 'number' },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    }
  },
  required: ['bonusName', 'startDate', 'description', 'isActive']
}

const schema = {
  type: 'object',
  properties: {
    bonusType: { enum: Object.values(BONUS_TYPE) },
    bonuses: {
      type: 'array',
      items: schemaObject
    }
  },
  required: ['bonusType', 'bonuses']
}

const constraints = ajv.compile(schema)

export class CreateBonus extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      bonusType,
      bonuses: [
        {
          bonusName,
          startDate,
          endDate,
          gcAmount,
          scAmount,
          fsAmount,
          description,
          isActive,
          isUnique,
          minimumPurchase,
          percentage
        }
      ]
    } = this.args
    const user = this.context.req.user
    const { Bonus: BonusModel } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction

    const isBonusTypeExist = await getOne({
      model: BonusModel,
      data: { bonusType },
      transaction
    })
    if (isBonusTypeExist) {
      return this.addError('BonusWelComeTypeExistErrorType')
    }

    if (isBonusTypeExist?.bonusName === bonusName) {
      return this.addError('BonusNameExistErrorType')
    }
    if (
      !moment(startDate).isValid() ||
      moment(startDate).format('YYYY-MM-DD') <
        moment(new Date()).format('YYYY-MM-DD')
    ) {
      return this.addError('TodayDateErrorType')
    }
    if (!(gcAmount >= 0) || !(scAmount >= 0) || !(fsAmount >= 0)) {
      return this.addError('AmountErrorType')
    }

    const bonusObj = {
      bonusName: bonusName,
      bonusType: bonusType,
      validFrom: startDate,
      validTo: endDate,
      description: description,
      isActive: isActive,
      parentType: user.userType,
      parentId: user.detail.adminUserId,
      minimumPurchase,
      percentage,
      currency: 'USD',
      isUnique,
      gcAmount: gcAmount ?? 0,
      scAmount: scAmount ?? 0,
      fsAmount: fsAmount ?? 0
    }
    const createdBonus = await createNewEntity({
      model: BonusModel,
      data: bonusObj,
      transaction
    })
    await updateEntity({
      model: BonusModel,
      values: { bonusId: createdBonus.bonusId },
      data: { bonusUrl: `localhost:${createdBonus.bonusId}` },
      transaction
    })
    return { message: SUCCESS_MSG.CREATE_SUCCESS, success: true }
  }
}
