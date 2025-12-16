import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'

export class GetSpinWheelListService extends ServiceBase {
  async run () {
    const { dbModels: { WheelDivisionConfiguration: WheelDivisionConfigurationModel } } = this.context
    const wheelConfiguration = await WheelDivisionConfigurationModel.findAll({ order: [['wheelDivisionId', 'ASC']] })
    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS, wheelConfiguration }
  }

  catch (error) {
    this.addError('InternalServerErrorType', error)
  }
}
