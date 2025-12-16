import ServiceBase from '../../../libs/serviceBase'
import { BONUS_STATUS } from '../../../utils/constants/constant'
import { pageValidation } from '../../../utils/common'
import { Op } from 'sequelize'
import { SUCCESS_MSG } from '../../../utils/constants/success'
export class GetFreeSpinUserDetailsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        FreeSpinBonusGrant: FreeSpinBonusGrantModel,
        UserBonus: UserBonusModel,
        User: UserModel
      },
      sequelize
    } = this.context

    const { freeSpinId, pageNo = 1, limit = 15, search, statusSearch } = this.args
    try {
      const freeSpinExist = await FreeSpinBonusGrantModel.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'isNotifyUser', 'moreDetails'] },
        where: { freeSpinId: +freeSpinId },
        raw: true
      })

      if (!freeSpinExist) return this.addError('FreeSpinBonusNotExistErrorType')

      const { page, size } = pageValidation(pageNo, limit)

      let userWhere = {}
      if (search) {
        if (/^\d+$/.test(search)) {
          userWhere = { userId: +search }
        } else {
          userWhere = {
            [Op.or]: [
              { username: { [Op.iLike]: `%${search}%` } },
              { email: { [Op.iLike]: `%${search}%` } }
            ]
          }
        }
      }

      const bonusWhere = { freeSpinId: +freeSpinId }
      if (statusSearch && Object.values(BONUS_STATUS).includes(statusSearch.toUpperCase())) {
        bonusWhere.status = statusSearch.toUpperCase()
      }

      const amountColumn = freeSpinExist?.coinType === 'SC' ? 'sc_amount' : 'gc_amount'

      const totalCount = await UserBonusModel.count({
        where: bonusWhere,
        include: [{
          model: UserModel,
          where: userWhere
        }]
      })

      const users = await UserBonusModel.findAll({
        attributes: [
          'userId',
          'status',
          'userBonusId',
          [sequelize.col(amountColumn), 'totalWinAmount'],
          [sequelize.col('User.username'), 'username'],
          [sequelize.col('User.email'), 'email']
        ],
        where: bonusWhere,
        include: [{
          model: UserModel,
          attributes: [],
          where: userWhere
        }],
        order: [[sequelize.col(amountColumn), 'DESC']],
        limit: size,
        offset: (page - 1) * size,
        raw: true,
        subQuery: false
      })

      return { count: totalCount, rows: users || [], success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      console.log(error)
      return this.addError('InternalServerErrorType', error)
    }
  }
}
