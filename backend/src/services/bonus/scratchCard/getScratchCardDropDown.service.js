import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../../libs/serviceBase'

export class GetScratchCardDropDownService extends ServiceBase {
  async run () {
    const { dbModels: { ScratchCards: ScratchCardsModel } } = this.context

    try {
      const scratchCards = await ScratchCardsModel.findAll({
        where: { isActive: true },
        attributes: ['scratchCardId', 'scratchCardName'],
        order: [['scratchCardId', 'ASC']],
        paranoid: true
      })
      return { success: true, message: SUCCESS_MSG.GET_SUCCESS, scratchCards }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
