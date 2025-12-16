import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { TICKET_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    ticketId: { type: 'number' },
    assignTo: { type: 'number' }
  },
  required: ['ticketId', 'assignTo']
}

const constraints = ajv.compile(schema)

export class AssignTicketService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { ticketId, assignTo } = this.args

      const transaction = this.context.sequelizeTransaction

      const checkAdminUserExist = await getOne({ attributes: ['adminUserId'], model: db.AdminUser, data: { adminUserId: assignTo }, transaction })

      if (!checkAdminUserExist) return this.addError('AdminNotFoundErrorType')

      const ticket = await getOne({ model: db.UserTickets, data: { id: ticketId }, transaction })

      if (!ticket) return this.addError('TicketNotFoundType')

      if (ticket.resolve) return this.addError('TicketResolvedType')

      ticket.assignTo = assignTo
      ticket.status = TICKET_STATUS.PENDING
      ticket.assignedOn = new Date()

      await ticket.save({ transaction })

      return { message: SUCCESS_MSG.USER_TICKET_ASSIGNED }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
