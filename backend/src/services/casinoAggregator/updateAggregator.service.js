import ServiceBase from '../../libs/serviceBase'
import { cancelledEnabledFreeSpinJobScheduler, deleteSubCategoryKeys, refreshMaterializedView } from '../../utils/common'
import { TOGGLE_CASE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class UpdateAggregatorStatusService extends ServiceBase {
  async run () {
    const {
      dbModels: { MasterGameAggregator: MasterGameAggregatorModel },
      sequelizeTransaction: transaction
    } = this.context

    const { isActive, aggregatorId, freeSpinAllowed = false } = this.args

    try {
      const checkAggregatorExists = await MasterGameAggregatorModel.findOne({
        where: {
          masterGameAggregatorId: aggregatorId
        },
        transaction
      })

      if (!checkAggregatorExists) return this.addError('GameAggregatorNotExistsErrorType')

      const [affectCount] = await MasterGameAggregatorModel.update(
        {
          isActive
        },
        {
          where: {
            masterGameAggregatorId: aggregatorId
          },
          transaction
        }
      )

      if (affectCount) {
        if (isActive === false && freeSpinAllowed === true) {
          // trigger the job for change the status cancelled
          cancelledEnabledFreeSpinJobScheduler({
            entityType: TOGGLE_CASE.FREE_SPIN_AGGREGATOR,
            entityId: aggregatorId,
            status: false
          })
        }
      }
      await Promise.all([deleteSubCategoryKeys(), refreshMaterializedView(transaction)])

      return { message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
