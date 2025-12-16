import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import redisClient from '../../libs/redisClient'
import { BONUS_TYPE } from '../../utils/constants/constant'
import { sequelize } from '../../db/models'
import { dateTimeUTCConversion } from '../../utils/common'
export class BonusGraphReportService extends ServiceBase {
  async run () {
    const { bonusType = ['all'], timeInterval = 'auto', startDate, endDate, timezone } = this.args
    const { cumulativeStartDate, cumulativeEndDate, liveStartDate, liveEndDate } = this.calculateDates(startDate, endDate, timezone)
    const internalUsers = await this.internalUsersCache()

    const [cumulativeData, liveData] = await Promise.all([
      cumulativeStartDate && cumulativeEndDate ? this.getBonusesCumulativeData(cumulativeStartDate, cumulativeEndDate, timeInterval, bonusType) : Promise.resolve([]),

      liveStartDate && liveEndDate ? this.getBonusesReportCumulativeLastHourData(liveStartDate, liveEndDate, internalUsers, timeInterval, bonusType) : Promise.resolve([])])

    // Normalize and merge
    const bonusGraphData = [...(Array.isArray(cumulativeData) ? cumulativeData : [cumulativeData]), ...(Array.isArray(liveData) ? liveData : [liveData])]

    return {
      success: true,
      dateFormat: this.dateFormat(timeInterval, startDate, endDate),
      message: SUCCESS_MSG.GET_SUCCESS,
      data: bonusGraphData
    }
  }

