import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdatePackageStatusService extends ServiceBase {
  async run () {
    const {
      packageId,
      isActive
    } = this.args

    const {
      dbModels: {
        Package: PackageModel
      },
      sequelizeTransaction: transaction
    } = this.context

    if (packageId <= 0) return this.addError('InvalidIdErrorType')

    try {
      const checkPackageExists = await PackageModel.findOne({
        where: { packageId: packageId },
        transaction
      })

      if (!checkPackageExists) return this.addError('PackageNotFoundErrorType')

      await PackageModel.update({ isActive }, { where: { packageId }, transaction })
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
