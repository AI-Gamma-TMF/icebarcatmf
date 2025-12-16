import { Op, Sequelize } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'
import dayjs from 'dayjs'
export class GetPromoCodesService extends ServiceBase {
  async run () {
    const {
      dbModels: { PromotionCode: PromotionCodeModel }
    } = this.context

    let where = ''

    let { promocode, pageNo, limit, isActive, sort, orderBy, affiliateId, validTill, bonusSc, bonusGc, timezone } = this.args
    if (promocode) {
      if (/^\d+$/.test(promocode)) {
        where = { promocodeId: +promocode }
      } else {
        where = { promocode: { [Op.iLike]: `%${promocode}%` } }
      }
    }
    if (validTill) {
      const userTimezone = timezone ? TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone.toUpperCase()] : 'Etc/GMT'
      const now = dayjs().tz(userTimezone)
      const safeEnd = validTill ? dayjs(validTill).tz(userTimezone).endOf('day') : now.endOf('day')
      validTill = safeEnd.utc().toDate()
    }

    if (affiliateId) where = { ...where, affiliateId: +affiliateId }
    if (isActive && isActive !== 'all') where = { ...where, isActive }
    if (validTill) where = { ...where, validTill: { [Sequelize.Op.lte]: validTill } }
    if (bonusSc) where = { ...where, bonusSc: +bonusSc }
    if (bonusGc) where = { ...where, bonusGc: +bonusGc }
    const { page, size } = pageValidation(pageNo, limit)

    const pagination = (pageNo && limit) ? { offset: (page - 1) * size, limit: size } : {}

    const promoCodes = await PromotionCodeModel.findAndCountAll({
      attributes: {
        exclude: ['user_id', 'status', 'availed_at', 'deleted_at']
      },
      where: where,
      ...pagination,
      order: [[orderBy || 'createdAt', sort || 'DESC']]
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      promoCodes: promoCodes.rows,
      count: promoCodes.count
    }
  }
}
