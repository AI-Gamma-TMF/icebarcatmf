import ServiceBase from '../../libs/serviceBase'
import { Op } from 'sequelize'
import { pageValidation } from '../../utils/common'
import { BONUS_TYPE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetPromoCodeDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserBonus: UserBonusModel,
        PromotionCode: PromotionCodeModel
      }
    } = this.context

    const { promocodeId, sort, pageNo, limit, orderBy, userId, status, search, bonusSc, bonusGc } = this.args
    const promoDetail = await PromotionCodeModel.findOne({
      where: {
        promocodeId
      }
    })

    if (!promoDetail) return this.addError('PromocodeNotFoundErrorType')
    let userWhere = {}
    let userBonusWhere = {
      promocodeId,
      bonusType: BONUS_TYPE.AFFILIATE_BONUS
    }

    if (status && status !== 'all') userBonusWhere = { ...userBonusWhere, status }
    if (userId) userWhere = { ...userWhere, userId: +userId }
    if (search) userWhere = { ...userWhere, [Op.or]: [{ username: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }] }
    if (bonusSc) userBonusWhere = { ...userBonusWhere, scAmount: { [Op.eq]: +bonusSc } }
    if (bonusGc) userBonusWhere = { ...userBonusWhere, gcAmount: { [Op.eq]: +bonusGc } }

    let pagination = {}
    if (pageNo && limit) {
      const { page, size } = pageValidation(pageNo, limit)
      pagination = {
        limit: size,
        offset: (page - 1) * size
      }
    }

    const userBonusDetail = await UserBonusModel.findAndCountAll({
      attributes: [
        'userId',
        'status',
        'createdAt',
        'claimedAt',
        'gcAmount',
        'scAmount'
      ],
      include: [
        {
          where: userWhere,
          model: UserModel,
          attributes: ['username', 'firstName', 'lastName', 'email']
        }
      ],
      ...pagination,
      where: userBonusWhere,
      order: [[orderBy || 'promocodeId', sort || 'DESC']]
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      promoCodeDetails: { promoDetail, userBonusDetail }
    }
  }
}
