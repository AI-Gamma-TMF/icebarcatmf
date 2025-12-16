// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// import { sequelize } from '../../db/models'
// import timezone from 'dayjs/plugin/timezone'
// import ServiceBase from '../../libs/serviceBase'
// import { TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'

// dayjs.extend(utc)
// dayjs.extend(timezone)
// export class GetCRMPromotionGraphService extends ServiceBase {
//   async run () {
//     const { promocode, timezone, timeInterval = 'auto', unifiedUserSearch } = this.args

//     const { startDate, endDate } = this.calculateDates()

//     const graphInterval = this.getAssignedGraphInterval(timeInterval, startDate, endDate)

//     const data = await sequelize.query(
//       `
//         SELECT
//           CASE
//             WHEN :interval = '30-minutes' THEN date_trunc('hour', "timestamp") + FLOOR(EXTRACT(minute FROM "timestamp") / 30) * INTERVAL '30 minutes'
//             WHEN :interval = '3-days' THEN date_trunc('day', "timestamp") - ((EXTRACT(DAY FROM "timestamp")::int - 1) % 3) * INTERVAL '1 day'
//             WHEN :interval = '3-hours' THEN date_trunc('hour', "timestamp") - (EXTRACT(hour FROM "timestamp")::int % 3) * INTERVAL '1 hour'
//             WHEN :interval = '12-hours' THEN date_trunc('hour', "timestamp") - (EXTRACT(hour FROM "timestamp")::int % 12) * INTERVAL '1 hour'
//             ELSE date_trunc(:interval, "timestamp") END AS intervals,
//           SUM(sc_amount) AS "scAmount",
//           SUM(gc_amount) AS "gcAmount",
//           COUNT(*) AS "useCount"
//         WHERE
//           crm_promocode = false AND
//           deleted_at IS NULL AND
//           "timestamp" BETWEEN :startDate AND :endDate
//         GROUP BY intervals
//         ORDER BY intervals ASC
//       `,
//       {
//         replacements: {
//           interval: graphInterval,
//           promocode,
//           startDate,
//           endDate
//         },
//         type: sequelize.QueryTypes.SELECT
//       }
//     )
//   }

//   calculateDates () {
//     const { startDate = null, endDate = null, timezone: timezoneCode = 'UTC' } = this.args

//     const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezoneCode.toUpperCase()] || 'Etc/GMT'
//     const now = dayjs().tz(userTimezone)

//     const safeStart = startDate ? dayjs(startDate).tz(userTimezone).startOf('day') : now.subtract(1, 'week').startOf('day')
//     const safeEnd = endDate ? dayjs(endDate).tz(userTimezone).endOf('day') : now.endOf('day')

//     safeStart.setMinutes(Math.floor(safeStart.getMinutes() / 30) * 30, 0, 0)
//     safeEnd.setMinutes((Math.floor(safeEnd.getMinutes() / 30) * 30) + 30, 59, 999)

//     if (safeStart > safeEnd) return { startDate: null, endDate: null }

//     return {
//       startDate: safeStart.utc().toDate(),
//       endDate: safeEnd.utc().toDate()
//     }
//   }

//   getAssignedGraphInterval (timeInterval, startDate, endDate) {
//     if (timeInterval && timeInterval !== 'auto') return timeInterval
//     const ms = new Date(endDate) - new Date(startDate)
//     const totalMinutes = ms / (1000 * 60)
//     const totalPoints = 10

//     const idealBucketSize = totalMinutes / totalPoints

//     if (idealBucketSize <= 30) return '30-minutes'
//     if (idealBucketSize <= 60) return 'hour'
//     if (idealBucketSize <= 180) return '3-hours'
//     if (idealBucketSize <= 720) return '12-hours'
//     if (idealBucketSize <= 1440) return 'day'
//     if (idealBucketSize <= 4320) return '3-days'
//     if (idealBucketSize <= 10080) return 'week'
//     return 'month'
//   }
// }
