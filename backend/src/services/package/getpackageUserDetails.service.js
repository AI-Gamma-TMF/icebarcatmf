import { sequelize } from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../utils/constants/constant'
import { Op } from 'sequelize'
import { SUCCESS_MSG } from '../../utils/constants/success'

const schema = {
  type: 'object',
  properties: {
    packageId: { type: 'string' },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    idSearch: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] }
  },
  required: ['packageId']
}

const constraints = ajv.compile(schema)

export class GetPackageUserDetailsService extends ServiceBase {
  get constraints () {
    return constraints()
  }

  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        TransactionBanking: TransactionBankingModel,
        Promocode: PromoCodesModel,
        User: UserModel
      }
    } = this.context

    const { packageId, pageNo, limit, search, idSearch } = this.args

    try {
      const isPackageExist = await PackageModel.findOne({
        where: { packageId: +packageId },
        attributes: [[sequelize.literal('1'), 'exists']]
      })

      if (!isPackageExist) return this.addError('PackageNotFoundErrorType')
      let query = {}
      const { page, size } = pageValidation(pageNo, limit)
      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { username: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }
      const pkgWhere = {
        packageId: +packageId,
        transactionType: TRANSACTION_TYPE.DEPOSIT,
        status: TRANSACTION_STATUS.SUCCESS
      }
      if (idSearch) {
        pkgWhere.actioneeId = +idSearch
      }
      const userDetails = await TransactionBankingModel.findAndCountAll({
        where: pkgWhere,
        include: [
          {
            model: UserModel,
            as: 'transactionUser',
            where: query,
            attributes: ['email', 'username']
          },
          {
            model: PackageModel,
            as: 'package',
            attributes: ['bonusSc']
          },
          {
            model: PromoCodesModel,
            as: 'promocode',
            attributes: ['promocodeId', 'isDiscountOnAmount']
          }
        ],
        attributes: [
          'actioneeId',
          [sequelize.literal('ROUND(SUM("TransactionBanking"."amount")::numeric, 2)'), 'claimedAmount'],
          [sequelize.literal('COUNT("TransactionBanking"."actionee_id")'), 'claimedCount'],
          [sequelize.literal('ROUND((COALESCE(SUM("TransactionBanking"."sc_coin"), 0) + COALESCE(SUM("TransactionBanking"."bonus_sc"), 0))::numeric, 2)'), 'creditedCoins'],
          [sequelize.literal(`
           ROUND((
              CASE 
                WHEN 
                  (
                    BOOL_OR("promocode"."is_discount_on_amount" = true)
                    AND BOOL_OR("TransactionBanking"."promocode_id" != 0)
                  )
                  OR BOOL_OR("TransactionBanking"."promocode_id" = 0)
                  OR BOOL_OR("TransactionBanking"."bonus_sc" IS NULL)
                  OR BOOL_OR("TransactionBanking"."bonus_sc" = 0)
                  OR BOOL_OR("TransactionBanking"."sub_package_id" IS NOT NULL)
                THEN 0
                ELSE
                  COALESCE(SUM("TransactionBanking"."bonus_sc"), 0) -
                  COALESCE(SUM("package"."bonus_sc"), 0)
              END
            )::numeric, 2)
          `), 'promocodeBonus'],
          ['sc_coin', 'scCoin'],
          ['promocode_id', 'promocodeUseCount']
        ],
        group: [
          'TransactionBanking.actionee_id',
          'TransactionBanking.sc_coin',
          'TransactionBanking.promocode_id',
          'transactionUser.user_id',
          'package.package_id',
          'promocode.promocode_id'
        ],
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
