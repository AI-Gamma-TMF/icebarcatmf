import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Sequelize, sequelize } from '../../db/models'
import { divide, minus, round, times, plus } from 'number-precision'
import { calculateDate } from '../../utils/common'

export class GetProviderDashboardDataService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ProviderRate: ProviderRateModel
      }
    } = this.context

    const { masterCasinoProviderId, masterGameAggregatorId, timezone = 'PST', startDate, endDate } = this.args
    try {
      const whereConditions = []

      whereConditions.push('mcp.is_hidden = false')
      whereConditions.push('mga.is_hidden = false')

      if (masterCasinoProviderId) whereConditions.push(`mcp.master_casino_provider_id = ${+masterCasinoProviderId}`)

      if (masterGameAggregatorId) whereConditions.push(`mga.master_game_aggregator_id = ${+masterGameAggregatorId}`)

      const whereConditionSQL = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : ''

      const { cumulativeStartDate, cumulativeEndDate, liveStartDate, liveEndDate } = this.calculateDates(startDate, endDate, timezone)

      const providerStatsQuery = `
        WITH
          cumulative_data AS (
            SELECT
              mcg.master_casino_provider_id AS provider_id,
              SUM(cgs.total_bets) AS cumulative_bets,
              SUM(cgs.total_wins) AS cumulative_wins
            FROM casino_game_stats cgs
            INNER JOIN master_casino_games mcg
              ON cgs.game_id :: integer = mcg.master_casino_game_id :: integer
            WHERE 
              (:cumulativeStartDate IS NOT NULL AND :cumulativeEndDate IS NOT NULL)
              AND cgs.timestamp BETWEEN :cumulativeStartDate AND :cumulativeEndDate
            GROUP BY mcg.master_casino_provider_id
          ),

          live_data AS (
            SELECT
              mcg.master_casino_provider_id AS provider_id,
              SUM(CASE WHEN ct.action_type = 'bet' THEN ct.amount ELSE 0 END)::NUMERIC AS live_bets,
              SUM(CASE WHEN ct.action_type = 'win' THEN ct.amount ELSE 0 END)::NUMERIC AS live_wins
            FROM casino_transactions ct
            INNER JOIN master_casino_games mcg
              ON ct.game_id :: integer = mcg.master_casino_game_id :: integer
            WHERE
              (:liveStartDate IS NOT NULL AND :liveEndDate IS NOT NULL)
              AND ct.created_at BETWEEN :liveStartDate AND :liveEndDate
              AND ct.status = 1
              AND ct.amount_type = 1
              AND ct.action_type IN ('bet', 'win')
            GROUP BY mcg.master_casino_provider_id
          ),

          stats_by_provider AS (
            SELECT
              COALESCE(cd.provider_id, ld.provider_id) AS provider_id,
              COALESCE(cd.cumulative_bets, 0) + COALESCE(ld.live_bets, 0) AS total_bets,
              COALESCE(cd.cumulative_wins, 0) + COALESCE(ld.live_wins, 0) AS total_wins
            FROM cumulative_data cd
            FULL JOIN live_data ld ON cd.provider_id = ld.provider_id
          ),

          discount_data AS (
            SELECT
              mcg.master_casino_provider_id AS provider_id,
              AVG(gmd.discount_percentage) AS avg_discount_percentage
            FROM game_monthly_discount gmd
            INNER JOIN master_casino_games mcg
              ON gmd.master_casino_game_id :: integer = mcg.master_casino_game_id :: integer
            WHERE
              gmd.start_month_date >= :startDate
              AND gmd.end_month_date <= :endDate
            GROUP BY mcg.master_casino_provider_id
          )

          SELECT
            COALESCE(sbp.total_bets, 0) AS total_bets,
            COALESCE(sbp.total_wins, 0) AS total_wins,
            mcp.master_casino_provider_id AS "masterCasinoProviderId",
            mcp.name AS "masterCasinoProviderName",
            mga.name AS "masterGameAggregatorName",
            ROUND(COALESCE(dd.avg_discount_percentage, 0), 2) AS "avgDiscountPercentage"
          FROM stats_by_provider sbp
          INNER JOIN master_casino_providers mcp
            ON sbp.provider_id = mcp.master_casino_provider_id
          LEFT JOIN master_game_aggregators mga
            ON mcp.master_game_aggregator_id = mga.master_game_aggregator_id
          LEFT JOIN discount_data dd
            ON dd.provider_id = sbp.provider_id
          ${whereConditionSQL}
          ORDER BY sbp.total_bets DESC

      `

      const rtpVersionQuery = `
        SELECT DISTINCT ON (mcg.master_casino_provider_id)
          mcg.master_casino_provider_id AS "providerId",
          mcg.return_to_player AS "mostCommonRtp"
        FROM master_casino_games mcg
        INNER JOIN master_casino_providers mcp
          ON mcg.master_casino_provider_id = mcp.master_casino_provider_id
        WHERE
          mcg.is_active = true
          AND mcp.is_hidden = false
          AND mcg.return_to_player IS NOT NULL
        GROUP BY mcg.master_casino_provider_id, mcg.return_to_player
        ORDER BY mcg.master_casino_provider_id, COUNT(*) DESC
      `

      const [results, rtpVersion] = await Promise.all([
        sequelize.query(providerStatsQuery, {
          replacements: {
            cumulativeStartDate,
            cumulativeEndDate,
            liveStartDate,
            liveEndDate,
            startDate,
            endDate
          },
          type: Sequelize.QueryTypes.SELECT
        }),
        sequelize.query(rtpVersionQuery, {
          type: Sequelize.QueryTypes.SELECT
        })
      ])

      const providerIds = results.map(queryData => +queryData.masterCasinoProviderId)

      const providerRateDetail = await ProviderRateModel.findAll({
        where: {
          providerId: providerIds,
          deletedAt: null
        },
        raw: true
      })

      const rtpVersionMap = {}
      for (const row of rtpVersion) {
        rtpVersionMap[row.providerId] = row.mostCommonRtp
      }

      const rateMap = {}

      for (const rate of providerRateDetail) {
        if (!rateMap[rate.providerId]) {
          rateMap[rate.providerId] = []
        }

        rateMap[rate.providerId].push({
          ggrMinimum: Number(rate.ggrMinimum),
          ggrMaximum: rate.ggrMaximum,
          rate: Number(rate.rate)
        })
      }

      let finalOutput = []
      let totalGGRSum = 0
      let totalNGRSum = 0

      for (const provider of results) {
        const providerId = provider.masterCasinoProviderId

        const totalBets = Number(provider.total_bets) || 0
        const totalWins = Number(provider.total_wins) || 0

        const totalGGR = +round(+minus(totalBets, totalWins), 2)

        const discountPercentage = +provider.avgDiscountPercentage || 0

        const netGGR = +round(
          +minus(totalGGR, +divide(+times(totalGGR, discountPercentage), 100)),
          2
        )

        let rate = 0

        // sort the provider rates so that ggrMaximum null will come at last
        const ratesForProvider = (rateMap[providerId] || []).sort((a, b) => {
          if (a.ggrMaximum === null) return 1
          if (b.ggrMaximum === null) return -1
          return a.ggrMaximum - b.ggrMaximum
        })

        for (const rateRange of ratesForProvider) {
          if (totalGGR >= rateRange.ggrMinimum && (totalGGR <= rateRange.ggrMaximum || rateRange.ggrMaximum === null)) {
            rate = rateRange.rate
            break
          }
        }

        const totalNGR = +minus(totalGGR, +divide(+times(totalGGR, rate), 100))

        const actualRTP = totalBets > 0 ? +round(+times(+divide(totalWins, totalBets), 100), 2) : 0

        totalGGRSum = +plus(totalGGRSum, totalGGR)
        totalNGRSum = +plus(totalNGRSum, totalNGR)

        finalOutput.push({
          // masterCasinoProviderId: provider.masterCasinoProviderId,
          masterCasinoProviderName: provider.masterCasinoProviderName,
          masterGameAggregatorName: provider.masterGameAggregatorName,
          rate,
          totalGGR,
          totalNGR,
          rtpVersion: rtpVersionMap[providerId] || null,
          actualRTP,
          avgGgrDiscountPercentage: discountPercentage,
          netGGR
        })
      }

      let percentageTotalGGRSum = 0

      finalOutput = finalOutput.map(provider => {
        const percentageTotalGGR = totalGGRSum > 0
          ? +round(divide(times(provider.totalGGR, 100), totalGGRSum), 2)
          : 0

        percentageTotalGGRSum = +plus(percentageTotalGGRSum, percentageTotalGGR)

        return {
          ...provider,
          percentageTotalGGR
        }
      })

      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        data: {
          finalOutput,
          totalGGRSum,
          totalNGRSum,
          percentageTotalGGRSum
        }
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  calculateDates (payloadStartDate, payloadEndDate, timezone) {
    // convert date into UTC
    const { startDate = null, endDate = null } = calculateDate(payloadEndDate, payloadStartDate, timezone)

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
