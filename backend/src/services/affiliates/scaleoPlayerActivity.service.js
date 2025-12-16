
import config from '../../configs/app.config'
import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { isDateValid } from '../../utils/common'
import { ACTION, AMOUNT_TYPE, BONUS_TYPE, TRANSACTION_STATUS } from '../../utils/constants/constant'

export class ScaleoPlayerActivityService extends ServiceBase {
  async run () {
    let { date_start: startDate, date_end: endDate, api_key: apiKey, perpage: perPage, page, type } = this.args
    let actionTypes = []
    if (!type) {
      actionTypes = [ACTION.BET, ACTION.WIN, ...Object.values(BONUS_TYPE)]
    } else {
      // Parse and dynamically construct the `actionTypes` array based on input
      const actionType = type.split(',')
      if (actionType.includes('bet')) actionTypes.push(ACTION.BET)
      if (actionType.includes('win')) actionTypes.push(ACTION.WIN)
      if (actionType.includes('bon')) actionTypes = [...actionTypes, ...Object.values(BONUS_TYPE)]
    }

    if (apiKey !== config.get('scaleo.api_key')) return this.addError('ApiKeyNotCorrectErrorType')

    if (!startDate || !endDate) {
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      startDate.setMonth(startDate.getMonth() - 3)
      endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
    }

    if (!isDateValid(startDate) && !isDateValid(endDate)) return this.addError('InvalidDateErrorType')
    if (new Date(startDate) >= new Date(endDate)) return this.addError('InvalidDateErrorType')

    const resolvedPerPage = perPage ? parseInt(perPage, 10) : 0
    const resolvedPage = page ? parseInt(page, 10) : 1

    // Calculate offset only if pagination is applied
    const offset = resolvedPerPage ? (resolvedPage - 1) * resolvedPerPage : null
    const casinoTransactions = await sequelize.query(`
      SELECT
          c.user_id AS "player_id",
          REPLACE(CAST (u.affiliate_code AS TEXT), '-', '') AS "click_id",
          CASE WHEN c.action_type = :betAction THEN 'bet' WHEN c.action_type = :winAction THEN 'win' ELSE 'bon' END AS "type",
          ROUND(SUM(c.sc) :: NUMERIC, 2) AS "amount",
          COUNT(c.casino_transaction_id) AS "count",
          'casino' AS "product",
          'USD' AS currency,
          :startDate AS "hour"
      FROM 
          casino_transactions c
      JOIN 
          users u 
      ON 
          c.user_id = u.user_id
      WHERE 
          u.is_active = TRUE
          AND u.affiliate_code IS NOT NULL
          AND u.affiliate_id IS NOT NULL
          AND u.is_internal_user = FALSE
          AND c.updated_at BETWEEN :startDate AND :endDate
          AND c.action_type IN (:actionTypes)
          AND c.status = :status
          AND c.amount_type IN (:amountTypes)
      GROUP BY 
          c.user_id, 
          CASE
              WHEN c.action_type = :betAction THEN 'bet'
              WHEN c.action_type = :winAction THEN 'win'
              ELSE 'bon'
          END,
          u.affiliate_code
      ORDER BY 
          c.user_id
      ${resolvedPerPage ? 'LIMIT :perPage' : ''} 
      ${resolvedPerPage && offset !== null ? 'OFFSET :offset' : ''};
    `, {
      replacements: {
        startDate,
        endDate,
        actionTypes: actionTypes,
        betAction: ACTION.BET,
        winAction: ACTION.WIN,
        status: TRANSACTION_STATUS.SUCCESS,
        amountTypes: [AMOUNT_TYPE.SC_COIN, AMOUNT_TYPE.SC_GC_COIN],
        perPage: resolvedPerPage,
        offset: offset,
        timeFormat: 'YYYY-MM-DD HH24:MI:SS'
      },
      type: sequelize.QueryTypes.SELECT
    })

    return {
      status: 'success',
      code: 200,
      data: { events: casinoTransactions }
    }
  }
}
