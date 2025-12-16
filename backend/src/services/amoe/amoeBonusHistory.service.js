import ajv from '../../libs/ajv'
import { Op } from 'sequelize'
import { Sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getCachedData, pageValidation } from '../../utils/common'
import { AMOE_BONUS_STATUS, TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    email: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    scannedDate: { type: ['string', 'null'] },
    timezone: { type: ['string', 'null'] },
    status: { type: ['string', 'null'] },
    entryId: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class AmoeBonusHistoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        Amoe: AmoeModel
      }
    } = this.context
    try {
      let { startDate, endDate, pageNo, limit, email, scannedDate, timezone, status, entryId } = this.args
      let query = {}

      const { page, size } = pageValidation(pageNo, limit)

      const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone] || 'UTC'
      const timezoneConversion = `TO_CHAR(scanned_date AT TIME ZONE '${userTimezone}', 'YYYY-MM-DD')`
      if (timezone && (startDate || endDate)) {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        endDate.setHours(23, 59, 59, 999)

        query = {
          ...query,
          status: AMOE_BONUS_STATUS.SUCCESS,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      }

      if (email) query = { ...query, email: { [Op.iLike]: `%${email}%` } }

      if (scannedDate) {
        const scannedStart = new Date(scannedDate)
        const scannedEnd = new Date(scannedDate)
        scannedEnd.setHours(23, 59, 59, 999)
        query.scannedDate = { [Op.between]: [scannedStart, scannedEnd] }
      }

      if (email) query.email = { [Op.iLike]: `%${email}%` }

      if (entryId) query.entryId = { [Op.iLike]: `%${entryId}%` }

      if (+status) query = { ...query, status: +status }

      const amoeBonusHistory = await AmoeModel.findAndCountAll({
        where: { ...query },
        offset: (page - 1) * size,
        limit: size,
        attributes: ['userId', 'email', 'entryId', 'status', 'scannedDate', 'createdAt', 'registeredDate',
          [
            Sequelize.json('more_details.gcAmount'),
            'gcAmount'
          ],
          [
            Sequelize.json('more_details.scAmount'),
            'scAmount'
          ],
          [Sequelize.literal(timezoneConversion), 'formattedScannedDate'],
          'remark'
        ],
        order: [['createdAt', 'DESC']]
      })

      const amoeBonusTime = await getCachedData('amoe-global-setting-data')

      if (amoeBonusTime) {
        const { AMOE_BONUS_TIME } = JSON.parse(amoeBonusTime)
        amoeBonusHistory.amoeBonusTime = AMOE_BONUS_TIME
      } else {
        amoeBonusHistory.amoeBonusTime = null
      }

      return { amoeBonusHistory, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
