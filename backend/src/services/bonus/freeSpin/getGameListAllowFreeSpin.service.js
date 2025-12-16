import { Op } from 'sequelize'
import ServiceBase from '../../../libs/serviceBase'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { pageValidation } from '../../../utils/common'

export class GetGameListAllowFreeSpin extends ServiceBase {
  async run () {
    const {
      dbModels: { MasterCasinoGame: MasterCasinoGameModel, MasterCasinoProvider: MasterCasinoProviderModel, MasterGameAggregator: MasterGameAggregatorModel }
    } = this.context

    const { masterCasinoProviderId, limit, pageNo } = this.args
    try {
      const { page, size } = pageValidation(pageNo, limit)
      const result = await MasterCasinoGameModel.findAndCountAll({
        attributes: ['masterCasinoGameId', 'name', 'identifier'],
        include: [
          {
            model: MasterCasinoProviderModel,
            as: 'masterCasinoProvider',
            attributes: [],
            required: true,
            where: {
              freeSpinAllowed: true,
              adminEnabledFreespin: true
            },
            include: [
              {
                model: MasterGameAggregatorModel,
                attributes: [],
                required: true,
                where: {
                  freeSpinAllowed: true,
                  adminEnabledFreespin: true
                }
              }
            ]
          }
        ],
        where: {
          masterCasinoProviderId,
          hasFreespins: true,
          adminEnabledFreespin: true,
          freeSpinBetScaleAmount: { [Op.not]: null },
          isActive: true
        },
        limit: size,
        offset: (page - 1) * size,
        distinct: true
      })

      return { message: SUCCESS_MSG.GET_SUCCESS, data: { count: result?.count || 0, freeSpinGames: result?.rows } }
    } catch (error) {
      console.log('Error in GetGameListAllowSpinService', error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
