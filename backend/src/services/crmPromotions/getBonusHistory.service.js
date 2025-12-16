import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { BONUS_TYPE } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetCRMBonusHistoryService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        User: UserModel,
        UserBonus: UserBonusModel,
        CRMPromotion: CRMPromotionModel
      }
    } = this.context

    const { unifiedSearch, isActive, crmPromotionId, status, sortBy, orderBy, pageNo, limit } = this.args

    let where = {}
    let userWhere = {}

    const crmBonusDetails = await CRMPromotionModel.findOne({
      where: { crmPromotionId: crmPromotionId },
      attributes: ['crmPromotionId', 'promocode', 'name', 'campaignId', 'status', 'scAmount', 'gcAmount', 'promotionType', ['valid_from', 'startDate'], ['expire_at', 'endDate']],
      paranoid: false,
      raw: true
    })

    if (!crmBonusDetails) return this.addError('PromocodeDoesNotExistsErrorType')

    const { page, size } = pageValidation(pageNo, limit)

    if (status) where = { ...where, status }

    if (unifiedSearch) {
      if (/^\d+$/.test(unifiedSearch)) {
        userWhere = { userId: +unifiedSearch }
      } else {
        userWhere = {
          [Op.or]: [
            { username: { [Op.iLike]: `%${unifiedSearch}%` } },
            { firstName: { [Op.iLike]: `%${unifiedSearch}%` } },
            { lastName: { [Op.iLike]: `%${unifiedSearch}%` } },
            { email: { [Op.iLike]: `%${unifiedSearch}%` } }
          ]
        }
      }
    }
    if (isActive && isActive !== 'all') userWhere = { ...userWhere, isActive }

    const userDetails = await UserBonusModel.findAndCountAll({
      attributes: ['scAmount', 'gcAmount', 'status', 'claimedAt'],
      where: {
        bonusType: BONUS_TYPE.PROMOTION_BONUS,
        promocodeId: crmPromotionId,
        ...where
      },
      limit: size,
      offset: (page - 1) * size,
      include: [
        {
          model: UserModel,
          attributes: [
            'userId',
            'email',
            'username',
            'isActive',
            'firstName',
            'lastName'
          ],
          where: userWhere
        }
      ],
      order: [[sortBy || 'createdAt', orderBy || 'DESC']],
      paranoid: false
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      crmBonusDetails,
      userDetails
    }
  }
}
