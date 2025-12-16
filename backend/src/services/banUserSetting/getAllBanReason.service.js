import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'

export class GetAllBanReasonService extends ServiceBase {
  async run () {
    let query
    const { limit, pageNo, search, isActive = 'all', sort, orderBy, isAccountClose } = this.args
    const {
      dbModels: {
        BanUserSetting: BanUserSettingModel
      }
    } = this.context
    try {
      const { page, size } = pageValidation(pageNo, limit)
      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { reasonTitle: { [Op.iLike]: `%${search}%` } },
            { reasonDescription: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }
      if ((isActive !== 'all')) query = { ...query, isActive }
      query = { ...query, deactivateReason: isAccountClose }

      const data = await BanUserSettingModel.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [[orderBy || 'reasonId', sort || 'DESC']],
        where: query,
        limit: size,
        offset: ((page - 1) * size)
      })
      return { data, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
