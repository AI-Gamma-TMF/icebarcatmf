import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'
import ajv from '../../../libs/ajv'
import { removeData } from '../../../utils/common'
const schema = {
  type: 'object',
  properties: {
    scratchCardId: { type: 'integer' },
    configId: { type: ['integer', 'null'] }
  },
  required: ['scratchCardId']
}

const constraints = ajv.compile(schema)

export class DeleteScratchCardService extends ServiceBase {
  get constraints () {
    return constraints
  }

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

    const { configId, scratchCardId } = this.args
    let message = SUCCESS_MSG.DELETE_SUCCESS

    try {
      // Scratch Card update (no configId) Parent record
      if (scratchCardId && (configId === 'null' || configId === null)) {
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
        // Deleting Scratch Card
        await Promise.all([
          ScratchCardsModel.update({ isActive: false, deletedAt: new Date() }, { where: { scratchCardId }, transaction }),
          ScratchCardConfigurationModel.update({ isActive: false, deletedAt: new Date() }, { where: { scratchCardId }, transaction }),
          ScratchCardBudgetUsageModel.update({ isActive: false, deletedAt: new Date() }, { where: { scratchCardId }, transaction })
        ])
        message = SUCCESS_MSG.DELETE_SUCCESS
      }

      // Config update (has configId) child record
      if (scratchCardId && configId) {
        // Fetch existing active records (excluding soft-deleted ones)
        const existingRecords = await ScratchCardConfigurationModel.findAll({
          where: { scratchCardId, isActive: true },
          paranoid: true,
          transaction
        })
        // Exclude current record from the check
        const others = existingRecords.filter(r => r.id !== configId)
        // If there are no other active records, then given record cannot be deleted
        if (others.length === 0) {
          return { success: false, message: 'Unable to Delete. Atleast one configutation should be exist' }
        }
        message = SUCCESS_MSG.DELETE_SUCCESS
        // Delete the record
        await ScratchCardConfigurationModel.update(
          { deletedAt: new Date(), isActive: false },
          { where: { id: configId }, transaction }
        )
      }
      await removeData(`scratchCardConfig:${scratchCardId}`)
      await removeData(`scratchCardBudgetsList:${scratchCardId}`)
      return { success: true, message }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
