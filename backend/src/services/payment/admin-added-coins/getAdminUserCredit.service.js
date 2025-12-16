import { Op } from 'sequelize'
import { sequelize } from '../../../db/models'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { TRANSACTION_STATUS } from '../../../utils/constants/constant'
import { pageValidation } from '../../../utils/common'
export class GetAdminCreditUserService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        TransactionBanking: TransactionBankingModel
      }
    } = this.context

    const {
      pageNo,
      limit,
      orderBy,
      sort,
      idSearch,
      emailSearch,
      firstNameSearch,
      adminUserId
    } = this.args

    let query = {}
    try {
      if (idSearch) query = { actioneeId: +idSearch }
      if (emailSearch) { query = { ...query, actioneeEmail: { [Op.iLike]: `%${emailSearch}%` } } }
      if (firstNameSearch) { query = { ...query, actioneeName: { [Op.iLike]: `%${firstNameSearch}%` } } }
      const { page, size } = pageValidation(pageNo, limit)

      const orderMapping = {
        userId: 'actioneeId',
        userEmail: 'actioneeEmail',
        userName: 'actioneeName'
      }
      const dbOrderBy = orderMapping[orderBy] || orderBy

      const result = await TransactionBankingModel.findAndCountAll({
        attributes: [
          'transactionBankingId',
          [sequelize.col('actionee_id'), 'userId'],
          [sequelize.col('actionee_email'), 'userEmail'],
          [sequelize.col('actionee_name'), 'name'],
          'amount',
          'transactionType',
          'createdAt'
        ],
        where: {
          [Op.and]: [
            sequelize.literal(`(more_details->>'adminUserId')::INTEGER = ${adminUserId}`),
            { transactionType: { [Op.in]: ['addSc', 'removeSc'] } },
            { status: TRANSACTION_STATUS.SUCCESS },
            { ...query, status: 1 },
            { isSuccess: true },
            { amount: { [Op.gt]: 0 } }
          ]
        },
        order: [[dbOrderBy || 'createdAt', sort || 'DESC']],
        limit: size,
        offset: (page - 1) * size,
        raw: true
      })
      return { message: SUCCESS_MSG.GET_SUCCESS, data: result }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  } // run method end
}
