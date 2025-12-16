import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    gamePageId: {
      type: ['string', 'null']
    },
    search: {
      type: ['string', 'null']
    },
    isActive: {
      type: ['string', 'null']
    },
    isDropDown: {
      type: ['boolean', 'null']
    },
    orderBy: {
      type: ['string', 'null']
    },
    sort: {
      type: ['string', 'null']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetGamePageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePages: GamePagesModel }
    } = this.context

    const { pageNo, limit, gamePageId, search, isActive = 'all', isDropDown, orderBy, sort } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)

      let query = {}

      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { slug: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }

      if ((isActive !== 'all')) query = { ...query, isActive }

      if (gamePageId) query = { ...query, gamePageId: +gamePageId }

      let attributes = gamePageId ? { exclude: ['updatedAt'] } : { exclude: ['htmlContent', 'updatedAt'] }

      if (isDropDown) {
        attributes = ['title', 'gamePageId']
      }

      const GamePageDetails = await GamePagesModel.findAndCountAll({
        attributes,
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'createdAt', sort || 'DESC']]
      })

      return { GamePageDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
