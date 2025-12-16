import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'
import { filterBySearchGroup, pageValidation } from '../../utils/common'

export class GetAllPackagesService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        TransactionBanking: TransactionBankingModel
      }
    } = this.context

    const { orderBy, pageNo, limit, sort, search = '', packageId = '', isActive = '', packageType, isArchive = '' } = this.args
    let query
    const orderArray = []
    try {
      if (packageId) query = { ...query, packageId: +packageId }
      if (isActive && isActive !== 'all') {
        switch (isActive) {
          case 'upcoming':
            query = {
              ...query,
              [Op.and]: [
                { validFrom: { [Op.gt]: new Date() } },
                { validFrom: { [Op.not]: null } },
                { validTill: { [Op.not]: null } },
                { isActive: false }
              ]
            }
            break
          case 'expired':
            query = {
              ...query,
              [Op.or]: [
                { isActive: false, validTill: { [Op.and]: [{ [Op.lt]: new Date() }, { [Op.not]: null }] } },
                {
                  isActive: false,
                  [Op.or]: [
                    { validTill: null },
                    { validTill: { [Op.lt]: new Date() } },
                    { validFrom: { [Op.lt]: new Date() } }]
                }]
            }
            break

          case 'active':
            query = { ...query, isActive: true }
            break

          default:
            break
        }
      }
      if (isArchive !== '') {
        query = { ...query, deletedAt: { [Op.not]: null } }
      }

      if (packageType && packageType !== 'all') {
        switch (packageType) {
          case 'special':
            query = { ...query, isSpecialPackage: true }
            break
          case 'purchase':
            query = { ...query, purchaseNo: { [Op.not]: 0 } }
            break
          case 'welcome':
            query = { ...query, welcomePurchaseBonusApplicable: true }
            break
          case 'basic':
            query = { ...query, welcomePurchaseBonusApplicable: false, purchaseNo: 0, isSpecialPackage: false }
            break
          default:
            query = { ...query }
            break
        }
      }

      if (search) query = filterBySearchGroup(query, search)
      if (!pageNo && !limit && orderBy === 'orderId') {
        orderArray.push([orderBy || 'orderId', sort || 'ASC'])
      } else {
        orderArray.push([orderBy || 'packageId', sort || 'DESC'])
      }

      const { page, size } = pageValidation(pageNo, limit)
      const [totalCount, packageList] = await Promise.all([
        PackageModel.count({
          where: { ...query },
          paranoid: !isArchive
        }),
        PackageModel.findAll({
          where: { ...query },
          attributes: ['packageId', 'orderId', 'amount', 'gcCoin', 'scCoin', 'packageName', 'bonusGc', 'bonusSc', 'welcomePurchaseBonusApplicable', 'isSpecialPackage', 'purchaseNo', 'validFrom', 'validTill', 'isActive', 'packageTag',
            [Sequelize.literal('CAST(COUNT("TransactionBankings"."transaction_banking_id") AS INTEGER)'), 'claimedCount']
          ], // Getting the required columns
          include: [ // Including Transaction Banking table to find the claimed count with status success
            {
              model: TransactionBankingModel,
              attributes: [],
              required: false,
              where: {
                status: TRANSACTION_STATUS.SUCCESS
              }
            }
          ],
          group: ['Package.package_id'],
          order: orderArray,
          limit: size,
          offset: (page - 1) * size,
          paranoid: !isArchive,
          subQuery: false
        })
      ])
      if (!packageList) return this.addError('NotFound')

      return { success: true, packageList: { count: totalCount, rows: packageList }, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
