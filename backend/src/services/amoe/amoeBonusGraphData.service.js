import ajv from '../../libs/ajv'
import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { AMOE_BONUS_STATUS, TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    timezone: { type: 'string' }
  },
  required: ['timezone', 'startDate', 'endDate']
}

const constraints = ajv.compile(schema)

export class AmoeBonusGraphDataService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Amoe: AmoeModel }
    } = this.context

    try {
      let { startDate, endDate, timezone } = this.args

      startDate = new Date(startDate)
      endDate = new Date(endDate)
      endDate.setHours(23, 59, 59, 999)

      // date conversion for the specified timezone
      const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone] || 'UTC'
      const timezoneConversion = `TO_CHAR(registered_date AT TIME ZONE '${userTimezone}', 'YYYY-MM-DD')`
      const scannedDateConversion = `TO_CHAR(scanned_date AT TIME ZONE '${userTimezone}', 'YYYY-MM-DD')`

      const [totalClaimedDetails, scannedDetails, registeredDetails] = await Promise.all([
        // Total claimed details
        AmoeModel.findOne({
          attributes: [
            [Sequelize.fn('SUM', Sequelize.cast(Sequelize.json('more_details.gcAmount'), 'NUMERIC')), 'totalGcAmountClaimed'],
            [Sequelize.fn('SUM', Sequelize.cast(Sequelize.json('more_details.scAmount'), 'NUMERIC')), 'totalScAmountClaimed'],
            [Sequelize.fn('COUNT', Sequelize.col('amoe_id')), 'totalClaimedCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), 'uniqueUserCount']
          ],
          where: { status: AMOE_BONUS_STATUS.SUCCESS },
          raw: true
        }),

        // Scanned details grouped by scanned date
        AmoeModel.findAll({
          attributes: [
            [Sequelize.literal(scannedDateConversion), 'scannedDate'],
            [Sequelize.fn('COUNT', Sequelize.col('scanned_date')), 'count']
          ],
          where: {
            scannedDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          group: [Sequelize.literal(scannedDateConversion)],
          order: [[Sequelize.literal(scannedDateConversion), 'ASC']]
        }),

        // Claimed details grouped by claimed date
        AmoeModel.findAll({
          attributes: [
            [Sequelize.literal(timezoneConversion), 'registeredDate'],
            [Sequelize.fn('COUNT', Sequelize.col('registered_date')), 'count']
          ],
          where: {
            status: AMOE_BONUS_STATUS.SUCCESS,
            createdAt: {
              [Op.between]: [startDate, endDate]
            }
          },
          group: [Sequelize.literal(timezoneConversion)],
          order: [[Sequelize.literal(timezoneConversion), 'ASC']]
        })
      ])

      return { totalClaimedDetails, scannedDetails, registeredDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.error('Error in AmoeBonusGraphDataService:', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
