import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { RULE_ACTIVITIES } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    ruleName: { type: 'string' },
    activity: { type: 'number' },
    countryId: { type: 'number' },
    groupId: { type: 'number' },
    singleAmount: { type: 'number' },
    sumAmount: { type: 'number' },
    withSameIp: { type: 'boolean' },
    withSameDevice: { type: 'boolean' },
    isDuplicate: { type: 'boolean' },
    isSameAddress: { type: 'boolean' },
    count: { type: 'number' },
    isEmail: { type: 'boolean' },
    isAlert: { type: 'boolean' },
    isRestrict: { type: 'boolean' },
    providerId: { type: 'number' },
    days: { type: 'number' },
    emails: { type: 'array' }
  },
  required: ['ruleName', 'activity']
}
const constraints = ajv.compile(schema)

export class CreateRule extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      // 'redemptions:1, login:2, registered-data:3, purchase:4, wins:5'

      const {
        groupId,
        countryId,
        activity,
        isEmail,
        isAlert,
        isRestrict,
        providerId,
        singleAmount,
        sumAmount,
        count,
        days,
        ruleName,
        withSameIp,
        withSameDevice,
        isDuplicate,
        isSameAddress,
        emails
      } = this.args

      let createRule = {}

      const isActive = false

      if (!Object.values(RULE_ACTIVITIES).includes(activity)) {
        return this.addError('ActivityDoesNotExistType')
      }

      if (!groupId && !countryId) {
        return this.addError('GroupIdCountryIdRequireType')
      }

      if (!isRestrict && !isEmail && !isAlert) {
        return this.addError('IsEmailIsRestrictIsAlertRequireType')
      }

      if (groupId) {
        const isGroupIdExist = await db.PlayerGroup.findAll({ where: { groupId }, attributes: ['groupId', 'groupName'] })
        if (!isGroupIdExist) {
          return this.addError('GroupIdNoTExistType')
        }
      }
      const commonSetting = {
        ruleName,
        activity,
        isAlert: isAlert || null,
        isEmail: isEmail || null,
        isRestrict: isRestrict || null,
        isActive,
        emails,
        groupId: groupId || null,
        countryId: countryId || null
      }
      // redemptions or purchase
      if (activity === RULE_ACTIVITIES.REDEMPTIONS || activity === RULE_ACTIVITIES.PURCHASE) {
        if (!singleAmount && !sumAmount) {
          return this.addError('SingleAmountSumAmountRequireType')
        }
        if (sumAmount && !days) {
          return this.addError('DaysRequireType')
        }

        createRule = {
          providerId: providerId || null,
          singleAmount: singleAmount || null,
          sumAmount: sumAmount || null,
          days: days || null,
          ...commonSetting
        }
      }

      // login
      if (activity === RULE_ACTIVITIES.LOGIN) {
        if (!withSameIp && !withSameDevice) {
          return this.addError('WithSameIpWithSameDeviceRequireType')
        }

        createRule = {
          withSameIp: withSameIp || null,
          withSameDevice: withSameDevice || null,
          ...commonSetting
        }
      }

      // registration
      if (activity === RULE_ACTIVITIES.REGISTRATION) {
        if (!isDuplicate && !isSameAddress) {
          return this.addError('IsDuplicateIsSameAddressRequireType')
        }

        createRule = {
          isDuplicate: isDuplicate || null,
          isSameAddress: isSameAddress || null,
          ...commonSetting
        }
      }

      // wins
      if (activity === RULE_ACTIVITIES.WIN) {
        if (!singleAmount && !sumAmount && !count) {
          return this.addError('SingleAmountSumAmountCountRequireType')
        }

        if (sumAmount && !days) {
          return this.addError('DaysRequireType')
        }

        if (count && !days) {
          return this.addError('DaysRequireType')
        }

        createRule = {
          singleAmount: singleAmount || null,
          sumAmount: sumAmount || null,
          days: days || null,
          count: count || null,
          ...commonSetting
        }
      }

      await db.antiFraudRules.create(createRule)
      return { success: true }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
