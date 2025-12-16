import { sequelize } from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE
} from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    packageId: { type: 'string' },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] }
  },
  required: ['packageId']
}

const constraints = ajv.compile(schema)

export class GetRestorePackageUserDetailsService extends ServiceBase {
  get constraints () {
    return constraints()
  }

  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        TransactionBanking: TransactionBankingModel,
        User: UserModel
      }
    } = this.context

    const { packageId, pageNo, limit } = this.args

    try {
      const isPackageExist = await PackageModel.findOne({
        where: { packageId: +packageId },
        paranoid: false,
        raw: true
      })

      if (!isPackageExist) return this.addError('PackageNotFoundErrorType')

      const { page, size } = pageValidation(pageNo, limit)

      const userDetails = await TransactionBankingModel.findAndCountAll({
        where: {
          packageId: +isPackageExist?.packageId,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          status: TRANSACTION_STATUS.SUCCESS
        },
        include: {
          model: UserModel,
          as: 'transactionUser',
          attributes: ['email', 'username']
        },
        attributes: [
          'actioneeId',
          [sequelize.fn('SUM', sequelize.col('amount')), 'claimedAmount'],
          [sequelize.literal('COUNT(actionee_id)'), 'claimedCount']
        ],
        group: ['TransactionBanking.actionee_id', 'transactionUser.user_id'],
        limit: size,
        offset: (page - 1) * size
      })

      return {
        count: userDetails?.count?.length,
        userDetails: userDetails?.rows,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
