import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { createNewEntity, getOne, updateEntity } from '../../utils/crud'
import { BONUS_TYPE, LOGICAL_ENTITY } from '../../utils/constants/constant'
import { uploadFilesBonus } from '../../utils/uploadFilesBonus'

/* const schemaObject = {
  type: 'object',
  properties: {
    bonusName: { type: 'string' },
    day: { type: 'number' },
    startDate: { type: 'string' },
    gcAmount: { type: 'number' },
    scAmount: { type: 'number' },
    fsAmount: { type: 'number' },
    description: { type: 'string' },
    isActive: {
      type: 'boolean',
      enum: [true, false]
    },
    numberOfUser: { type: 'number' }
  },
  required: ['bonusName', 'startDate', 'description', 'isActive']
} */

const schema = {
  type: 'object',
  properties: {
    bonusType: { enum: Object.values(BONUS_TYPE) },
    bonuses: {
      type: ['string', 'object', 'array']
      // items: schemaObject
    }
  },
  required: ['bonusType']
}

const constraints = ajv.compile(schema)

export class CreateProgressiveBonus extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    let { bonuses, bonusType } = this.args
    const {
      req:
      {
        files
      }
    } = this.context
    const user = this.context.req.user
    const {
      Bonus: BonusModel,
    } = this.context.dbModels
    const transaction = this.context.sequelizeTransaction
    // const image = this.context.req.file
    const isBonusExist = await getOne({
      model: BonusModel,
      data: { bonusType: bonusType, isActive: true },
      transaction
    })
    if (isBonusExist) {
      return this.addError('BonusTypeExistErrorType', 'Active daily bonus already exists')
    }
    if (bonuses !== '' && typeof bonuses === 'string') {
      bonuses = JSON.parse(bonuses)
    }
    let parentId
    const error = []
    for (const bonusValidate of bonuses) {
      const { day } = bonusValidate
      const isBonusDayExist = await getOne({
        model: BonusModel,
        data: { bonusType: bonusType, day },
        transaction
      })
      if (isBonusDayExist) {
        error.push(day + ' Day daily bonus already exists')
        continue
      }
    }
    if (error.length) {
      return this.addError('BonusExistErrorType', error.toString())
    }
    const errorZero = []
    for (const bonusValidate of bonuses) {
      const { gcAmount, scAmount } = bonusValidate
      if (gcAmount === 0 && scAmount === 0) {
        errorZero.push('Bonus CC or SC does not equal to 0')
        continue
      }
    }
    if (errorZero.length) {
      return this.addError('BonusValidationFailErrorType', error.toString())
    }

    const bonusNameId = []
    for (const bonus of bonuses) {
      const {
        bonusName, day, startDate, gcAmount, scAmount, fsAmount, description, isActive, isUnique
      } = bonus

      if (!(gcAmount >= 0) || !(scAmount >= 0)) {
        return this.addError('AmountErrorType')
      }
      const bonusObj = {
        bonusName: bonusName,
        bonusType: bonusType,
        validFrom: startDate,
        day,
        description: description,
        isActive: isActive,
        parentType: user.userType,
        parentId: user.detail.adminUserId,
        ...(parentId ? { bonusParentId: parentId } : {}),
        currency: 'USD',
        isUnique,
        gcAmount: Math.floor(gcAmount * 100) / 100 ?? 0.0,
        scAmount: Math.floor(scAmount * 100) / 100 ?? 0.0,
        fsAmount: Math.floor(fsAmount * 100) / 100 ?? 0.0
      }
      const createdBonus = await createNewEntity({
        model: BonusModel,
        data: bonusObj,
        transaction
      })
      if (!parentId) {
        parentId = createdBonus.bonusId
      }

      await updateEntity({
        model: BonusModel,
        values: { bonusId: createdBonus.bonusId },
        data: { bonusUrl: `localhost:${createdBonus.bonusId}` },
        transaction
      })
      bonusNameId[day] = { bonusId: createdBonus.bonusId, name: createdBonus.bonusName, day }
    }
    if (files && typeof (files) === 'object') {
      const uploadFilesArray = await uploadFilesBonus(files, bonusNameId, LOGICAL_ENTITY.BONUS)
      const dayExclude = []
      for (const files of uploadFilesArray) {
        if (files.entity.day === 7) {
          const keyFile = {}
          keyFile[`${files?.documentName ?? files.entity.day}`] = files.documentKey
          dayExclude.push(keyFile)
        } else {
          const keyFile = {}
          keyFile[`${files?.documentName ?? files.entity.day}`] = files.documentKey
          await updateEntity({
            model: BonusModel,
            values: { bonusId: files.entity.bonusId },
            data: { imageUrl: [keyFile] },
            transaction
          })
        }
      }
      for (const files of uploadFilesArray) {
        if (files?.entity?.day === 7) {
          await updateEntity({
            model: BonusModel,
            values: { bonusId: files.entity.bonusId },
            data: { imageUrl: dayExclude },
            transaction
          })
          break
        }
      }
    }

    return error.length ? this.addError('BonusExistErrorType', error.toString()) : { message: SUCCESS_MSG.CREATE_SUCCESS, success: true }
  }
}
