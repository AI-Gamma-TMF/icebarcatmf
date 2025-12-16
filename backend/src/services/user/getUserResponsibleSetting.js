import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import db from '../../db/models'
import moment from 'moment'
import { RESPONSIBLE_GAMBLING_TYPE, TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    userId: { type: 'string' },
    userType: { type: 'string' },
    active: { type: 'string' },
    timezone: { type: 'string' }
  },
  required: ['userId']
}
const constraints = ajv.compile(schema)

export class GetUserResponsibleSetting extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, active, timezone } = this.args
    const { ResponsibleGambling: ResponsibleGamblingModel } = db

    if (!(+userId)) return this.addError('InvalidIdErrorType')

    try {
      const whereConditions = { userId }
      if (active) whereConditions.status = active

      const userResponsibleSetting = await ResponsibleGamblingModel.findAll({ where: whereConditions, order: [['createdAt', 'DESC']] })

      const reverseMapping = {}
      for (const key in RESPONSIBLE_GAMBLING_TYPE) {
        const value = RESPONSIBLE_GAMBLING_TYPE[key]
        reverseMapping[value] = key
      }
      const groupedData = {}
      // Iterate through the data array and group objects by responsibleGamblingType
      userResponsibleSetting.forEach((item) => {
        const type = reverseMapping[item.responsibleGamblingType]
        if (type === 'PURCHASE') {
          if (item.limitType === '1') {
            item.dataValues.message = `Users Daily Purchase Limit is $${item.amount}`
          } if (item.limitType === '2') {
            item.dataValues.message = `Users Weekly Purchase Limit is $${item.amount}`
          } if (item.limitType === '3') {
            item.dataValues.message = `Users Monthly Purchase Limit is $${item.amount}`
          }
        }
        if (type === 'BET') {
          if (item.limitType === '1') {
            item.dataValues.message = `Users Daily Play Limit is ${item.amount} SC`
          } if (item.limitType === '2') {
            item.dataValues.message = `Users Weekly Play Limit is ${item.amount} SC`
          } if (item.limitType === '3') {
            item.dataValues.message = `Users Monthly Play Limit is ${item.amount} SC`
          }
        }
        if (type === 'SELF_EXCLUSION') {
          item.dataValues.message = 'User is on Self Exclusion'
        }
        if (type === 'TIME_BREAK') {
          if (item.timeBreakDuration > moment()) {
            const userTimezone = timezone ? TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone.toUpperCase()] : 'Etc/GMT'
            const formatted = moment(item.timeBreakDuration).tz(userTimezone).format('MMMM Do YYYY [at] hh:mm A')
            item.dataValues.message = `User is on Time Break until ${formatted}`

            if (!groupedData[type]) groupedData[type] = []
            groupedData[type].push(item)
          }
          return // skip further processing for expired TIME_BREAK
        }
        // If the responsibleGamblingType doesn't exist in groupedData, create an empty array for it
        if (!groupedData[type]) {
          groupedData[type] = []
        }
        // Push the item into the appropriate group
        groupedData[type].push(item)
      })
      if (!groupedData) { return {} }
      // console.log('groupedData', groupedData)
      return { groupedData }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
