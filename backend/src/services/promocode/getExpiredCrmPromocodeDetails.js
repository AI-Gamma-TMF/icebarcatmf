import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { Sequelize } from '../../db/models'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    promocode: {
      type: ['string', 'null']
    }
  },
  required: ['promocode']
}

const constraints = ajv.compile(schema)

export class GetExpiredCrmPromocodeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        Promocode: PromocodeModel,
        UserActivities: UserActivitiesModel
      }
    } = this.context

    const { pageNo, limit, promocode } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)

      const promocodeDetail = await PromocodeModel.findAndCountAll({
        attributes: [
          'promocodeId',
          'promocode',
          'status',
          'deletedAt',
          [
            Sequelize.json('more_details.StartDate'),
            'startDate'
          ],
          [
            Sequelize.json('more_details.EndDate'),
            'endDate'
          ],
          [
            Sequelize.json('more_details.CampaignID'),
            'campaignId'
          ]
        ],
        where: { promocode },
        paranoid: false,
        offset: (page - 1) * size,
        limit: size,
        order: [['createdAt', 'DESC']]
      })

      promocodeDetail.rows = await Promise.all(
        promocodeDetail.rows.map(async promocode => {
          const usedCount = await UserActivitiesModel.count({
            where: { promocodeId: promocode.promocodeId }
          })

          return {
            ...promocode.get(),
            isActive: !promocode.deletedAt,
            status: promocode.status,
            usedCount: usedCount
          }
        })
      )

      return {
        success: true,
        promocodeDetail,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
