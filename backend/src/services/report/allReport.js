import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import { getAll } from '../../utils/crud'
import db, { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { convertToCsv, getCsvFileName, pageValidation } from '../../utils/common'
import { FILE_NAME, KYC_STATUS, ROLE, SIGN_IN_METHOD, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'
import { sendCsvByEmailMailjet } from '../../libs/email'

const schema = {
  type: 'object',
  properties: {
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    endDate: { type: ['string', 'null'] },
    lifetimeData: { type: ['string', 'null'], enum: ['true', 'null', 'false'] },
    reportType: { type: ['string'], enum: ['reconciliation', 'redemption', 'exceeding', 'purchase', 'failed', 'new', 'lexis', 'game', 'Top 200 Purchasers', 'Top 200 Redeemers', 'Inactive Players', 'Business Economy', 'User Journey', 'Acquisition Total', 'Pending Verification', 'Without Purchase', 'Acquisition Detail', 'Coin Store Packages', 'Coin Distribution Overview', 'Dormant Players With Balance'] },
    csvDownload: { type: ['string', 'null'], enum: ['true', 'null', 'false'] }
  }
}
const constraints = ajv.compile(schema)

export class AllReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, startDate, endDate, lifetimeData, csvDownload, reportType } = this.args
    let page, size, transactions
    const user = this.context.req.body.user

    try {
      let query
      if (pageNo || limit) {
        const data = pageValidation(pageNo, limit)
        page = data.page
        size = data.size
      }

      if (lifetimeData && lifetimeData === 'false' && startDate && endDate) {
        query = {
          updatedAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      }

      const internalUsers = (await getAll({ model: db.User, data: { isInternalUser: true }, attributes: ['userId'] })).map(obj => { return obj.userId })

      if (reportType.toUpperCase() === FILE_NAME.RECONCILIATION.split('_')[0].toUpperCase()) {
        transactions = await db.TransactionBanking.findAll({
          where: { ...query, status: TRANSACTION_STATUS.SUCCESS, actioneeId: { [Op.notIn]: internalUsers } },
          attributes: ['actioneeId',
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' then amount else 0 end) as numeric),2) `), 'redemptionTotal'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' then amount else 0 end) as numeric),2) `), 'purchaseTotal']
          ],
          include: [{ model: db.User, attributes: [], as: 'transactionUser' }
          ],
          group: [sequelize.col('TransactionBanking.actionee_id')],
          limit: size,
          offset: ((page - 1) * size),
          raw: true
        })
      } else if (reportType.toUpperCase() === FILE_NAME.REDEMPTION.split('_')[0].toUpperCase()) {
        transactions = await db.TransactionBanking.findOne({
          where: { ...query, actioneeId: { [Op.notIn]: internalUsers } },
          attributes: [
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) as numeric),2) `), 'approvedRedemptionTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END)`), 'approvedRedemptionCount'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' and status = ${TRANSACTION_STATUS.CANCELED} then amount else 0 end) as numeric),2) `), 'declinedRedemptionTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND status = ${TRANSACTION_STATUS.CANCELED} THEN 1 ELSE NULL END)`), 'declinedRedemptionCount'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' and status = ${TRANSACTION_STATUS.PENDING} then amount else 0 end) as numeric),2) `), 'requestedRedemptionTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND status = ${TRANSACTION_STATUS.PENDING} THEN 1 ELSE NULL END)`), 'requestedRedemptionCount'],
            [sequelize.literal(`COUNT(DISTINCT CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN actionee_id ELSE NULL END)`), 'redeemerTotal']
          ],
          raw: true
        })

        transactions.average = (+transactions.approvedRedemptionTotal / +transactions.approvedRedemptionCount).toFixed(2)
      } else if (reportType.toUpperCase() === FILE_NAME.EXCEEDING.split('_')[0].toUpperCase()) {
        transactions = await db.User.findAll({
          attributes: ['userId', 'username', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phone', 'addressLine_1', 'zipCode', 'ssn', 'city',
            [sequelize.literal('(SELECT name FROM state WHERE CAST("state"."state_id" AS TEXT) = "User".state)'), 'state'],
            [sequelize.literal(`(SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND actionee_type = '${ROLE.USER}')`), 'redemptionAmount']
          ],
          where: {
            [Op.and]: [
              sequelize.literal(`(SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND actionee_type = '${ROLE.USER}') > 600`)
            ],
            userId: { [Op.notIn]: internalUsers }
          }
        })
      } else if (reportType.toUpperCase() === FILE_NAME.PURCHASE.split('_')[0].toUpperCase()) {
        transactions = await db.TransactionBanking.findOne({
          where: { ...query, actioneeId: { [Op.notIn]: internalUsers } },
          attributes: [
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) as numeric),2) `), 'purchaseTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END)`), 'purchaseCount'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.CANCELED} then amount else 0 end) as numeric),2) `), 'failedPurchaseTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.CANCELED} THEN 1 ELSE NULL END)`), 'failedPurchaseAmount'],
            [sequelize.literal(`COUNT(DISTINCT CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN actionee_id ELSE NULL END)`), 'purchasorTotal'],
            [sequelize.literal(`COUNT(DISTINCT CASE WHEN is_first_deposit = true AND actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN actionee_id ELSE NULL END)`), 'firstTimePurchasor'],
            [sequelize.literal(`ROUND(cast(sum(case when is_first_deposit = true and actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) / COUNT(CASE WHEN is_first_deposit = true AND actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END) as numeric),2)`), 'averageFirstPurchaseAmount']
          ],
          raw: true
        })

        transactions.average = (+transactions.purchaseTotal / +transactions.purchaseCount).toFixed(2)
      } else if (reportType.toUpperCase() === FILE_NAME.FAILED.split('_')[0].toUpperCase()) {
        transactions = await db.TransactionBanking.findAll({
          where: { ...query, transactionType: TRANSACTION_TYPE.DEPOSIT, status: TRANSACTION_STATUS.CANCELED, actioneeId: { [Op.notIn]: internalUsers } },
          attributes: ['actioneeId', 'amount', 'paymentTransactionId',
            [sequelize.json('"more_details"."packageId"'), 'packageId'], [sequelize.json('"more_details"."error"'), 'error'],
            [sequelize.literal('(SELECT username FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'username'],
            [sequelize.literal('(SELECT MAX("created_at"))'), 'lastPurchaseDate']
            // [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.CANCELED} THEN 1 ELSE NULL END)`), 'failedPurchaseNumber']
          ],
          group: ['actioneeId', 'amount', 'paymentTransactionId', 'packageId', 'error'],
          raw: true
        })
      } else if (reportType.toUpperCase() === FILE_NAME.NEW.split('_')[0].toUpperCase()) { // Account status
        transactions = await db.User.findAll({
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate]
            },
            isInternalUser: false
          },
          attributes: ['userId', 'username', 'kycStatus', 'firstName', 'lastName', 'email', 'createdAt'],
          raw: true
        })
      } else if (reportType.toUpperCase() === FILE_NAME.LEXIS.split('_')[0].toUpperCase()) {
        transactions = await db.User.findAll({
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate]
            },
            isInternalUser: false,
            kycStatus: KYC_STATUS.ACCOUNT_FAILED_LEXIS_NEXIS
          },
          attributes: ['userId', 'username', 'kycStatus', 'firstName', 'lastName', 'email', 'createdAt'],
          raw: true
        })
      } else if (reportType.toUpperCase() === FILE_NAME.GAME.split('_')[0].toUpperCase()) {
        transactions = await db.CasinoTransaction.findAll({
          where: { ...query, userId: { [Op.notIn]: internalUsers } },
          attributes: [
            'game_identifier',
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'bet\' and amount_type = \'0\' then amount else 0 end) as numeric),2) '), 'gcStacked'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'win\' and amount_type = \'0\' then amount else 0 end) as numeric),2) '), 'gcWins'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'bet\' and amount_type = \'0\' then amount else 0 end) - sum(case when action_type = \'win\' and amount_type = \'0\' then amount else 0 end) as numeric), 2)'), 'ggrGC'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'bet\' and amount_type = \'0\' then amount else 0 end) - sum(case when action_type = \'win\' and amount_type = \'0\' then amount else 0 end) / NULLIF(COUNT(DISTINCT CASE WHEN action_type = \'bet\' and amount_type = \'0\' THEN user_id ELSE 0 END), 0) as numeric), 2)'), 'ggr/ApGC'],
            [sequelize.literal('COUNT(DISTINCT CASE WHEN action_type = \'bet\' and amount_type = \'0\' THEN user_id ELSE NULL END)'), 'totalGcPlayer'],
            [sequelize.literal('COUNT(DISTINCT CASE WHEN amount_type = \'0\' THEN round_id ELSE NULL END)'), 'totalGcRounds'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'win\' and amount_type = \'0\' then amount else 0 end) / NULLIF(sum(case when action_type = \'bet\' and amount_type = \'0\' then amount else 0 end), 0) as numeric), 2)'), 'rtpGC'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'bet\' and amount_type = \'1\' then amount else 0 end) as numeric),2) '), 'scStacked'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'win\' and amount_type = \'1\' then amount else 0 end) as numeric),2) '), 'scWins'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'bet\' and amount_type = \'1\' then amount else 0 end) - sum(case when action_type = \'win\' and amount_type = \'1\' then amount else 0 end) as numeric), 2)'), 'ggrSC'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'bet\' and amount_type = \'1\' then amount else 0 end) - sum(case when action_type = \'win\' and amount_type = \'1\' then amount else 0 end) / NULLIF(COUNT(DISTINCT CASE WHEN action_type = \'bet\' and amount_type = \'1\' THEN user_id ELSE 0 END), 0) as numeric), 2)'), 'ggr/ApSC'],
            [sequelize.literal('ROUND(cast(sum(case when action_type = \'win\' and amount_type = \'1\' then amount else 0 end) / NULLIF(sum(case when action_type = \'bet\' and amount_type = \'1\' then amount else 0 end), 0) as numeric), 2)'), 'rtpSC'],
            [sequelize.literal('COUNT(DISTINCT CASE WHEN action_type = \'bet\' and amount_type = \'1\' THEN user_id ELSE NULL END)'), 'totalScPlayer'],
            [sequelize.literal('COUNT(DISTINCT CASE WHEN amount_type = \'1\' THEN round_id ELSE NULL END)'), 'totalScRounds'],
            [sequelize.literal('"MasterCasinoGame"."name"'), 'gameName'],
            [sequelize.literal('"MasterCasinoGame->MasterCasinoProvider"."name"'), 'providerName']
          ],
          include: [
            {
              model: db.MasterCasinoGame,
              attributes: [],
              include: [{
                model: db.MasterCasinoProvider,
                attributes: []
              }]
            }
          ],
          group: ['game_identifier', 'MasterCasinoGame.master_casino_game_id', 'MasterCasinoGame->MasterCasinoProvider.master_casino_provider_id'],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.TOP_200_PURCHASERS.split('_Report')[0].toUpperCase()) { // Account status
        transactions = await db.TransactionBanking.findAll({
          where: {
            ...query,
            transactionType: TRANSACTION_TYPE.DEPOSIT,
            actioneeId: { [Op.notIn]: internalUsers }
          },
          attributes: [
            'actionee_id',
            [sequelize.literal('(SELECT user_id FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'playerId'],
            [sequelize.literal('(SELECT username FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'userName'],
            [sequelize.literal('(SELECT created_at FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'accountRegistrationDate'],
            [sequelize.literal('(SELECT is_active FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'accountStatus'],
            [sequelize.literal('(SELECT kyc_status FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'kycStatus'],
            [sequelize.literal('(SELECT first_name FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'firstName'],
            [sequelize.literal('(SELECT last_name FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'lastName'],
            [sequelize.literal('(SELECT email FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'email'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) as numeric),2) `), 'purchaseTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END)`), 'purchaseCount'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) / COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END) as numeric),2)`), 'averagePurchaseAmount '],
            [sequelize.literal('(SELECT MAX("created_at"))'), 'lastPurchaseDate'],
            [sequelize.literal('(SELECT MAX("created_at") FROM user_activities WHERE "user_activities"."user_id" = "TransactionBanking".actionee_id)'), 'lastLoginDate'],
            [
              sequelize.literal(`CASE 
              WHEN (SELECT MAX("created_at") FROM user_activities WHERE "user_activities"."user_id" = "TransactionBanking".actionee_id) IS NOT NULL 
              THEN EXTRACT(DAY FROM NOW() - (SELECT MAX("created_at") FROM user_activities WHERE "user_activities"."user_id" = "TransactionBanking".actionee_id)) 
              ELSE NULL 
            END`),
              'daysSinceLastLogin'
            ],
            [sequelize.literal(`(SELECT sum("amount") FROM "transaction_bankings" WHERE "transaction_bankings".actionee_id = (SELECT user_id FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}')`), 'lifetimePurchaseAmount']
          ],
          group: ['actionee_id'],
          order: [[sequelize.col('purchaseTotal'), 'DESC']],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.TOP_200_REDEEMERS.split('_Report')[0].toUpperCase()) { // Account status
        transactions = await db.TransactionBanking.findAll({
          where: {
            ...query,
            actioneeId: { [Op.notIn]: internalUsers },
            transactionType: TRANSACTION_TYPE.WITHDRAW
          },
          attributes: [
            'actionee_id',
            [sequelize.literal('(SELECT user_id FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'playerId'],
            [sequelize.literal('(SELECT username FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'userName'],
            [sequelize.literal('(SELECT created_at FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'accountRegistrationDate'],
            [sequelize.literal('(SELECT is_active FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'accountStatus'],
            [sequelize.literal('(SELECT kyc_status FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'kycStatus'],
            [sequelize.literal('(SELECT first_name FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'firstName'],
            [sequelize.literal('(SELECT last_name FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'lastName'],
            [sequelize.literal('(SELECT email FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id)'), 'email'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) as numeric),2) `), 'approvedRedemptionTotal'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END)`), 'redemptionCount'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) / COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END) as numeric),2)`), 'averageRedemptionAmount '],
            [sequelize.literal('(SELECT MAX("created_at"))'), 'lastRedemptionDate'],
            [sequelize.literal('(SELECT MAX("created_at") FROM user_activities WHERE "user_activities"."user_id" = "TransactionBanking".actionee_id)'), 'lastLoginDate'],
            [
              sequelize.literal(`CASE 
              WHEN (SELECT MAX("created_at") FROM user_activities WHERE "user_activities"."user_id" = "TransactionBanking".actionee_id) IS NOT NULL 
              THEN EXTRACT(DAY FROM NOW() - (SELECT MAX("created_at") FROM user_activities WHERE "user_activities"."user_id" = "TransactionBanking".actionee_id)) 
              ELSE NULL 
            END`),
              'daysSinceLastLogin'
            ],
            [sequelize.literal(`(SELECT sum("amount") FROM "transaction_bankings" WHERE "transaction_bankings".actionee_id = (SELECT user_id FROM users WHERE "users"."user_id" = "TransactionBanking".actionee_id) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}' AND status = '${TRANSACTION_STATUS.SUCCESS}')`), 'approvedRedemptionLifetimeTotal']
          ],
          group: ['actionee_id'],
          order: [[sequelize.col('approvedRedemptionTotal'), 'DESC']],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.INACTIVE_PLAYERS.split('_Report')[0].toUpperCase()) {
        transactions = await db.User.findAll({
          where: { isInternalUser: false },
          attributes: [['user_id', 'playerId'], ['created_at', 'accountRegistrationDate'], ['username', 'userName'], ['is_active', 'accountStatus'], ['kyc_status', 'kycStatus'], ['first_name', 'firstName'], ['last_name', 'lastName'], ['email', 'email'], ['sign_in_count', 'loginCount'], ['last_login_date', 'lastLoginDate']],
          // include: [{

          // }],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.BUSINESS_ECONOMY.split('_Report')[0].toUpperCase()) {
        transactions = await db.User.findAll({
          where: {
            createdAt: {
              [Op.between]: [`${startDate} 00:00:00.000+00`, `${endDate} 23:59:59.999+00`]
            },
            isInternalUser: false
          },
          attributes: [
            [sequelize.literal('COUNT(DISTINCT user_id)'), 'newRegisteredUsers'],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT user_id)
                FROM user_activities
                WHERE "user_activities"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "user_activities"."activity_type" = '${USER_ACTIVITIES_TYPE.LOGIN}'
                AND "user_activities"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'uniqueLogin'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT actionee_id)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'purchasorTotal'
            ],
            [
              sequelize.literal(`(
                SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'totalPurchaseAmount'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(actionee_id)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'totalNumberOfPurchases'
            ],
            [
              sequelize.literal(`(
                SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'approvedRedemptionTotal'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(actionee_id)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'totalNumberOfRedemption'
            ],
            [
              sequelize.literal(`(
                (SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}'
                AND status = '${TRANSACTION_STATUS.SUCCESS}'
                )
                -
                (SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}'
                AND status = '${TRANSACTION_STATUS.SUCCESS}'
                )
              )`),
              'netGaming'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT user_id)
                FROM casino_transactions
                WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'bet' AND amount_type = '1'
                AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'activeScPlayers'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND  "casino_transactions"."action_type" = 'bet'
                    AND amount_type = '1'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scStacked'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND  "casino_transactions"."action_type" = 'win'
                    AND amount_type = '1'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scWins'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT user_id)
                FROM casino_transactions
                WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'bet' AND amount_type = '0'
                AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'activeGcPlayers'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND  "casino_transactions"."action_type" = 'bet'
                    AND amount_type = '0'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'gcStacked'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND  "casino_transactions"."action_type" = 'win'
                    AND amount_type = '0'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'gcWins'
            ]
          ],
          include: [
            {
              model: db.Wallet,
              as: 'userWallet',
              attributes: []
            }
          ],
          group: ['User.user_id'],
          raw: true
        })

        const rscBalance = await db.User.findAll({
          where: {
            createdAt: {
              [Op.between]: [`${startDate} 00:00:00.000+00`, `${endDate} 23:59:59.999+00`]
            },
            isInternalUser: false
          },
          attributes: [
            [
              sequelize.literal(`(
                COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'wsc') AS NUMERIC)), 0)
              )`),
              'rscBalance'
            ]
          ],
          include: [
            {
              model: db.Wallet,
              as: 'userWallet',
              attributes: []
            }
          ],
          group: [

          ],
          raw: true
        })
        transactions = { ...transactions[0], rscBalance: rscBalance[0]?.rscBalance, newRegisteredUsers: transactions.length, ggrSc: (+transactions[0].scStacked - +transactions[0].scWins).toFixed(2), ggrApSc: ((+transactions[0].scStacked - +transactions[0].scWins) / +transactions[0].activeScPlayers).toFixed(2), ggrGc: (+transactions[0].gcStacked - +transactions[0].gcWins).toFixed(2), ggrApGc: ((+transactions[0].gcStacked - +transactions[0].gcWins) / +transactions[0].activeGcPlayers).toFixed(2) }
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.USER_JOURNEY.split('_Report')[0].toUpperCase()) { // incomplete registration, document , account verified
        transactions = await db.User.findAll({
          where: {
            ...query,
            isInternalUser: false
          },
          attributes: [
            [sequelize.literal(`SUM(CASE WHEN sign_in_method = '${SIGN_IN_METHOD.NORMAL}' OR sign_in_method = '${SIGN_IN_METHOD.GOOGLE}' OR sign_in_method = '${SIGN_IN_METHOD.FACEBOOK}' THEN 1 ELSE 0 END)`), 'newRegisteredPlayers'],
            [sequelize.literal(`SUM(CASE WHEN sign_in_method = '${SIGN_IN_METHOD.NORMAL}' THEN 1 ELSE 0 END)`), 'signUpMail'],
            [sequelize.literal(`SUM(CASE WHEN sign_in_method = '${SIGN_IN_METHOD.GOOGLE}' THEN 1 ELSE 0 END)`), 'signUpGoogle'],
            [sequelize.literal(`SUM(CASE WHEN sign_in_method = '${SIGN_IN_METHOD.FACEBOOK}' THEN 1 ELSE 0 END)`), 'signUpFacebook'],
            [sequelize.literal('SUM(CASE WHEN is_email_verified = true THEN 1 ELSE 0 END)'), 'emailVerifiedTotal'],
            [sequelize.literal(`SUM(CASE WHEN kyc_status = '${KYC_STATUS.ACCOUNT_EMAIL_VERIFIED_ACCEPTED_TC}' THEN 1 ELSE 0 END)`), 'K1Total'],
            [sequelize.literal(`SUM(CASE WHEN kyc_status = '${KYC_STATUS.ACCOUNT_VERIFIED_PHONE}' THEN 1 ELSE 0 END)`), 'K2Total'],
            [sequelize.literal(`SUM(CASE WHEN kyc_status = '${KYC_STATUS.ACCOUNT_PASSED_LEXIS_NEXIS}' THEN 1 ELSE 0 END)`), 'K3Total'],
            [sequelize.literal(`SUM(CASE WHEN kyc_status = '${KYC_STATUS.ACCOUNT_FAILED_LEXIS_NEXIS}' THEN 1 ELSE 0 END)`), 'K4Total'],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT user_id)
                FROM casino_transactions
                WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'bet' AND amount_type = '0'
                AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'activeGcPlayers'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT user_id)
                FROM casino_transactions
                WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'bet' AND amount_type = '1'
                AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'activeScPlayers'
            ]
          ],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.ACQUISITION_TOTAL.split('_Report')[0].toUpperCase()) { // account verified
        transactions = await db.User.findAll({
          where: {
            ...query,
            isInternalUser: false
          },
          attributes: [
            [sequelize.literal(`SUM(CASE WHEN sign_in_method = '${SIGN_IN_METHOD.NORMAL}' OR sign_in_method = '${SIGN_IN_METHOD.GOOGLE}' OR sign_in_method = '${SIGN_IN_METHOD.FACEBOOK}' THEN 1 ELSE 0 END)`), 'newRegisteredPlayers'],
            [sequelize.literal('SUM(CASE WHEN is_email_verified = true THEN 1 ELSE 0 END)'), 'emailVerifiedTotal'],
            [sequelize.literal(`SUM(CASE WHEN kyc_status = '${KYC_STATUS.ACCOUNT_VERIFIED_PHONE}' THEN 1 ELSE 0 END)`), 'K2Total'],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT actionee_id)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'purchasorTotal'
            ],
            [
              sequelize.literal(`(
                SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'totalPurchaseAmount'
            ],
            [
              sequelize.literal(`(
                SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.FAILED}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'failedPurchaseAmount'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(actionee_id)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'totalNumberOfPurchases'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT actionee_id)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'totalNumberOfRedeemer'
            ],
            [
              sequelize.literal(`(
                SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}' AND status = '${TRANSACTION_STATUS.SUCCESS}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'approvedRedemptionTotal'
            ],
            [
              sequelize.literal(`(
                SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}' AND status = '${TRANSACTION_STATUS.DECLINED}'
                AND "transaction_bankings"."updated_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'declinedRedemptionTotal'
            ],
            [
              sequelize.literal(`(
                (SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.DEPOSIT}'
                AND status = '${TRANSACTION_STATUS.SUCCESS}'
                )
                -
                (SELECT SUM(amount)
                FROM transaction_bankings
                WHERE "transaction_bankings"."actionee_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "transaction_bankings"."transaction_type" = '${TRANSACTION_TYPE.WITHDRAW}'
                AND status = '${TRANSACTION_STATUS.SUCCESS}'
                )
              )`),
              'netGaming'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(DISTINCT user_id)
                FROM casino_transactions
                WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'bet' AND amount_type = '1'
                AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
              )`),
              'activeScPlayers'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'bet'
                    AND amount_type = '1'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scStacked'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'win'
                    AND amount_type = '1'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scWins'
            ]
          ],
          raw: true
        })
        transactions = { ...transactions[0], averagePurchaseAmount: (+transactions[0].totalPurchaseAmount / +transactions[0].totalNumberOfPurchases).toFixed(2), ggrSc: (+transactions[0].scStacked - +transactions[0].scWins).toFixed(2) }
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.PENDING_VERIFICATION.split('_Report')[0].toUpperCase()) {
        transactions = await db.UserDocument.findAll({
          where: {
            ...query,
            userId: { [Op.notIn]: internalUsers },
            status: 0
          },
          attributes: [
            'userId', 'createdAt',
            [sequelize.literal('"User"."phone"'), 'phone'],
            [sequelize.literal('"User"."username"'), 'username'],
            [sequelize.literal('"User"."first_name"'), 'firstName'],
            [sequelize.literal('"User"."last_name"'), 'lastName'],
            [sequelize.literal('"User"."email"'), 'email'],
            [sequelize.literal('"User"."date_of_birth"'), 'dateOfBirth']
          ],
          order: [['createdAt', 'ASC']],
          include: [
            {
              model: db.User,
              attributes: []
            }
          ],
          group: ['UserDocument.user_id', 'UserDocument.created_at', 'User.phone', 'User.username', 'User.first_name', 'User.last_name', 'User.email', 'User.date_of_birth'],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.PLAYER_WITHOUT_PURCHASE.split('_Report')[0].toUpperCase()) {
        transactions = await db.User.findAll({
          attributes: [
            'user_id', 'created_at', 'username', 'kycStatus', 'firstName', 'lastName', 'email', 'lastLoginDate',
            [
              sequelize.literal(`(
                COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'psc') AS NUMERIC)), 0) +
                COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'bsc') AS NUMERIC)), 0) +
                COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'wsc') AS NUMERIC)), 0)
              )`),
              'scCoinSum'
            ],
            [
              sequelize.literal(`(
                ROUND(EXTRACT(epoch FROM (CURRENT_TIMESTAMP - "last_login_date") / 86400))
              )`),
              'daysSinceLastLogin'
            ],
            [
              sequelize.literal(`(
                SELECT COUNT(transaction_banking_id) 
                FROM transaction_bankings 
                WHERE (transaction_bankings.actionee_id = "User".user_id AND is_success = true AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}')
              )::integer`),
              'totalPurchaseMade'
            ]
          ],
          where: sequelize.literal(`
            (SELECT COUNT(transaction_banking_id) 
            FROM transaction_bankings 
            WHERE actionee_id NOT IN (${internalUsers.length ? internalUsers : '0'}) AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' 
            AND is_success = true 
            AND created_at BETWEEN '${startDate} 00:00:00.000+00' 
            AND '${endDate} 23:59:59.999+00') = 0`),
          include: [
            {
              model: db.Wallet,
              as: 'userWallet',
              attributes: []
            }
          ],
          group: [
            'user_id', 'User.created_at', 'username', 'kycStatus', 'firstName', 'lastName', 'email', 'lastLoginDate'
          ],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.ACQUISITION_DETAIL.split('_Report')[0].toUpperCase()) { // account verified
        transactions = await db.User.findAll({
          where: {
            ...query,
            isInternalUser: false
          },
          attributes: [
            ['user_id', 'playerId'], ['created_at', 'accountRegistrationDate'], ['kyc_status', 'kycStatus'],
            [sequelize.literal(`(SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND actionee_type = '${ROLE.USER}')`), 'totalPurchaseAmount'],
            [sequelize.literal(`(SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.FAILED} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND actionee_type = '${ROLE.USER}')`), 'totalFailedPurchaseAmount'],
            [
              sequelize.literal(`(
                SELECT COUNT(actionee_id)
                FROM transaction_bankings
                WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND actionee_type = '${ROLE.USER}')`),
              'totalNumberOfPurchases'
            ],
            [sequelize.literal(`(SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.APPROVED} AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND actionee_type = '${ROLE.USER}')`), 'totalApprovedRedemptionAmount'],
            [sequelize.literal(`(SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.DECLINED} AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND actionee_type = '${ROLE.USER}')`), 'totalDeclinedRedemptionAmount'],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE 
                    casino_transactions.user_id = "User".user_id 
                    AND "casino_transactions"."action_type" = 'bet'
                    AND amount_type = '1'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scStacked'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(amount)
                    FROM casino_transactions
                    WHERE 
                    casino_transactions.user_id = "User".user_id 
                    AND "casino_transactions"."action_type" = 'win'
                    AND amount_type = '1'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scWin'
            ],
            [sequelize.literal(`ROUND(cast((SELECT SUM(amount)
            FROM casino_transactions
            WHERE 
            casino_transactions.user_id = "User".user_id 
            AND "casino_transactions"."action_type" = 'bet'
            AND amount_type = '1'
            ) - (SELECT SUM(amount)
            FROM casino_transactions
            WHERE 
            casino_transactions.user_id = "User".user_id 
            AND "casino_transactions"."action_type" = 'win'
            AND amount_type = '1'
            ) as numeric), 2)`), 'ggrSC'],
            [sequelize.literal(`ROUND(cast((SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND actionee_type = '${ROLE.USER}') - (SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.APPROVED} AND transaction_type = '${TRANSACTION_TYPE.WITHDRAW}' AND actionee_type = '${ROLE.USER}') as numeric), 2)`), 'netGaming'],
            [sequelize.literal(`ROUND(cast(
              (SELECT SUM(amount) FROM transaction_bankings WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND actionee_type = '${ROLE.USER}')
               / 
               (SELECT COUNT(actionee_id)
            FROM transaction_bankings
            WHERE transaction_bankings.actionee_id = "User".user_id AND status = ${TRANSACTION_STATUS.SUCCESS} AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND actionee_type = '${ROLE.USER}')
             as numeric), 2)`), 'averagePurchaseAmount']
          ],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.COIN_STORE_PACKAGES.split('_Report')[0].toUpperCase()) {
        const packageIdArray = (await getAll({ model: db.package, attributes: ['packageId'] })).map(obj => { return obj.packageId })
        transactions = await db.TransactionBanking.findAll({
          where: {
            ...query,
            transactionType: TRANSACTION_TYPE.DEPOSIT,
            actioneeId: { [Op.notIn]: [internalUsers] },
            'moreDetails.packageId': { [Op.in]: packageIdArray }
          },
          attributes: [
            [sequelize.literal('CAST(("TransactionBanking"."more_details"->>\'packageId\') AS DOUBLE PRECISION)'), 'packageCode'],
            [sequelize.literal(`COUNT(DISTINCT CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END)`), 'purchasorTotal'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then amount else 0 end) as numeric),2) `), 'totalPurchaseAmount'],
            [sequelize.literal(`COUNT(CASE WHEN actionee_type = '${ROLE.USER}' AND transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' AND status = ${TRANSACTION_STATUS.SUCCESS} THEN 1 ELSE NULL END)`), 'totalNumberOfPurchases'],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.FAILED} then amount else 0 end) as numeric),2) `), 'totalFailedPurchaseAmount']
          ],
          group: ['packageCode'],
          raw: true
        })
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.COIN_DISTRIBUTION_OVERVIEW.split('_Report')[0].toUpperCase()) { // SC/GC tournament
        transactions = await db.TransactionBanking.findOne({
          where: {
            ...query,
            actioneeId: { [Op.notIn]: [internalUsers] }
          },
          attributes: [
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then sc_coin else 0 end) as numeric),2) `), 'totalScPurchaseAmount'],
            [sequelize.literal(`ROUND(cast(sum(case when transaction_type = '${TRANSACTION_TYPE.ADD_SC}' and status = ${TRANSACTION_STATUS.SUCCESS} then sc_coin else 0 end) as numeric),2) `), 'totalAdjustmentScAmount'],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(sc)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'daily bonus'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scDaily'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(sc)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'welcome bonus'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'scWelcomeOffer'
            ],
            [sequelize.literal(`ROUND(cast(sum(case when actionee_type = '${ROLE.USER}' and transaction_type = '${TRANSACTION_TYPE.DEPOSIT}' and status = ${TRANSACTION_STATUS.SUCCESS} then gc_coin else 0 end) as numeric),2) `), 'totalGcPurchaseAmount'],
            [sequelize.literal(`ROUND(cast(sum(case when transaction_type = '${TRANSACTION_TYPE.ADD_GC}' and status = ${TRANSACTION_STATUS.SUCCESS} then gc_coin else 0 end) as numeric),2) `), 'totalAdjustmentGcAmount'],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(gc)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'daily bonus'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'gcDaily'
            ],
            [
              sequelize.literal(`(
                CAST(
                  ROUND(
                    (SELECT SUM(gc)
                    FROM casino_transactions
                    WHERE "casino_transactions"."user_id" NOT IN (${internalUsers.length ? internalUsers : '0'}) AND "casino_transactions"."action_type" = 'welcome bonus'
                    AND "casino_transactions"."created_at" BETWEEN '${startDate}' AND '${endDate} 23:59:59.999+00'
                    )::numeric, 2) AS numeric
                )
              )`),
              'gcWelcomeOffer'
            ]
          ],
          raw: true
        })

        transactions = { ...transactions, scAwardedTotal: (+(transactions?.totalAdjustmentScAmount || 0) + +(transactions?.scDaily || 0) + +(transactions?.scWelcomeOffer || 0)), gcAwardedTotal: (+(transactions?.totalAdjustmentGcAmount || 0) + +(transactions?.gcDaily || 0) + +(transactions?.gcWelcomeOffer || 0)) }
        transactions = { ...transactions, scCreditedTotal: (+transactions?.scAwardedTotal + +transactions?.totalScPurchaseAmount), gcCreditedTotal: (+transactions?.gcAwardedTotal + +transactions?.totalGcPurchaseAmount) }
      } else if (reportType.toUpperCase().replaceAll(' ', '_') === FILE_NAME.DORMANT_PLAYERS_WITH_BALANCE_REPORT.split('_Report')[0].toUpperCase()) {
        transactions = await db.User.findAll({
          attributes: [['user_id', 'playerId'], ['created_at', 'accountRegistrationDate'], 'username', 'kycStatus', 'firstName', 'lastName', 'email', ['last_login_date', 'lastLoginDate'], ['sign_in_count', 'login'],
            [sequelize.literal('"userWallet"."gc_coin"'), 'gcBalance'],
            [sequelize.literal('CAST(("userWallet"."sc_coin"->>\'wsc\') AS DOUBLE PRECISION)'), 'rscBalance']
          ],
          include: [
            {
              model: db.TransactionBanking,
              as: 'transactionBanking',
              attributes: [],
              required: true
            },
            {
              model: db.Wallet,
              as: 'userWallet',
              attributes: [],
              required: true
            }
          ],
          where: {
            isInternalUser: false
          },
          group: ['User.user_id', 'userWallet.wallet_id'],
          having: {
            [Op.and]: sequelize.literal(`NOT EXISTS (
              SELECT 1 
              FROM "user_activities" 
              WHERE "user_activities"."user_id" = "User"."user_id" 
              AND "user_activities"."created_at" BETWEEN '${startDate}' AND '${endDate}'
            )`),
            [Op.and]: sequelize.literal(`(
              COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'psc') AS NUMERIC)), 0) +
              COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'bsc') AS NUMERIC)), 0) +
              COALESCE(SUM(CAST(("userWallet"."sc_coin"->>'wsc') AS NUMERIC)), 0)
            ) > 0`)
          }
        })
      }

      if (csvDownload && csvDownload === 'true' && transactions) {
        const fields = (transactions?.length) ? Object.keys(transactions[0]) : Object.keys(transactions)
        const csvData = convertToCsv({
          fields,
          data: transactions
        })
        if (csvData && csvData.length / (1024 * 1024) > 2) { // check if csv data is greater then 2 MB
          sendCsvByEmailMailjet({ email: user?.email, name: user?.adminUsername, subject: FILE_NAME[reportType.toUpperCase()].replace('_', ' '), textPart: `Your ${FILE_NAME[reportType.toUpperCase()].replace('_', ' ')}`, fileName: getCsvFileName({ file: FILE_NAME[reportType.toUpperCase()] }), data: csvData })
          return { csv: true, message: SUCCESS_MSG.CSV_SUCCESS }
        }
        return { csv: true, csvData, fileName: getCsvFileName({ file: FILE_NAME[reportType.toUpperCase()] }) }
      }
      return { transactions, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
