import ServiceBase from '../../../libs/serviceBase'
import { getCachedData, setData } from '../../../utils/common'
import { USER_CATEGORY } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class DeleteUserFromCacheService extends ServiceBase {
  async run () {
    const { deleteCategory } = this.args
    try {
      const isValidCategory = Object.values(USER_CATEGORY).includes(deleteCategory)
      if (!isValidCategory) return this.addError('RequestInputValidationErrorType')
      const userCategoryJson = await getCachedData('user-status-freeSpin-user-list')
      if (!userCategoryJson) return this.addError('RequestInputValidationErrorType')
      const userCategory = JSON.parse(userCategoryJson)
      delete userCategory[deleteCategory]
      const DEFAULT_EXPIRY_REDIS_CLIENT_SECONDS = 60 * 30 // 30 minutes
      await setData('user-status-freeSpin-user-list', JSON.stringify(userCategory), DEFAULT_EXPIRY_REDIS_CLIENT_SECONDS)

      return { status: true, message: SUCCESS_MSG.DELETE_SUCCESS }
    } catch (error) {
      console.log('Error in GetProviderListAllowSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
