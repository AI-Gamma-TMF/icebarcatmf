import ServiceBase from '../../libs/serviceBase'
import { getCachedData } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetRibbonDataService extends ServiceBase {
  async run () {
    try {
      let ribbonData = await getCachedData('ribbon-setting')

      if (ribbonData) ribbonData = JSON.parse(ribbonData)

      return { ribbonData, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
