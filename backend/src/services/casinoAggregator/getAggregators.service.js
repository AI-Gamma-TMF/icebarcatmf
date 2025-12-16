import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAggregatorService extends ServiceBase {
  async run () {
    const {
      dbModels: { MasterGameAggregator: MasterGameAggregatorModel }
    } = this.context
    const { limit, pageNo, search, isActive, orderBy, sort } = this.args

    try {
      let query
      const order = [[orderBy || 'createdAt', sort || 'DESC']]
      const attributes = [
        'masterGameAggregatorId',
        'name',
        'isActive',
        'freeSpinAllowed',
        'adminEnabledFreespin',
        'createdAt'
      ]

      const { page, size } = pageValidation(pageNo, limit)
      if (search) {
        if (/^\d+$/.test(search)) {
          query = { masterGameAggregatorId: +search }
        } else {
          query = { name: { [Op.iLike]: `%${search}%` } }
        }
      }
      if (isActive && isActive !== 'all') query = { ...query, isActive }

      query = { ...query, isHidden: false }

      let casinoAggregator
      if (pageNo && limit) {
        casinoAggregator = await MasterGameAggregatorModel.findAndCountAll({
          attributes,
          where: query,
          order: order,
          limit: size,
          offset: (page - 1) * size
        })
      } else {
        casinoAggregator = await MasterGameAggregatorModel.findAndCountAll({
          attributes,
          where: query,
          order: order,
          limit: size
        })
      }
      if (!casinoAggregator) return this.addError('GameAggregatorNotExistsErrorType')

      return { casinoAggregator, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
