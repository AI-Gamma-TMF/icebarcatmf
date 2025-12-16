import { Op } from 'sequelize'
import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { pageValidation } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TICKET_STATUS, TICKET_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    ticketType: { type: 'string' },
    adminSearch: { type: 'string' },
    statusSearch: { type: 'string' },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] },
    limit: { type: 'string' },
    pageNo: { type: 'string' }
  },
  required: ['ticketType']
}

const constraints = ajv.compile(schema)

export class UserTicketListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { ticketType, adminSearch, statusSearch, startDate, endDate, pageNo, limit } = this.args

    const { page, size } = pageValidation(pageNo, limit)
    try {
      let query
      if (+ticketType !== 0) query = { ticketType: ticketType }
      if (adminSearch) query = { ...query, assignTo: +adminSearch }
      if (statusSearch) query = { ...query, status: statusSearch }
      if (startDate && endDate) {
        query = {
          ...query,
          createdAt: {
            [Op.and]: {
              [Op.gte]: `${(new Date(startDate)).toISOString().substring(0, 10)} 00:00:00.000+00`,
              [Op.lte]: `${(new Date(endDate)).toISOString().substring(0, 10)} 23:59:59.999+00`
            }
          }
        }
      }

      const ticketList = await db.UserTickets.findAndCountAll({
        where: query,
        include: [
          { model: db.AdminUser, as: 'admin' },
          { model: db.User, attributes: ['userId', 'lastName', 'email', 'firstName'], as: 'user' }
        ],
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: ((page - 1) * size)
      })

      const pendingCount = await db.UserTickets.count({
        col: 'id',
        where: {
          ...query,
          status: TICKET_STATUS.PENDING
        }
      })

      const unassignedCount = await db.UserTickets.count({
        col: 'id',
        where: {
          ...query,
          status: TICKET_STATUS.UNASSIGNED
        }
      })

      const totalVerificationTicket = await db.UserTickets.count({
        col: 'id',
        where: {
          ticketType: TICKET_TYPE.VERIFICATION
        }
      })

      const totalRedemptionTicket = await db.UserTickets.count({
        col: 'id',
        where: {
          ticketType: TICKET_TYPE.REDEMPTION
        }
      })

      const totalExpiryTicket = await db.UserTickets.count({
        col: 'id',
        where: {
          ticketType: TICKET_TYPE.EXPIRY
        }
      })

      const totalFraudTicket = await db.UserTickets.count({
        col: 'id',
        where: {
          ticketType: TICKET_TYPE.FRAUD
        }
      })

      ticketList.pendingCount = pendingCount
      ticketList.unassignedCount = unassignedCount
      ticketList.totalVerificationTickets = totalVerificationTicket
      ticketList.totalRedemptionTickets = totalRedemptionTicket
      ticketList.totalExpiryTickets = totalExpiryTicket
      ticketList.totalFraudTickets = totalFraudTicket

      return { message: SUCCESS_MSG.USER_TICKETS, ticketList }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
