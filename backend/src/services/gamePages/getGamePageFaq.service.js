import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

// Validation schema for input
const schema = {
  type: 'object',
  properties: {
    gamePageId: { type: ['string', 'integer'] },
    limit: { type: ['string'] },
    pageNo: { type: ['string'] },
    sort: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    search: { type: ['string', 'null'] },
    isActive: { type: ['string', 'null'], enum: ['true', 'false', 'all'] }
  },
  required: ['gamePageId']
}

const constraints = ajv.compile(schema)

export class GetGamePageFaqService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { GamePageFaq: GamePagesFaqModel, GamePages: GamePagesModel }
    } = this.context

    const { gamePageId, limit, pageNo, sort, orderBy, search, isActive } = this.args
    const query = { gamePageId }
    let faqs

    try {
      const { page, size } = pageValidation(pageNo, limit)

      if (search) {
        query.question = { [Op.iLike]: `%${search}%` }
      }

      if (isActive && isActive !== 'all') {
        query.isActive = isActive === 'true'
      }

      const commonOptions = {
        where: query,
        order: [[orderBy || 'createdAt', sort || 'ASC']],
        attributes: [
          'gamePageFaqId',
          'question',
          'answer',
          'gamePageId'
        ],
        include: [
          { model: GamePagesModel, attributes: ['title'] }
        ]
      }

      if (limit && pageNo) {
        faqs = await GamePagesFaqModel.findAndCountAll({
          ...commonOptions,
          limit: size,
          offset: (page - 1) * size
        })
      } else {
        faqs = await GamePagesFaqModel.findAndCountAll(commonOptions)
      }

      // Extract metaTitle from the first FAQ's BlogPost
      let gamePageTitle = null
      if (faqs?.rows?.length > 0) {
        gamePageTitle = faqs.rows[0].GamePage?.title || null
      } else {
        const gamePageDetails = await GamePagesModel.findOne({
          attributes: ['title'],
          where: { gamePageId },
          raw: true
        })
        gamePageTitle = gamePageDetails?.title
      }
      faqs.gamePageTitle = gamePageTitle
      return {
        faqs,
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
