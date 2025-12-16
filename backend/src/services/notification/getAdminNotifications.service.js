import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'
import { pageValidation } from '../../utils/common'
import { Op } from 'sequelize'
import { Sequelize } from '../../db/models'

const schema = {
  type: 'object',
  properties: {
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    contentSearch: { type: ['string', 'null'] },
    isUnread: { type: ['string', 'null'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    type: { type: 'string' }
  }
}
const constraints = ajv.compile(schema)

export class GetAdminNotifications extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { limit, pageNo, contentSearch, type, isUnread, sort, orderBy } = this.args
    const { id } = this.context.req.body

    try {
      const query = {}

      const { page, size } = pageValidation(pageNo, limit)

      if (contentSearch) {
        query[Op.or] = [
          { title: { [Op.iLike]: `%${contentSearch}%` } },
          { message: { [Op.iLike]: `%${contentSearch}%` } }
        ]
      }

      if (type) {
        query.type = type
      } else {
        query.type = { [Op.notIn]: ['CRITICAL_ALERT'] }
      }

      if (isUnread === 'true') {
        query.where = Sequelize.literal(`NOT ("status" @> '[${id}]'::jsonb)`)
      }

      const notifications = await this.fetchData({
        query,
        size,
        offset: (page - 1) * size,
        sort,
        orderBy,
        type
      })

      return { message: SUCCESS_MSG.GET_SUCCESS, notifications }
    } catch (error) {
      console.error(
        'Error fetching admin notifications:',
        error.message,
        error.stack
      )

      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ query, size, offset, sort, orderBy, type }) {
    const {
      dbModels: { AdminNotification: AdminNotificationModel }
    } = this.context

    const { id } = this.context.req.body

    let typeWhere = "AND type != 'CRITICAL_ALERT'"
    if (type === 'CRITICAL_ALERT') typeWhere = "AND type = 'CRITICAL_ALERT'"

    const data = await AdminNotificationModel.findAndCountAll({
      where: query,
      order: [[orderBy || 'createdAt', sort || 'DESC']],
      limit: size,
      offset
    })

    const unreadCount = await AdminNotificationModel.count({
      where: Sequelize.literal(`NOT ("status" @> '${JSON.stringify([id])}'::jsonb) ${typeWhere}`)
    })

    return { rows: data.rows, count: data.count, unreadCount }
  }
}
