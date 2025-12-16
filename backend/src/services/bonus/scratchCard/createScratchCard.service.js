import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'

export class CreateScratchCardService extends ServiceBase {
  async run () {
    const {
      dbModels: { ScratchCardConfiguration: ScratchCardConfigurationModel, ScratchCards: ScratchCardsModel, ScratchCardBudgetUsage: ScratchCardBudgetUsageModel },
      sequelizeTransaction: transaction
    } = this.context
    let { scratchCardId, scratchCardName, isActive, message, config, budgets } = this.args
    try {
      let scratchCardIdKey
      let msg = SUCCESS_MSG.CREATE_SUCCESS

      const totalPercentage = config.reduce((sum, item) => {
        return sum + (item.percentage)
      }, 0)
      if (totalPercentage > 100) {
        msg = `Total percentage of scratch card is ${totalPercentage}%. It should not exceed 100%.`
        return { success: false, message: msg }
      }

      if (scratchCardId !== null && scratchCardId !== undefined) {
        scratchCardIdKey = scratchCardId
        // Only keep new config entries (exclude those with existing IDs)
        config = config.filter(item => !item.id)
      } else {
        // Create new scratch card
        const trimmedName = scratchCardName?.trim()
        if (!trimmedName) {
          return { success: false, message: 'Scratch Card Name Should Not Be Empty' }
        }

        const newScratchCard = await ScratchCardsModel.create({ scratchCardName: trimmedName, isActive, message }, { transaction })
        scratchCardIdKey = newScratchCard.scratchCardId
        if (budgets && budgets.length > 0) {
          const bulkData = budgets.map(budget => ({
            scratchCardId: scratchCardIdKey,
            ...budget
          }))

          await ScratchCardBudgetUsageModel.bulkCreate(bulkData, { transaction })
        }
      }

      for (const item of config) {
        const { rewardType, minReward, maxReward, percentage, playerLimit, isActive, imageUrl, message: description } = item

        const existingRecords = await ScratchCardConfigurationModel.findAll({
          where: {
            scratchCardId: scratchCardIdKey,
            rewardType,
            isActive: true
          },
          paranoid: true,
          transaction
        })

        if (existingRecords.length > 0) {
          const hasRewardRangeConflict = existingRecords.some(r => r.minReward === minReward && r.maxReward === maxReward)
          if (hasRewardRangeConflict) {
            msg = `Min ${minReward} and Max ${maxReward} reward already exist for scratchCardId ${scratchCardIdKey} and rewardType ${rewardType}`
            return { success: false, message: msg }
          }

          const exactExistingRecord = await ScratchCardConfigurationModel.findOne({
            where: { scratchCardId: scratchCardIdKey, rewardType, minReward, maxReward, percentage, playerLimit, isActive },
            transaction
          })

          if (exactExistingRecord) {
            msg = 'Record Already exist'
            return { success: false, message: msg }
          }
        }

        await ScratchCardConfigurationModel.create(
          { scratchCardId: scratchCardIdKey, rewardType, minReward, maxReward, percentage, playerLimit, isActive, imageUrl: imageUrl || null, message: description || null },
          { transaction }
        )
      }

      return { success: true, message: msg }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
