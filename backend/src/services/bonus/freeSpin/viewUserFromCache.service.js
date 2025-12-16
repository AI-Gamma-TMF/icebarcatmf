import ServiceBase from '../../../libs/serviceBase'
import { getCachedData } from '../../../utils/common'
import { USER_CATEGORY } from '../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../utils/constants/success'

export class ViewUserFromCacheService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel }
    } = this.context
    const { viewCategory } = this.args
    try {
      const isValidCategory = Object.values(USER_CATEGORY).includes(viewCategory)
      if (!isValidCategory) return this.addError('RequestInputValidationErrorType')
      const userCategoryJson = await getCachedData('user-status-freeSpin-user-list')
      if (!userCategoryJson) return this.addError('RequestInputValidationErrorType')
      const userCategory = JSON.parse(userCategoryJson)

      const viewUserCategory = userCategory[viewCategory]
      const viewUserIds = viewUserCategory.map(u => u.userId)

      const categoryUsers = await UserModel.findAndCountAll({
        attributes: ['userId', 'email', 'username', 'firstName', 'lastName'],
        where: {
          userId: viewUserIds
        },
        raw: true
      })

      return { message: SUCCESS_MSG.GET_SUCCESS, data: categoryUsers }
    } catch (error) {
      console.log('Error in GetProviderListAllowSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
