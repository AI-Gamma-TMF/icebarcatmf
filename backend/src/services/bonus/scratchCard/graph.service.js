import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { BONUS_TYPE } from '../../../utils/constants/constant'
import { sequelize } from '../../../db/models'
export class ScratchCardBonusGraphReportService extends ServiceBase {
  async run () {
    const { timeInterval, startDate, endDate, scratchCardId = ['all'] } = this.args

    const liveData = await this.getBonusesReportCumulativeLastHourData(startDate, endDate, timeInterval, scratchCardId)

    // Normalize and merge
    const bonusGraphData = [...(Array.isArray(liveData) ? liveData : [liveData])]

    const [bonusSummary] = await sequelize.query(`
      SELECT 
        ROUND(SUM(CASE 
          WHEN status = 'CLAIMED' AND bonus_type = 'scratch-card-bonus' 
          THEN sc_amount::numeric ELSE 0 END), 2)::double precision AS "totalClaimedScBonus",
    
        ROUND(SUM(CASE 
          WHEN status = 'CLAIMED' AND bonus_type = 'scratch-card-bonus' 
          THEN gc_amount::numeric ELSE 0 END), 2)::double precision AS "totalClaimedGcBonus",
    
        ROUND(SUM(CASE 
          WHEN status = 'PENDING' AND bonus_type = 'scratch-card-bonus' 
          THEN gc_amount::numeric ELSE 0 END), 2)::double precision AS "pendingToClaimGcBonus",
    
        ROUND(SUM(CASE 
          WHEN status = 'PENDING' AND bonus_type = 'scratch-card-bonus' 
          THEN sc_amount::numeric ELSE 0 END), 2)::double precision AS "pendingToClaimScBonus"
    
      FROM user_bonus
    `)

    return {
      success: true,
      dateFormat: this.dateFormat(timeInterval, startDate, endDate),
      message: SUCCESS_MSG.GET_SUCCESS,
      totalClaimedScBonus: bonusSummary[0].totalClaimedScBonus,
      totalClaimedGcBonus: bonusSummary[0].totalClaimedGcBonus,
      pendingToClaimGcBonus: bonusSummary[0].pendingToClaimGcBonus,
      pendingToClaimScBonus: bonusSummary[0].pendingToClaimScBonus,
      data: bonusGraphData
    }
  }

  // Bonuses Report Data
  async getBonusesReportCumulativeLastHourData (startDate, endDate, timeInterval, scratchCardId) {
    if (startDate === null) return { bonusData: {} }
    let scratchCardCheckQuery = ''
    if (!scratchCardId.includes('all')) scratchCardCheckQuery = `AND (more_details->>'scratchCardId')::int = ANY(ARRAY[${scratchCardId}])`
    const graphInterval = this.resolveInterval(timeInterval, startDate, endDate)
    const casinoBonus = await sequelize.query(`
      WITH casinoBonus AS
        (SELECT action_type AS bonus_type, TRUNC(SUM(sc)::numeric, 2) AS sc_amount, TRUNC(SUM(gc)::numeric, 2) AS gc_amount, COUNT(*) AS total_users,
          CASE
            WHEN :interval = '30-minutes' THEN date_trunc('hour', created_at) + FLOOR(EXTRACT(minute FROM created_at) / 30) * INTERVAL '30 minutes'
            WHEN :interval = '3-days' THEN date_trunc('day', created_at) - ((EXTRACT(DAY FROM created_at)::int - 1) % 3) * INTERVAL '1 day'
            WHEN :interval = '3-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 3) * INTERVAL '1 hour'
            WHEN :interval = '12-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 12) * INTERVAL '1 hour'
          ELSE date_trunc(:interval, created_at) END AS intervals

          FROM public.casino_transactions
          WHERE created_at BETWEEN :startDate AND :endDate AND action_id = '1' AND action_type IN (:bonusTypes) AND status = 1 ${scratchCardCheckQuery}
          GROUP BY action_type, intervals
          ORDER BY intervals)

      SELECT jsonb_object_agg(bonus_type, jsonb_build_object('scBonus', sc_amount::numeric, 'gcBonus', gc_amount::numeric, 'totalNoOfUsers', total_users::int)) AS "casinoBonusData", intervals FROM casinoBonus
      GROUP BY intervals
    `, {
      type: sequelize.QueryTypes.SELECT,
      replacements: {
        startDate,
        endDate,
        bonusTypes: BONUS_TYPE.SCRATCH_CARD_BONUS,
        interval: graphInterval
      }
    })

    return casinoBonus
  }

  getAutoAssignedGraphInterval (startDate, endDate) {
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

  resolveInterval (requestedInterval, startDate, endDate) {
    if (requestedInterval && requestedInterval !== 'auto') return requestedInterval
    return this.getAutoAssignedGraphInterval(startDate, endDate)
  }

  dateFormat (timeInterval, startDate, endDate) {
    const graphInterval = this.resolveInterval(timeInterval, startDate, endDate)
    let dateFormat
    if (['30-minutes', 'hour', '3-hours', '12-hours'].includes(graphInterval)) dateFormat = 'hh:mm'
    else if (['day', '3-days', 'week'].includes(graphInterval)) dateFormat = 'MM-DD'
    else dateFormat = 'YY-MM'
    return dateFormat
  }

  getFilteredBonusData (bonusData, bonusTypes) {
    if (bonusTypes.includes('all')) {
      return bonusData
    }
    const filtered = {}
    for (const type of bonusTypes) {
      if (bonusData[type]) filtered[type] = bonusData[type]
    }
    return filtered
  }
}
