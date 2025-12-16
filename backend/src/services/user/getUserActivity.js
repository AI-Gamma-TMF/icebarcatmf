import { Op, QueryTypes } from 'sequelize'
import db, { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { CSV_TYPE } from '../../utils/constants/constant'
import { calculateUTCDateRangeForTimezoneRange, exportCenterAxiosCall, pageValidation } from '../../utils/common'

export class GetUserActivityService extends ServiceBase {
  async run () {
    let { userId, pageNo, limit, startDate, endDate, action, transaction, coinType, providerName, csvDownload, timezone, gameId, gameName } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)
      let actionTypeCasino = ''
      let actionTypeBanking = ''
      let providerNameCasino = ''
      let providerNameWithdrawal = ''
      let providerNameBanking = ''
      let isCasinoNotAllowed = 'NOT'
      let isBankingNotAllowed = 'NOT'
      let isWithdrawalNotAllowed = 'NOT'
      let casinoCoinValue = ''
      let bankingCoinType = ''

      if (startDate || endDate) {
        const result = calculateUTCDateRangeForTimezoneRange(startDate, endDate, timezone)
        startDate = result?.startDateUTC
        endDate = result?.endDateUTC
      }
      const casinoBankingFilters = {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        },
        userId
      }

      if (action !== 'all' && action) {
        if (action === 'bonus') {
          actionTypeCasino =
            "AND casino_transactions.action_type IN ('daily bonus','welcome bonus','daily-bonus','referral-bonus','personal-bonus', 'tier-bonus', 'weekly-tier-bonus', 'monthly-tier-bonus', 'raffle-payout', 'promotion-bonus','affiliate-bonus', 'first-purchase-bonus', 'wheel-spin-bonus', 'package-bonus','provider-bonus')"
          isBankingNotAllowed = ''
          isWithdrawalNotAllowed = ''
        } else if (
          action === 'deposit' ||
          action === 'addGc' ||
          action === 'addSc' ||
          action === 'subscription' ||
          action === 'vaultInterestCredit'
        ) {
          isCasinoNotAllowed = ''
          isWithdrawalNotAllowed = ''
          isBankingNotAllowed = 'NOT'
          actionTypeBanking = `AND transaction_type = '${action}'`
        } else if (action === 'redeem') {
          isCasinoNotAllowed = ''
          isBankingNotAllowed = ''
          isWithdrawalNotAllowed = 'NOT'
          actionTypeBanking = ''
        } else {
          isBankingNotAllowed = ''
          isWithdrawalNotAllowed = ''
          actionTypeCasino = `AND casino_transactions.action_type = '${action}'`
        }
      }

      if (providerName !== 'all' && providerName) {
        providerNameCasino = `AND master_casino_providers.name = '${providerName}'`
        providerNameBanking = `AND payment_method = '${providerName}'`
        providerNameWithdrawal = `AND payment_provider = '${providerName}'`
      }

      if (coinType !== 'all' && coinType) {
        const coinValue = coinType === 'GC' ? 0 : 1
        casinoBankingFilters.amountType = coinValue
        bankingCoinType =
          coinType === 'GC'
            ? 'AND gc_coin IS NOT NUll'
            : 'AND sc_coin IS NOT NUll'
        if (coinType === 'GC') isWithdrawalNotAllowed = ''
        casinoCoinValue = `AND casino_transactions.amount_type = ${coinValue}`
      }

      if (transaction !== 'all' && transaction) {
        if (transaction === 'banking') {
          isCasinoNotAllowed = ''
        } else if (transaction === 'casino') {
          isBankingNotAllowed = ''
          isWithdrawalNotAllowed = ''
        } else {
          isCasinoNotAllowed = ''
          isBankingNotAllowed = ''
        }
      }
      if (gameId || gameName) {
        isBankingNotAllowed = ''
        isWithdrawalNotAllowed = ''
      }
      let exportId = null
      let exportType = null
      if (csvDownload === 'true') {
        const Transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body
          // Adding a table in Db called export center
          const exportTbl = await db.ExportCenter.create(
            { type: CSV_TYPE.PLAYER_ACTIVITY_CSV, adminUserId: id, payload: this.args },
            { transaction: Transaction }
          )
          exportId = exportTbl.dataValues.id
          exportType = exportTbl.dataValues.type
          const axiosBody = {
            limit: limit || 15,
            pageNo: pageNo || 1,
            isBankingNotAllowed: isBankingNotAllowed || '',
            providerNameBanking: providerNameBanking || '',
            actionTypeBanking: actionTypeBanking || '',
            isCasinoNotAllowed: isCasinoNotAllowed || '',
            actionTypeCasino: actionTypeCasino || '',
            providerNameCasino: providerNameCasino || '',
            casinoCoinValue: casinoCoinValue || '',
            bankingCoinType: bankingCoinType || '',
            isWithdrawalNotAllowed: isWithdrawalNotAllowed || '',
            providerNameWithdrawal: providerNameWithdrawal || '',
            userId: userId,
            csvDownload: csvDownload || '',
            startOfDay: startDate,
            endOfDay: endDate,
            timezone: timezone,
            gameId: gameId,
            gameName: gameName,
            exportId: exportId,
            exportType: exportType,
            type: CSV_TYPE.PLAYER_ACTIVITY_CSV
          }
          // Hitting CSV Download API
          await exportCenterAxiosCall(axiosBody)
          await Transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await Transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }

      const data = await this.fetchCasinoData({
        isBankingNotAllowed,
        providerNameBanking,
        actionTypeBanking,
        isCasinoNotAllowed,
        actionTypeCasino,
        providerNameCasino,
        casinoCoinValue,
        isWithdrawalNotAllowed,
        providerNameWithdrawal,
        bankingCoinType,
        userId,
        limit: size,
        offset: (page - 1) * size,
        startOfDay: startDate,
        endOfDay: endDate,
        gameId,
        gameName
      })
      const totalCount = data[0]?.totalrecords
      // const totalPages = Math.ceil(totalCount / limit)
      return {
        success: true,
        data: { count: totalCount, rows: data },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchCasinoData ({ isBankingNotAllowed, gameId, gameName, providerNameBanking, actionTypeBanking, isCasinoNotAllowed, actionTypeCasino, providerNameCasino, casinoCoinValue, isWithdrawalNotAllowed, providerNameWithdrawal, bankingCoinType, userId, limit, offset, startOfDay, endOfDay }) {
    const query = `SELECT
    *,
    (
        SELECT
            COUNT(*)
        FROM
            (
                SELECT
                    actionee_id AS "actioneeId"
                FROM
                    transaction_bankings
                WHERE
                    transaction_banking_id IS ${isBankingNotAllowed} NULL
                    AND transaction_type NOT IN ('redeem')
                    AND actionee_id = :userId ${providerNameBanking} ${actionTypeBanking} ${bankingCoinType}
                    AND transaction_bankings.updated_at >= :startDate AND transaction_bankings.updated_at <= :endDate
                UNION
                ALL
                SELECT
                    user_id AS "actioneeId"
                FROM
                    casino_transactions
                    LEFT JOIN master_casino_games ON casino_transactions.game_id::INTEGER = master_casino_games.master_casino_game_id::INTEGER
                    LEFT JOIN master_casino_providers ON master_casino_games.master_casino_provider_id = master_casino_providers.master_casino_provider_id
                WHERE
                    casino_transactions.casino_transaction_id IS ${isCasinoNotAllowed} NULL
                    AND casino_transactions.user_id = :userId ${actionTypeCasino} ${providerNameCasino} ${casinoCoinValue}
                    ${gameId ? `AND casino_transactions.game_id::INTEGER = ${gameId}` : ''} 
                    ${gameName ? `AND master_casino_games.name ILIKE '%${gameName}%'` : ''}
                    AND casino_transactions.created_at >= :startDate AND casino_transactions.created_at <= :endDate
                UNION
                ALL
                SELECT
                    user_id AS "actioneeId"
                FROM
                    withdraw_requests
                WHERE
                    withdraw_request_id IS ${isWithdrawalNotAllowed} NULL
                    AND user_id = :userId ${providerNameWithdrawal}
                    AND withdraw_requests.updated_at >= :startDate AND withdraw_requests.updated_at <= :endDate
            ) AS subquery
    ) AS totalRecords
FROM
    (
        SELECT
            actionee_id AS "actioneeId",
            NULL AS "gameId",
            NULL AS "gameName",
            payment_method AS "paymentProvider",
            created_at as "startTime",
            updated_at as "endTime",
            (CASE WHEN transaction_type = 'deposit' THEN 'Purchase' ELSE transaction_type END) AS "actionType",
            amount AS "amount",
            ROUND(CAST(SUM(COALESCE(gc_coin, 0) + COALESCE(bonus_gc, 0) + COALESCE(promocode_bonus_gc, 0)) AS numeric), 2) AS "gcCoin",
            ROUND(CAST(SUM(COALESCE(sc_coin, 0) + COALESCE(bonus_sc, 0) + COALESCE(promocode_bonus_sc, 0)) AS numeric), 2) AS "scCoin", 
            transaction_id :: varchar AS "transactionId",
            status AS "status",
            is_success AS "isSuccess",
            deposit_transaction_id AS "paymentTransactionId",
            package_id AS "packageId",
            (
                CASE
                    WHEN transaction_type = 'deposit'
                    OR transaction_type = 'addGc'
                    OR transaction_type = 'addSc' THEN 1
                    WHEN transaction_type = 'redeem'
                    OR transaction_type = 'removeGc'
                    OR transaction_type = 'removeSc' THEN 0
                    ELSE NULL
                END
            ) AS "actionId",
            NULL AS "beforeBalance",
            NULL AS "afterBalance",
            NULL AS "roundId",
            NULL AS "tournamentId",
            more_details AS "moreDetails",
            promocode_id AS "promocodeId"
        FROM
            transaction_bankings
        WHERE
            transaction_banking_id IS ${isBankingNotAllowed} NULL
            AND transaction_type NOT IN ('redeem')
            AND actionee_id = :userId ${providerNameBanking} ${actionTypeBanking} ${bankingCoinType}
            AND transaction_bankings.updated_at >= :startDate AND transaction_bankings.updated_at <= :endDate
        GROUP BY transaction_id, actionee_id, actionee_email,payment_method,is_success, deposit_transaction_id, package_id, promocode_id, transaction_type, status, created_at, updated_at, amount, more_details
        UNION
        ALL
        SELECT
        user_id AS "actioneeId",
        game_id AS "gameId",
        (
          SELECT
            name
          from
            public.master_casino_games
          where
            game_id :: INTEGER = master_casino_game_id :: INTEGER
        ) AS "gameName",
        NULL AS "paymentProvider",
        casino_transactions.created_at as "startTime",
        casino_transactions.updated_at as "endTime",
        (CASE WHEN action_type = 'bet' THEN 'Play' WHEN action_type = 'lost' THEN 'Spend' ELSE action_type END) AS "actionType",
        amount AS "amount",
        gc AS "gcCoin",
        sc AS "scCoin",
        transaction_id :: varchar AS "transactionId",
        status AS "status",
        (CASE WHEN status = 1 THEN true ELSE false END) AS "isSuccess",
        NULL AS "paymentTransactionId",
        NULL AS "packageId",
        action_id::integer AS "actionId",
        before_balance AS "beforeBalance",
        after_balance AS "afterBalance",
        round_id AS "roundId",
        "tournament_id" AS "tournamentId",
        casino_transactions.more_details AS "moreDetails",
        NULL AS "promocodeId"
        FROM
            casino_transactions
            LEFT JOIN master_casino_games ON casino_transactions.game_id::INTEGER = master_casino_games.master_casino_game_id::INTEGER
            LEFT JOIN master_casino_providers ON master_casino_games.master_casino_provider_id = master_casino_providers.master_casino_provider_id
        WHERE
            casino_transactions.casino_transaction_id IS ${isCasinoNotAllowed} NULL
            AND casino_transactions.user_id = :userId ${actionTypeCasino} ${providerNameCasino} ${casinoCoinValue} 
            ${gameId ? `AND casino_transactions.game_id::INTEGER = ${gameId}` : ''} 
            ${gameName ? `AND master_casino_games.name ILIKE '%${gameName}%'` : ''}
            AND casino_transactions.created_at >= :startDate AND casino_transactions.created_at <= :endDate
        UNION
        ALL
        SELECT  
        user_id AS "actioneeId",
        NULL AS "gameId",
        NULL AS "gameName",
        payment_provider AS "paymentProvider",
        created_at as "startTime",
        updated_at as "endTime",
        'redeem' AS "actionType",
        amount AS "amount",
        NULL AS "gcCoin",
        amount AS "scCoin",
        transaction_id :: varchar AS "transactionId",
        status AS "status",
        (CASE WHEN status = 1 THEN true ELSE false END)  AS "isSuccess",
        NULL AS "paymentTransactionId",
        NULL AS "packageId",
        0 AS "actionId",
        NULL AS "beforeBalance",
        NULL AS "afterBalance",
        NULL AS "roundId",
        NULL AS "tournamentId",
        more_details AS "moreDetails",
        NULL AS "promocodeId"
        FROM
            withdraw_requests
        WHERE
            withdraw_request_id IS ${isWithdrawalNotAllowed} NULL
            AND user_id = :userId ${providerNameWithdrawal}
            AND withdraw_requests.updated_at >= :startDate AND withdraw_requests.updated_at <= :endDate
    ) AS subquery
ORDER BY
    "startTime" DESC OFFSET :offset
LIMIT
    :limit;  
    `
    const data = await sequelize.query(query, {
      replacements: {
        userId: userId || null,
        limit,
        offset,
        startDate: startOfDay,
        endDate: endOfDay,
        gameId: gameId,
        gameName: gameName
      },
      type: QueryTypes.SELECT
    })

    data.forEach(obj => {
      for (const key in obj) {
        if (obj[key] === null) {
          delete obj[key] // Remove key with null value
        }
      }
    })

    return data
  }
}
