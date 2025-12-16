import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { Sequelize } from '../../db/models'

export class GetCalenderViewEventsService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tournament: TournamentModel,
        Package: PackageModel,
        Promocode: PromocodeModel,
        Raffles: RafflesModel,
        CRMPromotion: CRMPromotionModel
      }
    } = this.context
    const { startDate, endDate, type } = this.args

    try {
      const promiseMap = {}

      // Tournament
      if (type.includes('tournament') || type.includes('all')) {
        promiseMap.tournament = TournamentModel.findAll({
          attributes: [['tournament_id', 'id'], ['title', 'name'], 'startDate', 'endDate',
            [Sequelize.literal('"status"::integer'), 'status']],
          where: {
            [Op.and]: [
              { startDate: { [Op.lte]: endDate } },
              { endDate: { [Op.gte]: startDate } }
            ]
          }
        })
      }

      // Raffles
      if (type.includes('raffles') || type.includes('all')) {
        promiseMap.raffles = RafflesModel.findAll({
          attributes: [['raffle_id', 'id'], ['title', 'name'], 'startDate', 'endDate',
            [Sequelize.literal('CASE  WHEN start_date > NOW() THEN 0 WHEN start_date <= NOW() AND end_date >= NOW() THEN 1 WHEN end_date < NOW() THEN 2 END'), 'status']],
          where: {
            [Op.and]: [
              { startDate: { [Op.lte]: endDate } },
              { endDate: { [Op.gte]: startDate } }
            ]
          }
        })
      }

      // Package
      if (type.includes('packages') || type.includes('all')) {
        promiseMap.packages = PackageModel.findAll({
          attributes: [['package_id', 'id'], ['package_name', 'name'], ['valid_from', 'startDate'], ['valid_till', 'endDate'],
            [Sequelize.literal('CASE  WHEN valid_from > NOW() THEN 0 WHEN valid_from <= NOW() AND valid_till >= NOW() THEN 1 WHEN valid_till < NOW() THEN 2 END'), 'status']],

          where: {
            [Op.and]: [
              { validFrom: { [Op.lte]: endDate } },
              { validTill: { [Op.gte]: startDate } }
            ]
          }
        })
      }

      // CRM Promocode
      if (type.includes('crmPromocode') || type.includes('all')) {
        promiseMap.crmPromocode = PromocodeModel.findAll({
          attributes: [['promocode_id', 'id'], ['promocode', 'name'], ['valid_from', 'startDate'], ['valid_till', 'endDate'], 'status'],
          where: {
            crmPromocode: true,
            [Op.and]: [
              { validFrom: { [Op.lte]: endDate } },
              { validTill: { [Op.gte]: startDate } }
            ]
          }
        })
      }

      // Purchase Promocode
      if (type.includes('purchasePromocode') || type.includes('all')) {
        promiseMap.purchasePromocode = PromocodeModel.findAll({
          attributes: [['promocode_id', 'id'], ['promocode', 'name'], ['valid_from', 'startDate'], ['valid_till', 'endDate'], 'status'],
          where: {
            crmPromocode: false,
            [Op.and]: [
              { validFrom: { [Op.lte]: endDate } },
              { validTill: { [Op.gte]: startDate } }
            ]
          }
        })
      }

      // CRM Bonus
      if (type.includes('crmBonus') || type.includes('all')) {
        promiseMap.crmBonus = CRMPromotionModel.findAll({
          attributes: [['crm_promotion_id', 'id'], 'name', ['valid_from', 'startDate'], ['expire_at', 'endDate'], 'status'],
          where: {
            crmPromocode: false,
            [Op.and]: [
              { validFrom: { [Op.lte]: endDate } },
              { expireAt: { [Op.gte]: startDate } }
            ]
          }
        })
      }

      // Execute all promises
      const resolvedResults = await Promise.all(Object.values(promiseMap))

      // Map resolved values to their keys
      const result = {}
      Object.keys(promiseMap).forEach((key, idx) => { result[key] = resolvedResults[idx] || undefined })

      return { success: true, data: result, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
