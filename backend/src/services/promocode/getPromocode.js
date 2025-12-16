import { Op, fn, col, cast } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation, calculateDate } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { PROMOCODE_STATUS } from '../../utils/constants/constant'
export class GetPromocodeDetailService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Promocode: PromocodeModel,
        UserActivities: UserActivitiesModel,
        CRMPromotion: CRMPromotionModel
      }
    } = this.context

    const { pageNo, limit, status, crmPromocode, name, promotionType, isArchive = '', promocodeSearch, discountPercentage, maxUsersAvailed, validTill, validFrom, timezone, orderBy, sort } = this.args
    try {
      const { page, size } = pageValidation(pageNo, limit)
      let query = {}
      const attributesArray = ['promocodeId', 'promocode', 'discountPercentage', 'isDiscountOnAmount', 'perUserLimit', 'maxUsersAvailed', 'status', 'validFrom', 'crmPromocode', 'validTill', [cast(fn('COUNT', col('userActivities.promocode_id')), 'INTEGER'), 'maxUsersAvailedCount'], 'createdAt']
      if (promocodeSearch) {
        if (/^\d+$/.test(promocodeSearch)) {
          query = { promocodeId: +promocodeSearch }; attributesArray.push('package')
        } else {
          query = {
            [Op.or]: [
              { promocode: { [Op.iLike]: `%${promocodeSearch}%` } }
            ]
          }
        }
      }
      if (validTill || validFrom) {
        const { startDate, endDate } = calculateDate(validTill, validFrom, timezone)
        if (startDate) {
          query = { ...query, validFrom: { [Op.gte]: startDate } }
        }
        if (endDate) {
          query = { ...query, validTill: { [Op.lte]: endDate } }
        }
      }
      if (status !== 'all' && [PROMOCODE_STATUS.UPCOMING, PROMOCODE_STATUS.ACTIVE, PROMOCODE_STATUS.EXPIRED, PROMOCODE_STATUS.DELETED].includes(+status)) query = { ...query, status }
      if (crmPromocode) query = { ...query, crmPromocode }
      else query = { ...query, crmPromocode: false }
      if (isArchive !== '') {
        query = { ...query, deletedAt: { [Op.not]: null } }
      }
      if (discountPercentage) query = { ...query, discountPercentage: +discountPercentage }
      if (maxUsersAvailed) query = { ...query, maxUsersAvailed: +maxUsersAvailed }
      // if (validFrom) query = { ...query, validFrom: { [Sequelize.Op.gte]: validFrom } }
      // if (validTill) query = { ...query, validTill: { [Sequelize.Op.lte]: validTill } }

      let includeWhere = {}
      if (name) includeWhere = { ...includeWhere, name: { [Op.iLike]: `%${name}%` } }
      if (promotionType) includeWhere = { ...includeWhere, promotionType }

      const include = [
        {
          model: UserActivitiesModel,
          as: 'userActivities',
          attributes: []
        }
      ]
      const group = ['Promocode.promocode_id']

      if (crmPromocode) {
        include.push({
          model: CRMPromotionModel,
          as: 'crmPromotion',
          where: includeWhere,
          attributes: ['name', 'promotionType', 'campaignId']
        })
        group.push('crmPromotion.crm_promotion_id')
      }
      const [totalCount, promocodeDetailRow] = await Promise.all([
        PromocodeModel.count({
          where: query,
          paranoid: !isArchive
        }),
        PromocodeModel.findAll({
          attributes: attributesArray,
          where: query,
          paranoid: !isArchive,
          include,
          offset: (page - 1) * size,
          limit: size,
          order: [[orderBy || 'createdAt', sort || 'DESC']],
          group: group,
          subQuery: false
        })])

      return {
        success: true,
        promocodeDetail: { count: totalCount, rows: promocodeDetailRow },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
