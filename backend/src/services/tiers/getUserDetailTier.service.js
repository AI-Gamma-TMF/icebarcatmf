import { times } from 'number-precision'
import { sequelize } from '../../db/models'
import { Op } from 'sequelize'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export class GetUserDetailTierService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        Tier: TierModel,
        User: UserModel,
        UserTier: UserTierModel,
        GlobalSetting: GlobalSettingModel
      }
    } = this.context

    const { tierId, sort, pageNo, limit, search } = this.args

    let { orderBy } = this.args

    const tierDetail = await TierModel.findOne({
      where: {
        tierId
      }
    })

    if (!tierDetail) return this.addError('TierNotFoundErrorType')
    let query = {}
    if (search) {
      if (/^\d+$/.test(search)) {
        query = { userId: +search }
      } else {
        query = {
          [Op.or]: [
            { username: { [Op.iLike]: `%${search}%` } }
          ]
        }
      }
    }

    let pagination = {}
    if (pageNo && limit) {
      const { page, size } = pageValidation(pageNo, limit)
      pagination = {
        limit: size,
        offset: (page - 1) * size
      }
    }

    const [{ value: SC_TO_GC_RATE }, { value: XP_SC_TO_GC_RATE }] =
      await GlobalSettingModel.findAll({
        attributes: ['key', 'value'],
        where: {
          key: ['SC_TO_GC_RATE', 'XP_SC_TO_GC_RATE']
        }
      })

    const scGCRate =
      +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE) > 0
        ? +times(+SC_TO_GC_RATE, +XP_SC_TO_GC_RATE)
        : 1

    if (orderBy === 'username' || orderBy === 'firstName' || orderBy === 'lastName') {
      orderBy = `"User.${orderBy}"`
    } else if (orderBy === 'requiredXp') {
      orderBy = `"${orderBy}"`
    } else if (orderBy === 'userId') {
      orderBy = '"UserTier"."user_id"'
    } else if (orderBy) {
      orderBy = `"UserTier.${orderBy}"`
    } else {
      orderBy = '"UserTier.updatedAt"'
    }

    const tierUserDetail = await UserTierModel.findAndCountAll({
      attributes: {
        include: [
          sequelize.literal(
            '(SELECT name FROM public.tiers WHERE level = max_level) AS "maxLevel"'
          ),
          [
            sequelize.literal(
              `ROUND("UserTier"."sc_spend" + ( "UserTier"."gc_spend" / ${+scGCRate} ))`
            ),
            'requiredXp'
          ]
        ],
        exclude: ['userTierId', 'tierId', 'createdAt']
      },
      include: [
        {
          where: query,
          model: UserModel,
          attributes: ['username', 'userId', 'firstName', 'lastName']
        }
      ],
      ...pagination,
      where: {
        tierId: tierDetail.tierId
      },
      order: [[sequelize.literal(orderBy), sort || 'DESC']]
    })

    return {
      success: true,
      message: SUCCESS_MSG.GET_SUCCESS,
      tierUserDetail
    }
  }
}
