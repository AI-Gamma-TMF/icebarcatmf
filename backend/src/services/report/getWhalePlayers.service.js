import { Sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import { filterByDateCreatedAt, pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetWhalePlayersService extends ServiceBase {
  async run () {
    const {
      dbModels: { WhalePlayers: WhalePlayersModel }
    } = this.context

    const { startDate, endDate, orderBy, sort, limit, pageNo } = this.args

    let query = {}
    try {
      if (startDate || endDate) {
        query = filterByDateCreatedAt(query, startDate, endDate, 'WhalePlayers')
      }
      const { page, size } = pageValidation(pageNo, limit)
      const data = await WhalePlayersModel.findAll({
        attributes: [
          'user_id',
          [
            Sequelize.literal('TRUNC(SUM(total_purchase_amount)::numeric, 2)'),
            'total_purchase_amount'
          ],
          [Sequelize.literal('SUM(purchase_count)::numeric'), 'purchase_count'],
          [
            Sequelize.literal(
              'TRUNC(SUM(total_redemption_amount)::numeric, 2)'
            ),
            'total_redemption_amount'
          ],
          [
            Sequelize.literal('SUM(redemption_count)::numeric'),
            'redemption_count'
          ],
          [
            Sequelize.literal(
              'TRUNC(SUM(total_pending_redemption_amount)::numeric, 2)'
            ),
            'total_pending_redemption_amount'
          ],
          [
            Sequelize.literal('SUM(pending_redemption_count)::numeric'),
            'pending_redemption_count'
          ],
          [
            Sequelize.literal('SUM(cancelled_redemption_count)::numeric'),
            'cancelled_redemption_count'
          ],
          [
            Sequelize.literal('TRUNC(SUM(total_sc_bet_amount)::numeric, 2)'),
            'total_sc_bet_amount'
          ],
          [
            Sequelize.literal('TRUNC(SUM(total_sc_win_amount)::numeric, 2)'),
            'total_sc_win_amount'
          ]
        ],
        where: query,
        order: [[orderBy || 'createdAt', sort || 'DESC']],
        group: [
          'user_id',
          'total_purchase_amount',
          'purchase_count',
          'total_redemption_amount',
          'redemption_count',
          'total_pending_redemption_amount',
          'pending_redemption_count',
          'cancelled_redemption_count',
          'total_sc_bet_amount',
          'total_sc_win_amount',
          'created_at'
        ],
        offset: (page - 1) * size,
        limit: size
      })

      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        data
      }
    } catch (error) {
      console.error('Error in GetWhalePlayersService:', error)
      this.addError('InternalServerErrorType', error)
    }
  }
}
