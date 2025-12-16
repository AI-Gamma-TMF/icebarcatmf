
import config from '../../configs/app.config'
import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { isDateValid } from '../../utils/common'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'

export class ScaleoTransactionalActivityService extends ServiceBase {
  async run () {
    let { date_start: startDate, date_end: endDate, api_key: apiKey, perpage: perPage, page, type } = this.args
    let actionTypes = []
    let isFirstDeposit = 'FALSE'
    if (!startDate || !endDate) {
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      startDate.setMonth(startDate.getMonth() - 3)
      endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
    }
    if (!type) {
      actionTypes = [TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.WITHDRAW]
      type = ['dep', 'wdr']
    } else {
      const actionType = type.split(',')
      if (actionType.includes('dep')) actionTypes.push(TRANSACTION_TYPE.DEPOSIT)
      if (actionType.includes('wdr')) actionTypes.push(TRANSACTION_TYPE.WITHDRAW)
      if (actionType.includes('ftd')) {
        isFirstDeposit = 'TRUE'
        actionTypes.push(TRANSACTION_TYPE.DEPOSIT)
      }
    }

    if (apiKey !== config.get('scaleo.api_key')) return this.addError('ApiKeyNotCorrectErrorType')

    if (!isDateValid(startDate) && !isDateValid(endDate)) return this.addError('InvalidDateErrorType')
    if (new Date(startDate) >= new Date(endDate)) return this.addError('InvalidDateErrorType')

    const resolvedPerPage = perPage ? parseInt(perPage, 10) : 0
    const resolvedPage = page ? parseInt(page, 10) : 1
    const offset = resolvedPerPage ? (resolvedPage - 1) * resolvedPerPage : null

    const combinedTransactions = await sequelize.query(`
      SELECT 
          u.user_id AS "player_id",
          NULL AS "event_id",
          REPLACE(CAST(u.affiliate_code AS TEXT), '-', '') AS "click_id",
          'reg' AS "type",
          'USD' AS "currency",
          TO_CHAR(u.created_at, :timeFormat) AS "timestamp",
          0 AS "amount"
      FROM 
          users u
      WHERE 
          u.is_active = TRUE
          AND u.affiliate_code IS NOT NULL
          AND u.affiliate_id IS NOT NULL
          AND u.is_internal_user = FALSE
          AND u.created_at BETWEEN :startDate AND :endDate
          ${!type || type.includes('reg') ? '' : 'AND 1=0'}
    
      UNION ALL
    
      SELECT
          c.actionee_id AS "player_id",
          transaction_id AS "event_id",
          REPLACE(CAST(u.affiliate_code AS TEXT), '-', '') AS "click_id",
          CASE
          ${type.includes('ftd') ? "WHEN c.is_first_deposit = :isFirstDeposit THEN 'ftd'" : ''}
          ${type.includes('dep') ? "WHEN c.transaction_type = :depositAction THEN 'dep'" : ''}
          ${type.includes('wdr') ? "WHEN c.transaction_type = :redeemAction THEN 'wdr'" : ''}
          ${type.includes('reg') ? "WHEN c.transaction_type = 'test' THEN 'reg'" : ''}
          END AS "type",
          'USD' AS "currency",
          TO_CHAR(c.updated_at, :timeFormat) AS "timestamp",
          SUM(c.amount) AS "amount"
      FROM 
          transaction_bankings c
      JOIN 
          users u 
      ON 
          c.actionee_id = u.user_id
      WHERE 
          u.is_active = TRUE
          AND u.affiliate_code IS NOT NULL
          AND u.affiliate_id IS NOT NULL
          AND u.is_internal_user = FALSE
          AND c.is_success = TRUE
          AND c.updated_at BETWEEN :startDate AND :endDate
          AND c.status = :status
          ${type.includes('dep') || type.includes('wdr') || type.includes('ftd') ? 'AND c.transaction_type IN (:transactionTypes)' : ''}
          ${!type || type.includes('ftd') || type.includes('dep') || type.includes('wdr') ? '' : 'AND 1=0'}
          ${isFirstDeposit === 'TRUE' ? 'AND c.is_first_deposit = true' : ''}
      GROUP BY 
          c.actionee_id, 
          CASE
              ${type.includes('ftd') ? "WHEN c.is_first_deposit = :isFirstDeposit THEN 'ftd'" : ''}
              ${type.includes('dep') ? "WHEN c.transaction_type = :depositAction THEN 'dep'" : ''}
              ${type.includes('wdr') ? "WHEN c.transaction_type = :redeemAction THEN 'wdr'" : ''}
              ${type.includes('reg') ? "WHEN c.transaction_type = 'test' THEN 'reg'" : ''}
          END,
          u.affiliate_code,
          u.created_at,
          c.updated_at,
          c.transaction_id
      ORDER BY 
          "player_id"
          ${resolvedPerPage ? 'LIMIT :perPage' : ''} 
          ${resolvedPerPage && offset !== null ? 'OFFSET :offset' : ''};
    `, {
      replacements: {
        startDate,
        endDate,
        transactionTypes: actionTypes || [],
        isFirstDeposit: isFirstDeposit,
        depositAction: TRANSACTION_TYPE.DEPOSIT,
        redeemAction: TRANSACTION_TYPE.WITHDRAW,
        status: TRANSACTION_STATUS.SUCCESS,
        perPage: resolvedPerPage,
        offset: offset,
        timeFormat: 'YYYY-MM-DD HH24:MI:SS'
      },
      type: sequelize.QueryTypes.SELECT
    })

    return {
      status: 'success',
      code: 200,
      data: { events: combinedTransactions }
    }
  }
}
