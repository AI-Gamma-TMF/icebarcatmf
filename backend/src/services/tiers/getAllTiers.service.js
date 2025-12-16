import { Op } from 'sequelize'
import config from '../../configs/app.config'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetAllTiersService extends ServiceBase {
  async run () {
    const {
      dbModels: { Tier: TierModel }
    } = this.context

    let query = {}

    const { limit, pageNo, search, isActive, orderBy, sort, level } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    if (search) {
      if (/^\d+$/.test(search)) {
        query = { ...query, tierId: +search }
      } else {
        query = {
          ...query, name: { [Op.iLike]: `%${search.trim()}%` }
        }
      }
    }

    if (level && level !== 'all') query = { ...query, level }
    if (isActive && isActive !== 'all') query = { ...query, isActive }
    let tiers = []
    let totalActiveTiers
    if (pageNo && limit) {
      [tiers, totalActiveTiers] = await Promise.all([TierModel.findAndCountAll({
        where: query,
        limit: size,
        offset: (page - 1) * size,
        order: [[orderBy || 'level', sort || 'ASC']]
      }),
      TierModel.count({ where: { isActive: true } })])
    } else {
      [tiers, totalActiveTiers] = await Promise.all([
        TierModel.findAndCountAll({
          where: query,
          order: [[orderBy || 'level', sort || 'ASC']]
        }),
        TierModel.count({ where: { isActive: true } })
      ])
    }

    Promise.all(
      tiers.rows.map(tier => {
        return tier.icon
          ? (tier.dataValues.icon = `${config.get('s3.S3_DOMAIN_KEY_PREFIX')}${
              tier.icon
            }`)
          : null
      })
    )

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      tiers,
      totalActiveTiers
    }
  }
}
