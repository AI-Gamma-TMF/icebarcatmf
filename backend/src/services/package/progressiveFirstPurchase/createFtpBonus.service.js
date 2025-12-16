import ServiceBase from '../../../libs/serviceBase'
import sequelize from 'sequelize'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class CreateFtpBonusService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Package: PackageModel,
        PackageFirstPurchaseBonuses: PackageFirstPurchaseBonusesModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const {
      packageId,
      firstPurchaseScBonus,
      firstPurchaseGcBonus
    } = this.args

    try {
      const [checkPackageExist, isBonusAlreadyExist, maxOrder] = await Promise.all([
        (PackageModel.findOne({
          attributes: ['firstPurchaseApplicable'],
          where: {
            packageId
          },
          transaction
        })),
        (
          PackageFirstPurchaseBonusesModel.findOne({
            attributes: [[sequelize.literal('1'), 'exists']],
            where: { packageId, firstPurchaseScBonus, firstPurchaseGcBonus },
            transaction
          })
        ),
        (
          PackageFirstPurchaseBonusesModel.findOne({
            attributes: [[sequelize.fn('MAX', sequelize.col('order_id')), 'maxOrderId']],
            where: { packageId },
            raw: true,
            transaction
          })
        )
      ])

      if (!checkPackageExist) return this.addError('PackageNotFoundErrorType')

      if (+firstPurchaseScBonus < 0 || +firstPurchaseGcBonus < 0) {
        return this.addError('FtpBonusValidationFailErrorType')
      }
      if (isBonusAlreadyExist) return this.addError('BonusExistErrorType')

      if (checkPackageExist && !(checkPackageExist.firstPurchaseApplicable)) {
        await PackageModel.update({ firstPurchaseApplicable: true, welcomePurchaseBonusApplicable: false, isSpecialPackage: false }, { where: { packageId }, transaction })
      }
      await PackageFirstPurchaseBonusesModel.create({
        firstPurchaseScBonus,
        firstPurchaseGcBonus,
        orderId: +maxOrder.maxOrderId + 1,
        packageId,
        isActive: true
      }, {
        transaction
      })

      return { success: true, message: SUCCESS_MSG.CREATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
