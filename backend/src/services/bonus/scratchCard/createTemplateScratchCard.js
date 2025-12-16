import ServiceBase from '../../../libs/serviceBase'
import { CreateScratchCardService } from './createScratchCard.service'
import { DeleteScratchCardService } from './deleteScratchCard.service'
export class CreateTemplateScratchCardService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        ScratchCardConfiguration: ScratchCardConfigurationModel,
        Bonus: BonusModel,
        Package: PackageModel,
        ScratchCards: ScratchCardsModel,
        ScratchCardBudgetUsage: ScratchCardBudgetUsageModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const { scratchCardId } = this.args

    try {
      const isScratchCardExist = await ScratchCardsModel.findAll({
        where: { scratchCardId },
        attributes: ['scratchCardName', 'isActive', 'message'],
        paranoid: true,
        include: [
          {
            model: ScratchCardConfigurationModel,
            as: 'scratchCardConfigs',
            attributes: ['minReward', 'maxReward', 'percentage', 'playerLimit', 'isActive', 'rewardType', 'imageUrl', 'message'],
            order: [['id', 'ASC']],
            required: false,
            paranoid: true
          },
          {
            model: ScratchCardBudgetUsageModel,
            as: 'scratchCardBudgets',
            required: false,
            attributes: ['budgetType', 'budgetAmount', 'periodStart', 'periodEnd', 'isActive'],
            paranoid: true
          }
        ]
      })
      if (isScratchCardExist) {
        const [bonusCheck, packagesCheck] = await Promise.all([
          BonusModel.findAll({ where: { scratchCardId }, transaction }),
          PackageModel.findAll({ where: { scratchCardId }, transaction })
        ])

        if (bonusCheck.length > 0) {
          return { success: false, message: 'Scratch Card is already in use for Daily bonus' }
        }
        if (packagesCheck.length > 0) {
          return { success: true, message: 'Scratch Card is already in use for Package' }
        }

        let scratchCardObj
        const scratchCardConfigs = []
        let scratchCardBudgets = null

        isScratchCardExist.forEach(item => {
          scratchCardObj = {
            scratchCardName: item.dataValues.scratchCardName,
            isActive: item.dataValues.isActive,
            message: item.dataValues.message
          }

          // Flatten all config dataValues
          scratchCardConfigs.push(...item.scratchCardConfigs.map(cfg => cfg.dataValues))
          scratchCardBudgets = item.scratchCardBudgets.map(cfg => {
            const values = cfg.dataValues
            return {
              ...values,
              periodStart: values.periodStart?.toISOString(),
              periodEnd: values.periodEnd?.toISOString()
            }
          })
        })
        await DeleteScratchCardService.run({ configId: null, scratchCardId }, this.context)
        const result = await CreateScratchCardService.run({ scratchCardId: null, ...scratchCardObj, config: scratchCardConfigs, budgets: scratchCardBudgets }, this.context)

        return result
      }

      return { success: false, message: 'Scratch card does not exist' }
    } catch (error) {
      throw new Error(error)
    }
  }
}
