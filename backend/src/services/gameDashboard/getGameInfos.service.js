
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { calculateDate, exportCenterAxiosCall, pageValidation } from '../../utils/common'
import { Sequelize, sequelize } from '../../db/models'
import { CSV_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    idSearch: { type: ['string', 'null'] },
    masterCasinoProviderId: { type: ['string', 'null'] },
    masterGameAggregatorId: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    timezone: { type: ['string', 'null'] },
    RTP: { type: ['string', 'null'] },
    RTPge: { type: ['string', 'null'] },
    RTPle: { type: ['string', 'null'] },
    csvDownload: { type: ['string', 'null'] },
    orderBy: {
      type: 'string',
      enum: [
        'total_bets',
        'total_wins',
        'total_rounds',
        'game_id',
        'ggr',
        'totalUniquePlayers',
        'masterCasinoProviderId',
        'masterCasinoGameName',
        'masterCasinoProviderName',
        'masterGameAggregatorId',
        'masterGameAggregatorName',
        'RTP',
        ''
      ]
    },
    sort: { type: 'string', enum: ['DESC', 'ASC', ''] }
  },
  required: ['limit', 'pageNo']
}
const constraints = ajv.compile(schema)

export class GetGameInfos extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    this.constraints(this.args)

    const {
      dbModels: {
        ExportCenter: ExportCenterModel
      }
    } = this.context

    const {
      limit, pageNo, idSearch, orderBy, sort, timezone = 'PST', startDate, endDate,
      masterCasinoProviderId, masterGameAggregatorId, RTP, RTPge, RTPle, csvDownload
    } = this.args

    let { page, size } = pageValidation(pageNo, limit)
    if (csvDownload) {
      page = null
      size = null
    }

    const whereConditions = []

    whereConditions.push('mcp.is_hidden = false')
    whereConditions.push('mga.is_hidden = false')

    if (idSearch) whereConditions.push(`sf.game_id = ${+idSearch}`)

    if (masterCasinoProviderId) whereConditions.push(`mcp.master_casino_provider_id = ${+masterCasinoProviderId}`)

    if (masterGameAggregatorId) whereConditions.push(`mga.master_game_aggregator_id = ${+masterGameAggregatorId}`)

    const whereConditionSQL = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : ''

    let order = 'ORDER BY sf.total_rounds DESC'

    if (orderBy === 'RTP') {
      order = `ORDER BY ROUND(CAST(CASE WHEN SUM(sf."total_bets") > 0 THEN ((SUM(sf."total_wins") / SUM(sf."total_bets")) * 100) ELSE 0 END AS NUMERIC), 2) ${sort || 'DESC'}`
    } else if (orderBy === 'total_wins') {
      order = `ORDER BY sf.total_wins ${sort || 'DESC'}`
    } else if (orderBy === 'total_bets') {
      order = `ORDER BY sf.total_bets ${sort || 'DESC'}`
    } else if (orderBy === 'game_id') {
      order = `ORDER BY sf.game_id ${sort || 'DESC'}`
    } else if (orderBy === 'ggr') {
      order = `ORDER BY ROUND(COALESCE(sf.total_bets, 0)::numeric - COALESCE(sf.total_wins, 0)::numeric, 2)  ${sort || 'DESC'}`
    }

    if (csvDownload === 'true') {
      const transaction = await sequelize.transaction()
      try {
        const { id } = this.context.req.body
        const exportTbl = await ExportCenterModel.create({ type: CSV_TYPE.GAME_DASHBOARD_CSV, adminUserId: id, payload: this.args }, { transaction })

        const axiosBody = {
          limit,
          pageNo,
          idSearch,
          order,
          orderBy,
          sort,
          startDate,
          endDate,
          timezone,
          masterCasinoProviderId,
          masterGameAggregatorId,
          RTP,
          RTPge,
          RTPle,
          whereConditionSQL,
          // these are must
          exportId: exportTbl.dataValues.id,
          exportType: exportTbl.dataValues.type,
          type: CSV_TYPE.GAME_DASHBOARD_CSV,
          adminUserId: id
        }

        await exportCenterAxiosCall(axiosBody)
        await transaction.commit()
        return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
      } catch (error) {
        await transaction.rollback()
        return this.addError('InternalServerErrorType', error)
      }
    }

    try {
      const { cumulativeStartDate, cumulativeEndDate, liveStartDate, liveEndDate } = this.calculateDates(startDate, endDate, timezone)

      let rtpQuery = ''
      const rtpExpr = `
      CASE
        WHEN (COALESCE(ca.cumulative_bets, 0) + COALESCE(la.live_bets, 0)) > 0 THEN
        ROUND(((COALESCE(ca.cumulative_wins, 0)::numeric + COALESCE(la.live_wins, 0)::numeric) / NULLIF((COALESCE(ca.cumulative_bets, 0)::numeric + COALESCE(la.live_bets, 0)::numeric), 0) * 100)::numeric, 2) ELSE 0 END`

      if (RTP !== undefined) rtpQuery = `WHERE ${rtpExpr} = ${+RTP}`
      else if (RTPge !== undefined) rtpQuery = `WHERE ${rtpExpr} >= ${+RTPge}`
      else if (RTPle !== undefined) rtpQuery = `WHERE ${rtpExpr} <= ${+RTPle}`

      const { gameDashboardData, footerTotals, totalCount } = await this.getGameDashboardCumulativeData(cumulativeStartDate, cumulativeEndDate, liveStartDate, liveEndDate, size, page, whereConditionSQL, rtpQuery, order, startDate, endDate)

      return {
        status: 200,
        message: SUCCESS_MSG.GET_SUCCESS,
        data: {
          footerTotals,
          games: {
            count: totalCount,
            rows: gameDashboardData ?? []
          }
        }
      }
    } catch (error) {
      console.error('Error fetching game dashboard data:', error)
      return this.addError('InternalServerErrorType', 'Something went wrong, please try again later.')
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

  async getGameDashboardCumulativeData (cumulativeStartDate, cumulativeEndDate, liveStartDate, liveEndDate, size, page, whereConditionSQL, rtpQuery, order, startDate, endDate) {
    const baseCTE = `
      WITH
        cumulative_data AS (
          SELECT
            game_id,
            SUM(total_bets)   AS cumulative_bets,
            SUM(total_wins)   AS cumulative_wins,
            SUM(total_rounds) AS cumulative_rounds
          FROM casino_game_stats
          WHERE
            (:cumulativeStartDate IS NOT NULL AND :cumulativeEndDate IS NOT NULL)
            AND timestamp BETWEEN :cumulativeStartDate AND :cumulativeEndDate
          GROUP BY game_id
        ),

        live_agg AS (
          SELECT
            ct.game_id::integer AS game_id,
            SUM(CASE WHEN ct.action_type='bet' THEN ct.amount ELSE 0 END)::numeric(18,2) AS live_bets,
            SUM(CASE WHEN ct.action_type='win' THEN ct.amount ELSE 0 END)::numeric(18,2) AS live_wins,
            COUNT(*) FILTER (WHERE ct.action_type='bet')  AS live_rounds
          FROM casino_transactions ct
          WHERE
            (:liveStartDate IS NOT NULL AND :liveEndDate IS NOT NULL)
            AND ct.created_at BETWEEN :liveStartDate AND :liveEndDate
            AND ct.status = 1
            AND ct.amount_type = 1
            AND ct.action_type IN ('bet','win')
          GROUP BY ct.game_id
        ),

        stats_filtered AS (
          SELECT
            COALESCE(ca.game_id, la.game_id) AS game_id,
            (COALESCE(ca.cumulative_bets,0) + COALESCE(la.live_bets,0))   AS total_bets,
            (COALESCE(ca.cumulative_wins,0) + COALESCE(la.live_wins,0))   AS total_wins,
            (COALESCE(ca.cumulative_rounds,0) + COALESCE(la.live_rounds,0)) AS total_rounds,
            CASE
              WHEN (COALESCE(ca.cumulative_bets,0) + COALESCE(la.live_bets,0)) > 0 THEN
                ROUND(((COALESCE(ca.cumulative_wins,0)::numeric + COALESCE(la.live_wins,0)::numeric) /
                NULLIF((COALESCE(ca.cumulative_bets,0)::numeric + COALESCE(la.live_bets,0)::numeric),0) * 100 )::numeric, 2)
              ELSE 0
            END AS rtp
          FROM cumulative_data ca
          FULL JOIN live_agg la USING (game_id)
          ${rtpQuery || ''}
        ), 

        game_discounts AS (
        SELECT
          gmd.master_casino_game_id AS game_id,
          gmd.discount_percentage
        FROM game_monthly_discount gmd
        WHERE
          gmd.start_month_date >= :startDate
          AND gmd.end_month_date <= :endDate
      )

    `

    const dataQuery = `
      ${baseCTE}
      SELECT
        sf.game_id                     AS "gameId",
        sf.total_bets,
        sf.total_wins,
        sf.total_rounds,
        ROUND(COALESCE(sf.total_bets, 0)::numeric - COALESCE(sf.total_wins, 0)::numeric, 2)  AS "ggr",
        mga.master_game_aggregator_id  AS "masterGameAggregatorId",
        mga.name                       AS "masterGameAggregatorName",
        mcp.master_casino_provider_id  AS "masterCasinoProviderId",
        mcp.name                       AS "masterCasinoProviderName",
        mcg.name                       AS "masterCasinoGameName",
        sf.rtp                         AS "RTP",
        mcg.return_to_player           AS "providerRTP",
        ROUND(
          (COALESCE(sf.total_bets, 0)::numeric - COALESCE(sf.total_wins, 0)::numeric) *
          (1 - COALESCE(gd.discount_percentage, 0) / 100),
          2
        ) AS "netGgr",
        gd.discount_percentage         AS "ggrDiscountPercentage"
      FROM stats_filtered sf
      LEFT JOIN master_casino_games mcg ON sf.game_id = mcg.master_casino_game_id
      LEFT JOIN master_casino_providers mcp ON mcg.master_casino_provider_id = mcp.master_casino_provider_id
      LEFT JOIN master_game_aggregators mga ON mcp.master_game_aggregator_id = mga.master_game_aggregator_id
      LEFT JOIN game_discounts gd ON gd.game_id = sf.game_id 
      ${whereConditionSQL}
      ${order}
      LIMIT :limit 
      OFFSET :offset
    `

    const footerTotalsQuery = `
      SELECT
        ROUND(COALESCE(SUM("total_bets")::numeric, 0), 2) AS "totalBetSum",
        ROUND(COALESCE(SUM("total_wins")::numeric, 0), 2) AS "totalWinSum",
        ROUND(COALESCE(SUM("ggr")::numeric, 0), 2)        AS "totalGGR",
        ROUND(COALESCE(SUM("RTP")::numeric, 0) / NULLIF(COUNT("RTP"), 0), 2)        AS "totalSystemRTP",
        ROUND(COALESCE(SUM("providerRTP")::numeric, 0) / NULLIF(COUNT("providerRTP"), 0), 2) AS "totalProviderRTP"
      FROM (
        ${dataQuery}
      ) AS paged
  `

    const countQuery = `
      ${baseCTE}
      SELECT COUNT(*) AS total_count FROM stats_filtered sf
      LEFT JOIN master_casino_games mcg ON sf.game_id = mcg.master_casino_game_id
      LEFT JOIN master_casino_providers mcp ON mcg.master_casino_provider_id = mcp.master_casino_provider_id
      LEFT JOIN master_game_aggregators mga ON mcp.master_game_aggregator_id = mga.master_game_aggregator_id
      LEFT JOIN game_discounts gd ON gd.game_id = sf.game_id
      ${whereConditionSQL}
    `

    const replacements = {
      cumulativeStartDate,
      cumulativeEndDate,
      liveStartDate,
      liveEndDate,
      startDate,
      endDate,
      limit: size,
      offset: (page - 1) * size
    }

    const [data, [footerTotals], [countResult]] = await Promise.all([
      sequelize.query(dataQuery, { replacements, type: Sequelize.QueryTypes.SELECT }),
      sequelize.query(footerTotalsQuery, { replacements, type: Sequelize.QueryTypes.SELECT }),
      sequelize.query(countQuery, { replacements, type: Sequelize.QueryTypes.SELECT })
    ])

    return {
      gameDashboardData: data,
      footerTotals,
      totalCount: Number(countResult.total_count || 0)
    }
  }
}
