import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { exportCenterAxiosCall, pageValidation } from '../../utils/common'
import { COIN_TYPE, CASINO_TRANSACTION_STATUS, CSV_TYPE, BONUS_TYPE, ACTION } from '../../utils/constants/constant'

export class GetCasinoTransactionsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ExportCenter: ExportCenterModel
      }
    } = this.context

    let { pageNo, limit, casinoTransactionId, externalTransactionId, startDate, endDate, userName, transactionType, email, status, csvDownload, userId, amountType, gameId, sweepCoinUsed, orderBy, sort } = this.args
    try {
      let { page, size } = pageValidation(pageNo, limit)
      if (csvDownload) {
        page = null
        size = null
      }

      if (status && status !== 'all') {
        status = `${CASINO_TRANSACTION_STATUS[status.toUpperCase()]}`
      } else {
        status = null
      }

      if (orderBy) {
        switch (orderBy) {
          case 'casinoTransactionId':
            orderBy = 'casino_transactions.casino_transaction_id'
            break
          case 'userId':
            orderBy = 'casino_transactions.user_id'
            break
          case 'email':
            orderBy = 'users.email'
            break
          case 'transactionId':
            orderBy = 'casino_transactions.transaction_id'
            break
          case 'amountType':
            orderBy = 'casino_transactions.amount_type'
            break
          case 'gameId':
            orderBy = 'casino_transactions.game_id'
            break
          case 'updatedAt':
            orderBy = 'casino_transactions.updated_at'
            break
          default:
            break
        }
      }

      if (csvDownload === 'true') {
        const transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body
          const exportTbl = await ExportCenterModel.create({ type: CSV_TYPE.CASINO_TRANSACTION_CSV, adminUserId: id, payload: this.args }, { transaction })

          const axiosBody = { startDate, endDate, email, casinoTransactionId, externalTransactionId, userId, userName, transactionType, amountType, status, exportId: exportTbl.dataValues.id, exportType: exportTbl.dataValues.type, type: CSV_TYPE.CASINO_TRANSACTION_CSV, adminUserId: id, sweepCoinUsed, gameId, orderBy, sort }

          await exportCenterAxiosCall(axiosBody)
          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }
      const transactionDetail = await this.fetchData({ offset: (page - 1) * size, limit: size, startDate, endDate, email, casinoTransactionId, externalTransactionId, userId, userName, transactionType, amountType, status, gameId, sweepCoinUsed, orderBy, sort })
      return { transactionDetail, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ offset, startDate, endDate, limit, email, casinoTransactionId, externalTransactionId, userId, userName, transactionType, amountType, status, gameId, sweepCoinUsed, orderBy, sort }) {
    const [[{ count = 0 }], transactionDetail] = await Promise.all([
      sequelize.query(
      `
      SELECT
        COUNT(*) AS "count"
      FROM
        casino_transactions
        INNER JOIN users ON casino_transactions.user_id = users.user_id
      WHERE
        casino_transactions.created_at BETWEEN :startDate AND :endDate
        ${status ? 'AND status = :status' : ''}
        ${email ? 'AND users.email ILIKE :email' : ''}
        ${userName ? 'AND users.username ILIKE :userName' : ''}
        ${userId ? ' AND casino_transactions.user_id::text = :userId' : ''}
        ${externalTransactionId ? 'AND transaction_id = :transactionId' : ''}
        ${amountType && amountType !== 'all' ? 'AND amount_type = :amountType' : ''}
        ${casinoTransactionId ? 'AND casino_transaction_id = :casinoTransactionId' : ''}
        ${transactionType && transactionType === 'bonus' ? 'AND action_type IN (:actionType)' : ''}
        ${(transactionType && !(transactionType === 'all' || transactionType === 'bonus')) ? 'AND action_type = :actionType' : ''}
        ${gameId ? 'AND game_id = :gameId' : ''}
        ${sweepCoinUsed ? 'AND sc >= :sweepCoinUsed' : ''}
      `, {
        type: QueryTypes.SELECT,
        replacements: {
          startDate,
          endDate,
          ...(status ? { status } : {}),
          ...(userId ? { userId } : {}),
          ...(userName ? { userName: `%${userName}%` } : {}),
          ...(email ? { email: `%${email}%` } : {}),
          ...(casinoTransactionId ? { casinoTransactionId } : {}),
          ...(amountType && amountType !== 'all' ? { amountType } : {}),
          ...(externalTransactionId ? { transactionId: externalTransactionId } : {}),
          ...(transactionType && transactionType === 'bonus' ? { actionType: Object.values(BONUS_TYPE) } : {}),
          ...((transactionType && !(transactionType === 'all' || transactionType === 'bonus')) ? { actionType: ACTION[transactionType.toUpperCase()] } : {}),
          ...(gameId ? { gameId } : {}),
          ...(sweepCoinUsed ? { sweepCoinUsed } : {})
        }
      }
      ),
      sequelize.query(`
      SELECT
        casino_transaction_id AS "casinoTransactionId",
        transaction_id AS "transactionId",
        game_id AS "gameId",
        (SELECT name FROM public.master_casino_games WHERE master_casino_game_id :: INTEGER = game_id :: INTEGER) AS "name",
        amount,
        sc,
        gc,
        status,
        action_type AS "actionType",
        amount_type AS "amountType",
        casino_transactions.created_at AS "updatedAt",
        casino_transactions.more_details AS "moreDetails",
        users.email AS email,
        users.user_id AS "userId",
        users.username AS "userName"
      FROM
        casino_transactions
        INNER JOIN users ON casino_transactions.user_id = users.user_id
      WHERE
        casino_transactions.created_at BETWEEN :startDate AND :endDate
        ${status ? 'AND status = :status' : ''}
        ${email ? 'AND users.email ILIKE :email' : ''}
        ${userName ? 'AND users.username ILIKE :userName' : ''}
        ${userId ? ' AND casino_transactions.user_id::text = :userId' : ''}
        ${externalTransactionId ? 'AND transaction_id = :transactionId' : ''}
        ${amountType && amountType !== 'all' ? 'AND amount_type = :amountType' : ''}
        ${casinoTransactionId ? 'AND casino_transaction_id = :casinoTransactionId' : ''}
        ${transactionType && transactionType === 'bonus' ? 'AND action_type IN (:actionType)' : ''}
        ${(transactionType && !(transactionType === 'all' || transactionType === 'bonus')) ? 'AND action_type = :actionType' : ''}
        ${gameId ? 'AND game_id = :gameId' : ''}
        ${sweepCoinUsed ? 'AND sc >= :sweepCoinUsed' : ''}
    ORDER BY
    ${orderBy || 'casino_transactions.created_at'} ${sort || 'DESC'}
    LIMIT :limit OFFSET :offset;
    `, {
        type: QueryTypes.SELECT,
        replacements: {
          limit,
          offset,
          startDate,
          endDate,
          ...(status ? { status } : {}),
          ...(userId ? { userId } : {}),
          ...(userName ? { userName: `%${userName}%` } : {}),
          ...(email ? { email: `%${email}%` } : {}),
          ...(casinoTransactionId ? { casinoTransactionId } : {}),
          ...(amountType && amountType !== 'all' ? { amountType } : {}),
          ...(externalTransactionId ? { transactionId: externalTransactionId } : {}),
          ...(transactionType && transactionType === 'bonus' ? { actionType: Object.values(BONUS_TYPE) } : {}),
          ...((transactionType && !(transactionType === 'all' || transactionType === 'bonus')) ? { actionType: ACTION[transactionType.toUpperCase()] } : {}),
          ...(gameId ? { gameId } : {}),
          ...(sweepCoinUsed ? { sweepCoinUsed } : {})
        }
      })
    ])

    await Promise.all([
      transactionDetail.map(async (list, index) => {
        if (!list) return
        if (list.amountType === null) {
          let amountType = COIN_TYPE.SC
          if ((parseFloat(list.gc) > 0) & (parseFloat(list.sc) <= 0)) {
            amountType = COIN_TYPE.GC
          } else if ((parseFloat(list.gc) > 0) & (parseFloat(list.sc) > 0)) {
            amountType = COIN_TYPE.SC_GC
          }
          transactionDetail[index].amountType = amountType
        }
      })
    ])
    return {
      count: +count || 0,
      rows: transactionDetail
    }
  }
}
