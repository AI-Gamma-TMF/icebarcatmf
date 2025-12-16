import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import { Op, literal } from 'sequelize'
import ajv from '../../../libs/ajv'
import { pageValidation, prepareImageUrl } from '../../../utils/common'

const schema = {
  type: 'object',
  properties: {
    scratchCardId: { type: ['integer', 'null'] },
    name: { type: ['string', 'null'] },
    limit: { type: ['string', 'null'] },
    pageNo: { type: ['string', 'null'] },
    orderBy: { type: ['string', 'null'] },
    sort: { type: ['string', 'null'], enum: ['ASC', 'DESC'] },
    isArchive: { type: 'string', enum: ['true', 'false'] },
    imageUrl: { type: ['string', 'null'] },
    message: { type: ['string', 'null'] }
  }
}

const constraints = ajv.compile(schema)
export class GetScratchCardListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { dbModels: { ScratchCards: ScratchCardsModel, ScratchCardConfiguration: ScratchCardConfigurationModel, UserBonus: UserBonusModel, ScratchCardBudgetUsage: ScratchCardBudgetUsageModel } } = this.context

    const { scratchCardId, name, limit, pageNo, orderBy, sort, isArchive = '' } = this.args
    const { page, size } = pageValidation(pageNo, limit)
    try {
      let query
      if (scratchCardId) query = { ...query, scratchCardId }
      if (name) query = { ...query, scratchCardName: { [Op.iLike]: `%${name}%` } }
      if (isArchive !== '') {
        query = { ...query, deletedAt: { [Op.not]: null } }
      }
      let scratchCards
      let totalCount
      if (pageNo && limit) {
        [totalCount, scratchCards] = await Promise.all([
          await ScratchCardsModel.count({
            where: query,
            paranoid: !isArchive
          }),
          await ScratchCardsModel.findAll({
            where: query,
            limit: size,
            offset: (page - 1) * size,
            order: [[orderBy || 'scratchCardId', sort || 'ASC']],
            paranoid: !isArchive,
            include: [
              {
                model: UserBonusModel,
                as: 'userBonus',
                attributes: [],
                required: false
              }
            ],
            attributes: [
              'scratchCardId',
              'scratchCardName',
              'isActive',
              'message',
              [
                literal('ROUND(SUM(CASE WHEN "userBonus"."status" = \'CLAIMED\' AND "userBonus"."bonus_type" = \'scratch-card-bonus\' THEN "userBonus"."sc_amount" ELSE 0 END)::numeric, 2)'),
                'totalClaimedScBonus'
              ],
              [
                literal('ROUND(SUM(CASE WHEN "userBonus"."status" = \'PENDING\' AND "userBonus"."bonus_type" = \'scratch-card-bonus\' THEN "userBonus"."sc_amount" ELSE 0 END)::numeric, 2)'),
                'pendingToClaimScBonus'
              ],
              [
                literal('SUM(CASE WHEN "userBonus"."status" = \'CLAIMED\' AND "userBonus"."bonus_type" = \'scratch-card-bonus\' THEN "userBonus"."gc_amount" ELSE 0 END)'),
                'totalClaimedGcBonus'
              ],
              [
                literal('SUM(CASE WHEN "userBonus"."status" = \'PENDING\' AND "userBonus"."bonus_type" = \'scratch-card-bonus\' THEN "userBonus"."gc_amount" ELSE 0 END)'),
                'pendingToClaimGcBonus'
              ],
              [
                literal('COUNT("userBonus"."scratch_card_id")'),
                'usedCount'
              ]
            ],
            group: ['ScratchCards.scratch_card_id']
          })
        ])
      } else {
        scratchCards = await ScratchCardsModel.findAll({
          where: query,
          attributes: ['scratchCardId', 'scratchCardName', 'isActive', 'dailyConsumedAmount', 'weeklyConsumedAmount', 'monthlyConsumedAmount'],
          order: [[{ model: ScratchCardConfigurationModel, as: 'scratchCardConfigs' }, 'id', 'ASC']],
          paranoid: !isArchive,
          include: [
            {
              model: ScratchCardConfigurationModel,
              as: 'scratchCardConfigs',
              attributes: ['id', 'scratchCardId', 'rewardType', 'minReward', 'maxReward', 'percentage', 'playerLimit', 'isActive', 'imageUrl', 'message'],
              paranoid: !isArchive
            },
            {
              model: ScratchCardBudgetUsageModel,
              as: 'scratchCardBudgets',
              where: { isActive: true },
              required: false,
              attributes: ['id', 'scratchCardId', 'budgetType', 'budgetAmount'],
              paranoid: true
            }
          ]
        })

        scratchCards.forEach(config => {
          config.scratchCardConfigs.forEach(scratchConfig => {
            scratchConfig.imageUrl = prepareImageUrl(scratchConfig?.imageUrl)
          })
        })
      }

      return { success: true, message: SUCCESS_MSG.GET_SUCCESS, count: totalCount, data: scratchCards }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
