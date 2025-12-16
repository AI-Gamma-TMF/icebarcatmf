import ServiceBase from '../../libs/serviceBase'
import ajv from '../../libs/ajv'
import { pageValidation } from '../../utils/common'
import { sequelize } from '../../db/models'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    promocodeId: { type: 'string' },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] }
  },
  required: ['promocodeId']
}

const constraints = ajv.compile(schema)
export class ViewReusePromocodesService extends ServiceBase {
  get constraints () {
    return constraints()
  }

  async run () {
    const {
      dbModels: {
        User: UserModel,
        Promocode: PromocodeModel,
        TransactionBanking: TransactionBankingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { promocodeId, pageNo, limit } = this.args

    try {
      const isPromocodeExist = await PromocodeModel.findOne({
        where: { promocodeId: +promocodeId },
        paranoid: false,
        raw: true,
        transaction
      })

      if (!isPromocodeExist) return this.addError('PromocodeNotExistErrorType')

      const { page, size } = pageValidation(pageNo, limit)

      const userDetails = await TransactionBankingModel.findAndCountAll({
        attributes: [
          'actioneeId',
          'packageId',
          [sequelize.literal('COUNT(actionee_id)'), 'claimedCount'],
          [sequelize.literal('(SELECT "package_name" FROM "package" WHERE "package"."package_id" = "TransactionBanking"."package_id")'), 'packageName']
        ],
        where: {
          promocodeId: +isPromocodeExist?.promocodeId,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          status: TRANSACTION_STATUS.SUCCESS
        },
        include: {
          model: UserModel,
          as: 'transactionUser',
          attributes: ['email', 'username']
        },
        group: ['TransactionBanking.actionee_id', 'transactionUser.user_id', 'TransactionBanking.package_id'],
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
