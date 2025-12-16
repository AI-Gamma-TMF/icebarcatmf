import { Op, Sequelize } from 'sequelize'
import { sequelize } from '../../../db/models'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'
import {
  pageValidation,
  filterByNameEmailGroup
} from '../../../utils/common'

export class GetAdminCreditCoinsService extends ServiceBase {
  async run () {
    const {
      dbModels: { TransactionBanking: TransactionBankingModel, AdminUser }
    } = this.context

    const { pageNo, limit, orderBy, sort, search } = this.args
    let query = {}

    try {
      if (search) {
        query = {
          ...query,
          [Op.and]: [
            {
              [Op.or]: [
                Sequelize.where(
                  Sequelize.fn(
                    'concat',
                    Sequelize.col('first_name'),
                    ' ',
                    Sequelize.col('last_name'),
                    ' ',
                    Sequelize.col('email'),
                    ' ',
                    Sequelize.col('group')
                  ),
                  {
                    [Op.iLike]: `%${search}%`
                  }
                ),
                { email: { [Op.iLike]: `%${search}%` } }
              ]
            }
          ]
        }
      }
      if (search) {
        query = filterByNameEmailGroup(query, search)
      }

      const { page, size } = pageValidation(pageNo, limit)
      const orderFields = ['totalScAdded', 'totalScRemoved']
      const orderByFixed = orderFields.includes(orderBy) ? sequelize.literal(`"${orderBy}"`) : orderBy

      const rawQuery = `
                        WITH highest_sc AS (
                        SELECT 
                            (tb.more_details->>'adminUserId')::INTEGER AS admin_id,  
                            'highestSc' AS source,
                            SUM(CAST(tb.amount AS DECIMAL(38,2))) AS amount,
                            MAX(tb.created_at) AS created_at,
                            'addSc' AS transaction_type,
                            NULL::TEXT AS reason 
                        FROM transaction_bankings tb
                        WHERE tb.transaction_type = 'addSc'
                            AND tb.status = 1 
                            AND tb.is_success = true
                        GROUP BY admin_id
                        ORDER BY amount DESC
                        LIMIT 1
                    ),
                    highest_gc AS (
                        SELECT 
                            (tb.more_details->>'adminUserId')::INTEGER AS admin_id,  
                            'highestGc' AS source,
                            SUM(CAST(tb.amount AS DECIMAL(38,2))) AS amount,
                            MAX(tb.created_at) AS created_at,
                            'addGc' AS transaction_type,
                            NULL::TEXT AS reason 
                        FROM transaction_bankings tb
                        WHERE tb.transaction_type = 'addGc'
                            AND tb.status = 1 
                            AND tb.is_success = true
                        GROUP BY admin_id
                        ORDER BY amount DESC
                        LIMIT 1
                    ),
                    recent_transaction AS (
                        SELECT 
                            (tb.more_details->>'adminUserId')::INTEGER AS admin_id,  
                            'mostRecent' AS source,
                            CAST(tb.amount AS DECIMAL(38,2)) AS amount,
                            tb.created_at,
                            tb.transaction_type,
                            tb.more_details->>'remarks' AS reason
                        FROM transaction_bankings tb
                        WHERE tb.transaction_type = 'addSc'
                            AND tb.status = 1 
                            AND tb.is_success = true
                        ORDER BY tb.created_at DESC
                        LIMIT 1
                    )

                    SELECT 
                        h.admin_id,
                        a.email,
                        a.first_name,
                        a.last_name,
                        h.source,
                        h.amount,
                        h.created_at,
                        h.transaction_type,
                        h.reason
                    FROM (
                        SELECT * FROM highest_sc
                        UNION ALL
                        SELECT * FROM highest_gc
                        UNION ALL
                        SELECT * FROM recent_transaction
                    ) h
                    LEFT JOIN admin_users a ON h.admin_id = a.admin_user_id`

      const [result, rawResults, adminDetails] = await Promise.all([
        TransactionBankingModel.findOne({
          where: {
            status: TRANSACTION_STATUS.SUCCESS,
            isSuccess: true
          },
          attributes: [
            [sequelize.literal("SUM(CAST(CASE WHEN transaction_type = 'addSc' THEN amount ELSE 0 END AS DECIMAL(38,2)))"), 'totalScAdded'],
            [sequelize.literal("SUM(CAST(CASE WHEN transaction_type = 'addGc' THEN amount ELSE 0 END AS DECIMAL(38,2)))"), 'totalGcAdded'],
            [sequelize.literal("SUM(CAST(CASE WHEN transaction_type = 'removeSc' THEN amount ELSE 0 END AS DECIMAL(38,2)))"), 'totalScRemoved'],
            [sequelize.literal("SUM(CAST(CASE WHEN transaction_type = 'removeGc' THEN amount ELSE 0 END AS DECIMAL(38,2)))"), 'totalGcRemoved']
          ],
          raw: true
        }),

        sequelize.query(rawQuery, { type: sequelize.QueryTypes.SELECT }),

        AdminUser.findAndCountAll({
          attributes: [
            'adminUserId',
            'firstName',
            'lastName',
            'email',
            'group',
            [
              sequelize.literal(`(
              SELECT COALESCE(SUM(CAST(tb.amount AS DECIMAL(38,2))), 0) 
                FROM transaction_bankings tb 
                WHERE (tb.more_details->>'adminUserId')::INTEGER = "AdminUser".admin_user_id
                AND tb.transaction_type = 'addSc'
                AND tb.status = 1 
                AND tb.is_success = true
              )`),
              'totalScAdded'
            ],
            [
              sequelize.literal(`(
                SELECT COALESCE(SUM(CAST(tb.amount AS DECIMAL(38,2))), 0) 
                FROM transaction_bankings tb 
                WHERE (tb.more_details->>'adminUserId')::INTEGER = "AdminUser".admin_user_id
                AND tb.transaction_type = 'removeSc'
                AND tb.status = 1 
                AND tb.is_success = true
              )`),
              'totalScRemoved'
            ]
          ],
          where: {
            ...query,
            isActive: true,
            [Op.and]: [
              sequelize.literal(`EXISTS (
         SELECT 1 FROM transaction_bankings tb 
         WHERE (tb.more_details->>'adminUserId')::INTEGER = "AdminUser".admin_user_id
         AND (tb.transaction_type = 'addSc' OR tb.transaction_type = 'removeSc')
         AND tb.status = 1 
         AND tb.is_success = true
         GROUP BY tb.more_details->>'adminUserId'
         HAVING SUM(CAST(tb.amount AS DECIMAL(38,2))) > 0
      )`)
            ]
          },
          limit: size,
          offset: (page - 1) * size,
          order: [[orderByFixed, sort]],
          raw: true
        })
      ])

      const formattedResults = {
        highestSc: rawResults.find(txn => txn.source === 'highestSc') || null,
        highestGc: rawResults.find(txn => txn.source === 'highestGc') || null,
        mostRecent: rawResults.find(txn => txn.source === 'mostRecent') || null
      }

      adminDetails.rows = adminDetails.rows.map(admin => ({
        ...admin,
        group: admin.group || 'admin'
      }))

      const reportData = { ...result, ...formattedResults }

      return { message: SUCCESS_MSG.GET_SUCCESS, reportData, adminDetails }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  } // run method end
}
