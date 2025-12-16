import ServiceBase from '../../../libs/serviceBase'
import { getCachedData } from '../../../utils/common'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class GetUserFromCacheService extends ServiceBase {
  async run () {
    const userCategoryJson = await getCachedData('user-status-freeSpin-user-list')
    if (!userCategoryJson) return this.addError('NotFoundErrorType')
    const userCategory = JSON.parse(userCategoryJson)
    const result = Object.entries(userCategory).map(([status, users]) => ({
      status,
      count: users.length || 0
    }))
    return { data: result, message: SUCCESS_MSG.DELETE_SUCCESS }
  }
}
