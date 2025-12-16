import sequelize from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class UpdateFtpBonusService extends ServiceBase {
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
      packageFirstPurchaseId,
      firstPurchaseScBonus,
      firstPurchaseGcBonus
    } = this.args

    try {
      const [checkPackageExist, checkFtpPackageBonusExist, isBonusAlreadyExist] = await Promise.all([
        (PackageModel.findOne({
          attributes: [[sequelize.literal('1'), 'exists']],
          where: {
            packageId
          },
          transaction
        })),
        (
          PackageFirstPurchaseBonusesModel.findOne({
            where: {
              packageId,
              packageFirstPurchaseId
            },
            transaction
          })
        ),
        (
          PackageFirstPurchaseBonusesModel.findOne({
            attributes: [[sequelize.literal('1'), 'exists']],
            where: { packageId, firstPurchaseScBonus, firstPurchaseGcBonus },
            transaction
          })
        )
      ])

      if (!checkPackageExist) return this.addError('PackageNotFoundErrorType')
      if (!checkFtpPackageBonusExist) return this.addError('FirstPurchaseBonusNotExistErrorType')
      if (+firstPurchaseScBonus < 0 || +firstPurchaseGcBonus < 0) {
        return this.addError('FtpBonusValidationFailErrorType')
      }
      if (isBonusAlreadyExist) return this.addError('BonusExistErrorType')

      await PackageFirstPurchaseBonusesModel.update({
        firstPurchaseScBonus,
        firstPurchaseGcBonus
      }, {
        where: { packageId, packageFirstPurchaseId },
        transaction
      })

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