  // Bonuses Report Data
  async getBonusesCumulativeData (startDate, endDate, timeInterval, bonusType) {
    const graphInterval = this.resolveInterval(timeInterval, startDate, endDate)

    const filteredData = !bonusType.includes('all')

    const bonusData = await sequelize.query(`
      WITH expanded AS (
        SELECT CASE 
          WHEN :interval = '30-minutes' THEN date_trunc('hour', "timestamp") + FLOOR(EXTRACT(minute FROM "timestamp") / 30) * INTERVAL '30 minutes' 
          WHEN :interval = '3-days' THEN date_trunc('day', "timestamp") - ((EXTRACT(DAY FROM "timestamp")::int - 1) % 3) * INTERVAL '1 day'
          WHEN :interval = '3-hours' THEN date_trunc('hour', "timestamp") - (EXTRACT(hour FROM "timestamp")::int % 3) * INTERVAL '1 hour'
          WHEN :interval = '12-hours' THEN date_trunc('hour', "timestamp") - (EXTRACT(hour FROM "timestamp")::int % 12) * INTERVAL '1 hour'
          ELSE date_trunc(:interval, "timestamp") END AS intervals,
          entry.key AS bonus_type,
          (entry.value->>'scBonus')::numeric AS sc_bonus,
          (entry.value->>'gcBonus')::numeric AS gc_bonus,
          (entry.value->>'totalNoOfUsers')::int AS total_users
          
        FROM dashboard_reports dr
        CROSS JOIN LATERAL jsonb_each(dr.bonus_data) AS entry(key, value)
        WHERE dr."timestamp" BETWEEN :startDate AND :endDate
        ${filteredData ? 'AND entry.key = ANY(Array[:bonusTypes])' : ''}
      ),
      aggregated AS (
        SELECT intervals, bonus_type, SUM(sc_bonus) AS sc_bonus, SUM(gc_bonus) AS gc_bonus, SUM(total_users) AS total_users
        FROM expanded
        GROUP BY intervals, bonus_type
      )
      SELECT 
        intervals, jsonb_object_agg( bonus_type,
          jsonb_build_object(
            'scBonus', ROUND(sc_bonus::numeric, 2), 'gcBonus', ROUND(gc_bonus::numeric, 2), 'totalNoOfUsers', total_users)) AS "bonusData"
      FROM aggregated
      GROUP BY intervals
      ORDER BY intervals;`,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { startDate, endDate, interval: graphInterval, bonusTypes: filteredData ? bonusType : [] }
    })
    return bonusData
  }

  async getBonusesReportCumulativeLastHourData (startDate, endDate, internalUsers, timeInterval, bonusType) {
    if (startDate === null) return { bonusData: {} }
    let casinoTransactionQuery = ''
    let transactionDataQuery = ''
    casinoTransactionQuery = `AND user_id NOT IN (${internalUsers})`
    transactionDataQuery = `AND tb.actionee_id NOT IN (${internalUsers})`

    const graphInterval = this.resolveInterval(timeInterval, startDate, endDate)

    const [
      transactionBonus,
      casinoBonus,
      freeSpinData
    ] = await Promise.all([
      // Purchase Promocode Bonus
      sequelize.query(`
        SELECT
          -- 1) Purchase‐Promocode SC bonus (only non‐CRM promo, deposit‐type)
          ROUND(SUM(CASE WHEN tb.transaction_type = 'deposit' AND tb.promocode_id <> 0 AND pc.is_discount_on_amount = false AND pc.crm_promocode = false THEN tb.promocode_bonus_sc ELSE 0 END)::numeric, 2) AS "purchasePromocodeScBonus",
          -- 2) Purchase‐Promocode GC bonus (only non‐CRM promo, deposit‐type)
          ROUND(SUM(CASE WHEN tb.transaction_type = 'deposit' AND tb.promocode_id <> 0 AND pc.is_discount_on_amount = false AND pc.crm_promocode = false THEN tb.promocode_bonus_gc ELSE 0 END)::numeric, 2) AS "purchasePromocodeGcBonus",
          -- 3) Count of rows that availed a non‐CRM promo (deposit‐type)
          SUM(CASE WHEN tb.transaction_type = 'deposit' AND tb.promocode_id <> 0 AND pc.is_discount_on_amount = false AND pc.crm_promocode = false THEN 1 ELSE 0 END) AS "totalAvailedUsersPurchasePromocodeBonus",
          -- 4) CRM‐Promocode SC bonus (only CRM promo, deposit‐type)
          ROUND(SUM(CASE WHEN tb.transaction_type = 'deposit' AND tb.promocode_id <> 0 AND pc.is_discount_on_amount = false AND pc.crm_promocode = true THEN tb.promocode_bonus_sc ELSE 0 END)::numeric, 2) AS "crmPromocodeScBonus",
          -- 5) CRM‐Promocode GC bonus (only CRM promo, deposit‐type) 
          ROUND(SUM(CASE WHEN tb.transaction_type = 'deposit' AND tb.promocode_id <> 0 AND pc.is_discount_on_amount = false AND pc.crm_promocode = true THEN tb.promocode_bonus_gc ELSE 0 END)::numeric, 2) AS "crmPromocodeGcBonus",
          -- 6) Count of rows that availed a CRM promo (deposit‐type)
          SUM(CASE WHEN tb.transaction_type = 'deposit' AND tb.promocode_id <> 0 AND pc.is_discount_on_amount = false AND pc.crm_promocode = true THEN 1 ELSE 0 END) AS "totalAvailedUsersCRMPromocodeBonus",
          -- 7) Total package‐bonus SC (all deposit rows)
          TRUNC(SUM(CASE WHEN tb.transaction_type = 'deposit' THEN pkg.bonus_sc ELSE 0 END)::numeric, 2) AS "packageScBonus",
          -- 8) Total package‐bonus GC (all deposit rows)
          TRUNC(SUM(CASE WHEN tb.transaction_type = 'deposit' THEN pkg.bonus_gc ELSE 0 END)::numeric, 2) AS "packageGcBonus",
          -- 9) Count of all deposit rows (i.e. total package‐bonus availed)
          SUM(CASE WHEN tb.transaction_type = 'deposit' THEN 1 ELSE 0 END) AS "totalAvailedUsersPackageBonus",
          -- 10) Admin‐added SC bonus (all addSc rows)
          TRUNC(SUM(CASE WHEN tb.transaction_type = 'addSc' THEN tb.sc_coin ELSE 0 END)::numeric, 2) AS "adminAddedScBonus",
          -- 11) Count of all addSc rows
          SUM(CASE WHEN tb.transaction_type = 'addSc' THEN 1 ELSE 0 END) AS "totalAvailedUsersAdminAddedScBonus",
          -- 12) Interval
          CASE 
            WHEN :interval = '30-minutes' THEN date_trunc('hour', tb.updated_at) + FLOOR(EXTRACT(minute FROM tb.updated_at) / 30) * INTERVAL '30 minutes' 
            WHEN :interval = '3-days' THEN date_trunc('day', tb.updated_at) - ((EXTRACT(DAY FROM tb.updated_at)::int - 1) % 3) * INTERVAL '1 day'
            WHEN :interval = '3-hours' THEN date_trunc('hour', tb.updated_at) - (EXTRACT(hour FROM tb.updated_at)::int % 3) * INTERVAL '1 hour'
            WHEN :interval = '12-hours' THEN date_trunc('hour', tb.updated_at) - (EXTRACT(hour FROM tb.updated_at)::int % 12) * INTERVAL '1 hour'
          ELSE date_trunc(:interval, tb.updated_at) END AS "intervals"

        FROM public.transaction_bankings tb
          LEFT JOIN public.package pkg ON tb.package_id = pkg.package_id
          LEFT JOIN public.promo_codes pc ON tb.promocode_id = pc.promocode_id AND pc.is_discount_on_amount = false
        WHERE tb.status = 1 AND tb.is_success = true AND tb.updated_at BETWEEN :startDate AND :endDate AND ( tb.transaction_type = 'deposit' OR tb.transaction_type = 'addSc') ${transactionDataQuery}
        GROUP BY intervals
        ORDER BY intervals;
      `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          startDate,
          endDate,
          interval: graphInterval
        }
      }),
      // Casino Bonus Data
      sequelize.query(`
      WITH casinoBonus AS 
        (SELECT action_type AS bonus_type, TRUNC(SUM(sc)::numeric, 2) AS sc_amount, TRUNC(SUM(gc)::numeric, 2) AS gc_amount, COUNT(*) AS total_users,
          CASE 
            WHEN :interval = '30-minutes' THEN date_trunc('hour', created_at) + FLOOR(EXTRACT(minute FROM created_at) / 30) * INTERVAL '30 minutes' 
            WHEN :interval = '3-days' THEN date_trunc('day', created_at) - ((EXTRACT(DAY FROM created_at)::int - 1) % 3) * INTERVAL '1 day'
            WHEN :interval = '3-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 3) * INTERVAL '1 hour'
            WHEN :interval = '12-hours' THEN date_trunc('hour', created_at) - (EXTRACT(hour FROM created_at)::int % 12) * INTERVAL '1 hour'
          ELSE date_trunc(:interval, created_at) END AS intervals
        
          FROM public.casino_transactions
          WHERE created_at BETWEEN :startDate AND :endDate AND action_id = '1' AND action_type IN (:bonusTypes) AND status = 1 ${casinoTransactionQuery}
          GROUP BY action_type, intervals
          ORDER BY intervals)

      SELECT jsonb_object_agg(bonus_type, jsonb_build_object('scBonus', sc_amount::numeric, 'gcBonus', gc_amount::numeric, 'totalNoOfUsers', total_users::int)) AS "casinoBonusData", intervals FROM casinoBonus
      GROUP BY intervals
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          startDate,
          endDate,
          bonusTypes: Object.values(BONUS_TYPE),
          interval: graphInterval
        }
      }),
      // freeSpin Bonus Data
      sequelize.query(`SELECT 
               COUNT(*) AS "totalUsers",
               ROUND(SUM(sc_amount)::numeric, 2) AS "scAmount",
               ROUND(SUM(gc_amount)::numeric, 2) AS "gcAmount"
               FROM public.user_bonus 
               WHERE updated_at BETWEEN :startDate AND :endDate AND 
               bonus_type = 'free-spin-bonus' AND 
               status = 'CLAIMED'`, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          startDate,
          endDate
        }
      })
    ])

    const { purchasePromocodeScBonus, purchasePromocodeGcBonus, totalAvailedUsersPurchasePromocodeBonus, crmPromocodeScBonus, crmPromocodeGcBonus, totalAvailedUsersCRMPromocodeBonus, packageScBonus, packageGcBonus, totalAvailedUsersPackageBonus, adminAddedScBonus, totalAvailedUsersAdminAddedScBonus, intervals: tbIntervals } = [transactionBonus]

    const casinoBonusData = casinoBonus[0]?.casinoBonusData
    const intervals = casinoBonus[0]?.intervals || tbIntervals || startDate
    // Bonus Report Data

    const bonusData = {
      amoeBonus: {
        scBonus: casinoBonusData?.['amoe-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['amoe-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['amoe-bonus']?.totalNoOfUsers || 0
      },
      tierBonus: {
        scBonus: casinoBonusData?.['tier-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['tier-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['tier-bonus']?.totalNoOfUsers || 0
      },
      dailyBonus: {
        scBonus: casinoBonusData?.['daily-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['daily-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['daily-bonus']?.totalNoOfUsers || 0
      },
      packageBonus: {
        scBonus: +packageScBonus || 0,
        gcBonus: +packageGcBonus || 0,
        totalNoOfUsers: +totalAvailedUsersPackageBonus || 0
      },
      rafflePayout: {
        scBonus: casinoBonusData?.['raffle-payout']?.scBonus || 0,
        gcBonus: casinoBonusData?.['raffle-payout']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['raffle-payout']?.totalNoOfUsers || 0
      },
      welcomeBonus: {
        scBonus: casinoBonusData?.['welcome bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['welcome bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['welcome bonus']?.totalNoOfUsers || 0
      },
      jackpotWinner: {
        scBonus: casinoBonusData?.jackpotWinner?.scBonus || 0,
        gcBonus: casinoBonusData?.jackpotWinner?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.jackpotWinner?.totalNoOfUsers || 0
      },
      providerBonus: {
        scBonus: casinoBonusData?.['provider-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['provider-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['provider-bonus']?.totalNoOfUsers || 0
      },
      referralBonus: {
        scBonus: casinoBonusData?.['referral-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['referral-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['referral-bonus']?.totalNoOfUsers || 0
      },
      affiliateBonus: {
        scBonus: casinoBonusData?.['affiliate-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['affiliate-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['affiliate-bonus']?.totalNoOfUsers || 0
      },
      promotionBonus: {
        scBonus: casinoBonusData?.['promotion-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['promotion-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['promotion-bonus']?.totalNoOfUsers || 0
      },
      weeklyTierBonus: {
        scBonus: casinoBonusData?.['weekly-tier-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['weekly-tier-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['weekly-tier-bonus']?.totalNoOfUsers || 0
      },
      monthlyTierBonus: {
        scBonus: casinoBonusData?.['monthly-tier-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['monthly-tier-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['monthly-tier-bonus']?.totalNoOfUsers || 0
      },
      tournamentWinner: {
        scBonus: casinoBonusData?.tournament?.scBonus || 0,
        gcBonus: casinoBonusData?.tournament?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.tournament?.totalNoOfUsers || 0
      },
      adminAddedScBonus: {
        scBonus: +adminAddedScBonus || 0,
        gcBonus: 0,
        totalNoOfUsers: +totalAvailedUsersAdminAddedScBonus || 0
      },
      crmPromocodeBonus: {
        scBonus: crmPromocodeScBonus || 0,
        gcBonus: crmPromocodeGcBonus || 0,
        totalNoOfUsers: +totalAvailedUsersCRMPromocodeBonus || 0
      },
      purchasePromocodeBonus: {
        scBonus: purchasePromocodeScBonus || 0,
        gcBonus: purchasePromocodeGcBonus || 0,
        totalNoOfUsers: +totalAvailedUsersPurchasePromocodeBonus || 0
      },
      scratchCardBonus: {
        scBonus: casinoBonusData?.['scratch-card-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['scratch-card-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['scratch-card-bonus']?.totalNoOfUsers || 0
      },
      vipQuestionnaireBonus: {
        scBonus: casinoBonusData?.['vip-questionnaire-bonus']?.scBonus || 0,
        gcBonus: casinoBonusData?.['vip-questionnaire-bonus']?.gcBonus || 0,
        totalNoOfUsers: casinoBonusData?.['vip-questionnaire-bonus']?.totalNoOfUsers || 0
      },
      freeSpinBonus: {
        scBonus: freeSpinData?.scAmount || 0,
        gcBonus: freeSpinData?.gcAmount || 0,
        totalNoOfUsers: freeSpinData?.totalUsers || 0
      }
    }
    return { intervals, bonusData: this.getFilteredBonusData(bonusData, bonusType) }
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

  async internalUsersCache () {
    const {
      dbModels: {
        User: UserModel
      }
    } = this.context

    const { client } = redisClient

    const internalUsers = await client.get('internalUsers')

    if (internalUsers) return JSON.parse(internalUsers)

    const internalUsersArray = (await UserModel.findAll({ where: { isInternalUser: true }, attributes: ['userId'] })).map(obj => { return obj.userId })

    if (internalUsersArray.length === 0) internalUsersArray.push('-1') // For Fail Safety
    await client.set('internalUsers', JSON.stringify(internalUsersArray))

    return internalUsersArray
  }

  calculateDates (localStartDate, localEndDate, timezone) {
    const { startDate, endDate } = dateTimeUTCConversion(localStartDate, localEndDate, timezone)

    const now = new Date()

    const latestCumulative = new Date(now)
    latestCumulative.setUTCMinutes(latestCumulative.getUTCMinutes() - latestCumulative.getUTCMinutes() % 30, 0, 0)

    const bufferMs = 5 * 60 * 1000 // 5-minute buffer

    if ((now - latestCumulative) < bufferMs) {
      // Not enough buffer, step back 30 minutes
      latestCumulative.setUTCMinutes(latestCumulative.getUTCMinutes() - 30)
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Invalid input dates or reversed range
    if (isNaN(start) || isNaN(end) || start > end) {
      return {
        cumulativeStartDate: null,
        cumulativeEndDate: null,
        liveStartDate: null,
        liveEndDate: null
      }
    }

    // Case 1: All data is cumulative
    if (end <= latestCumulative) {
      return {
        cumulativeStartDate: start.toISOString(),
        cumulativeEndDate: end.toISOString(),
        liveStartDate: null,
        liveEndDate: null
      }
    }

    // Case 2: All data is live
    if (start > latestCumulative) {
      return {
        cumulativeStartDate: null,
        cumulativeEndDate: null,
        liveStartDate: start.toISOString(),
        liveEndDate: end.toISOString()
      }
    }

    // Case 3: Overlapping range
    const liveStartDate = new Date(latestCumulative.getTime())
    liveStartDate.setUTCSeconds(liveStartDate.getUTCSeconds() + 1, 0, 0)
    return {
      cumulativeStartDate: start.toISOString(),
      cumulativeEndDate: latestCumulative.toISOString(),
      liveStartDate: liveStartDate.toISOString(),
      liveEndDate: end.toISOString()
    }
  }
}
