import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class RestorePackageService extends ServiceBase {
  async run () {
    const {
      packageId
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
        paranoid: false,
        transaction
      })

      if (!checkPackageExists) return this.addError('PackageNotFoundErrorType')

      await PackageModel.restore({ where: { packageId }, transaction })
      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
