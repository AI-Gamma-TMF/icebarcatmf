import { SUCCESS_MSG } from '../../utils/constants/success'
import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { BONUS_TYPE, FREE_SPIN_TYPE, FREE_SPINS_STATUS } from '../../utils/constants/constant'

export class GetAttachedGrantDropDownService extends ServiceBase {
  async run () {
    const { dbModels: { ScratchCards: ScratchCardsModel, FreeSpinBonusGrant: FreeSpinBonusGrantModel } } = this.context
    let { bonusType } = this.args

    try {
      let dropdownList = []
      bonusType = bonusType.trim()
      switch (bonusType) {
        case BONUS_TYPE.FREE_SPIN_BONUS :
          dropdownList = await FreeSpinBonusGrantModel.findAll({
            attributes: ['freeSpinId', 'title'],
            where: {
              freeSpinType: FREE_SPIN_TYPE.ATTACHED_GRANT,
              status: { [Op.in]: [FREE_SPINS_STATUS.UPCOMING, FREE_SPINS_STATUS.RUNNING] }
            },
            raw: true,
            order: [['freeSpinId', 'ASC']]
          })
          break

        case BONUS_TYPE.SCRATCH_CARD_BONUS :
          dropdownList = await ScratchCardsModel.findAll({
            where: { isActive: true },
            attributes: ['scratchCardId', 'scratchCardName'],
            order: [['scratchCardId', 'ASC']]
          })
          break

        default:
          return { success: false, message: 'Invalid bonus type' }
      }
      return { success: true, message: SUCCESS_MSG.GET_SUCCESS, dropdownList }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
