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
    gamePageCardId: {
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
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetGamePageCardService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePageCards: GamePageCardsModel, GamePages: GamePagesModel }
    } = this.context

    const { pageNo, limit, gamePageCardId, gamePageId, search, isActive = 'all' } = this.args
    let GamePageCardDetails

    try {
      const { page, size } = pageValidation(pageNo, limit)

      let query = {}

      if (search) {
        query = {
          ...query,
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }

      if ((isActive !== 'all')) query = { ...query, isActive }

      if (gamePageCardId) query = { ...query, gamePageCardId: +gamePageCardId }
      if (gamePageId) query = { ...query, gamePageId: +gamePageId }

      const commonOptions = {
        where: query,
        order: [['createdAt' || 'ASC']],
        attributes: { exclude: ['updatedAt'] },
        include: [
          { model: GamePagesModel, attributes: ['title'] }
        ]
      }

      if (limit && pageNo) {
        GamePageCardDetails = await GamePageCardsModel.findAndCountAll({
          ...commonOptions,
          limit: size,
          offset: (page - 1) * size
        })
      } else {
        GamePageCardDetails = await GamePageCardsModel.findAndCountAll(commonOptions)
      }

      let gamePageTitle = null
      if (GamePageCardDetails?.rows?.length > 0) {
        gamePageTitle = GamePageCardDetails.rows[0].GamePage?.title || null
      } else {
        const gamePageDetail = await GamePagesModel.findOne({
          attributes: ['title'],
          where: { gamePageId },
          raw: true
        })
        gamePageTitle = gamePageDetail?.title
      }
      GamePageCardDetails.gamePageTitle = gamePageTitle

      return { GamePageCardDetails, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
