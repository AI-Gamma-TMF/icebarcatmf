import { Op, col } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { exportCenterAxiosCall, pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { CSV_TYPE, TRANSACTION_TYPE } from '../../utils/constants/constant'

export class PromocodeAppliedDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Promocode: PromocodeModel,
        ExportCenter: ExportCenterModel,
        TransactionBanking: TransactionBankingModel,
        User: UserModel
      },
      sequelize
    } = this.context

    const { promocodeId, pageNo, limit, isArchive, transactionId, packageId, isFirstDeposit, unifiedSearch, isActive, csvDownload, timezone } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    const transactionBankingQuery = { promocodeId: promocodeId, isSuccess: true, transactionType: TRANSACTION_TYPE.DEPOSIT }

    try {
      if (transactionId) transactionBankingQuery.transactionId = transactionId
      if (packageId) transactionBankingQuery.packageId = packageId
      if (isFirstDeposit) transactionBankingQuery.isFirstDeposit = isFirstDeposit

      // Promo code Query
      let paranoid = true
      const whereClause = { promocodeId: +promocodeId }
      if (isArchive) { whereClause.deletedAt = { [Op.not]: null }; paranoid = false }

      const promocodeExist = await PromocodeModel.findOne({
        attributes: ['promocodeId', 'promocode', 'validFrom', 'status', 'validTill', 'package'],
        where: whereClause,
        paranoid,
        raw: true
      })
      let userQuery = {}
      if (!promocodeExist) return this.addError('PromocodeNotExistErrorType')
      if (unifiedSearch) {
        if (/^\d+$/.test(unifiedSearch)) {
          userQuery = { userId: +unifiedSearch }
        } else {
          userQuery = {
            [Op.or]: [
              { username: { [Op.iLike]: `%${unifiedSearch}%` } },
              { firstName: { [Op.iLike]: `%${unifiedSearch}%` } },
              { lastName: { [Op.iLike]: `%${unifiedSearch}%` } },
              { email: { [Op.iLike]: `%${unifiedSearch}%` } }
            ]
          }
        }
      }

      if (isActive && isActive !== 'all') userQuery = { ...userQuery, isActive }

      const appliedDetails = await TransactionBankingModel.findAndCountAll({
        where: transactionBankingQuery,
        attributes: [[col('TransactionBanking.created_at'), 'claimedAt'], 'packageId', [col('TransactionBanking.actionee_id'), 'userId'], 'amount', 'scCoin', 'gcCoin', 'bonusSc', 'bonusGc', 'paymentMethod', 'transactionId', 'isFirstDeposit'],
        include: {
          as: 'transactionUser',
          where: userQuery,
          model: UserModel,
          required: true,
          attributes: ['userId', 'email', 'username', 'isActive', 'firstName', 'lastName']
        },
        limit: size,
        offset: (page - 1) * size,
        order: [['createdAt', 'DESC']]
      })
      // CSV Download for the promocode applied history
      let exportId, exportType
      if (csvDownload === true) {
        const transaction = await sequelize.transaction()
        try {
          const id = this.context.req.body.id
          const exportTable = await ExportCenterModel.create(
            {
              type: CSV_TYPE.PROMOCODE_APPLIED_HISTORY_CSV,
              adminUserId: id,
              payload: this.args
            },
            { transaction }
          )
          exportId = exportTable.dataValues.id
          exportType = exportTable.dataValues.type

          const axiosBody = {
            promocodeId: promocodeExist.promocodeId,
            promocode: promocodeExist.promocode,
            csvDownload: csvDownload,
            exportId: exportId,
            exportType: exportType,
            type: exportType,
            unifiedSearch,
            isActive,
            timezone: timezone,
            transactionBankingQuery
          }
          await exportCenterAxiosCall(axiosBody)
          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }

      return {
        success: true,
        promocodeExist,
        appliedDetails,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      console.log('error-1', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
