import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/models'
import timezone from 'dayjs/plugin/timezone'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'

dayjs.extend(utc)
dayjs.extend(timezone)
export class GetAffiliateGraphService extends ServiceBase {
  async run () {
    const { timeInterval = 'auto' } = this.args

    const { startDate, endDate } = this.calculateDates()

    const graphInterval = this.getAssignedGraphInterval(timeInterval, startDate, endDate)

    const data = await sequelize.query(`
      SELECT CASE 
        WHEN :interval = '30-minutes' THEN date_trunc('hour', "claimed_at") + FLOOR(EXTRACT(minute FROM "claimed_at") / 30) * INTERVAL '30 minutes' 
        WHEN :interval = '3-days' THEN date_trunc('day', "claimed_at") - ((EXTRACT(DAY FROM "claimed_at")::int - 1) % 3) * INTERVAL '1 day'
        WHEN :interval = '3-hours' THEN date_trunc('hour', "claimed_at") - (EXTRACT(hour FROM "claimed_at")::int % 3) * INTERVAL '1 hour'
        WHEN :interval = '12-hours' THEN date_trunc('hour', "claimed_at") - (EXTRACT(hour FROM "claimed_at")::int % 12) * INTERVAL '1 hour'
        ELSE date_trunc(:interval, "claimed_at") END AS intervals,
      SUM(sc_amount) AS "scBonus",
      SUM(gc_amount) AS "gcBonus"
      FROM user_bonus
      WHERE
        bonus_type = 'affiliate-bonus'
        AND claimed_at IS NOT NULL
        AND claimed_at BETWEEN :startDate AND :endDate
      GROUP BY intervals ORDER BY intervals DESC`, {
      replacements: {
        interval: graphInterval,
        startDate,
        endDate
      },
      type: QueryTypes.SELECT
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      dateFormat: this.dateFormat(timeInterval, startDate, endDate),
      data
    }
  }

  calculateDates () {
    const { startDate = null, endDate = null, timezone: timezoneCode = 'UTC' } = this.args
    const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezoneCode.toUpperCase()] || 'Etc/GMT'

    const now = dayjs().tz(userTimezone)

    const safeStart = startDate ? dayjs(startDate).tz(userTimezone).startOf('day') : now.subtract(6, 'month').startOf('day')
    const safeEnd = endDate ? dayjs(endDate).tz(userTimezone).endOf('day') : now.endOf('day')

    return {
      startDate: safeStart.utc().toDate(),
      endDate: safeEnd.utc().toDate()
    }
  }

  getAssignedGraphInterval (timeInterval, startDate, endDate) {
    if (timeInterval && timeInterval !== 'auto') return timeInterval
    const ms = new Date(endDate) - new Date(startDate)
    const totalMinutes = ms / (1000 * 60)
    const totalPoints = 10

    const idealBucketSize = totalMinutes / totalPoints

    if (idealBucketSize <= 30) return '30-minutes'
    if (idealBucketSize <= 60) return 'hour'
    if (idealBucketSize <= 180) return '3-hours'
    if (idealBucketSize <= 720) return '12-hours'
    if (idealBucketSize <= 1440) return 'day'
    if (idealBucketSize <= 4320) return '3-days'
    if (idealBucketSize <= 10080) return 'week'
    return 'month'
  }

  dateFormat (timeInterval, startDate, endDate) {
    const graphInterval = this.getAssignedGraphInterval(timeInterval, startDate, endDate)
    let dateFormat
    if (['30-minutes', 'hour', '3-hours', '12-hours'].includes(graphInterval)) dateFormat = 'hh:mm'
    else if (['day', '3-days', 'week'].includes(graphInterval)) dateFormat = 'MM-DD'
    else dateFormat = 'YY-MM'
    return dateFormat
  }
}
