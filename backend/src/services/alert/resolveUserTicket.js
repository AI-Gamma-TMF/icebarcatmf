import db from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { getSuperAdminId } from '../../utils/common'
import { TICKET_STATUS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getOne } from '../../utils/crud'

const schema = {
  type: 'object',
  properties: {
    ticketId: { type: 'number' },
    user: { type: 'object' }
  },
  required: ['ticketId']
}

const constraints = ajv.compile(schema)

export class ResolveUserTicketService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { ticketId, user } = this.args
      const transaction = this.context.sequelizeTransaction

      const ticket = await getOne({
        model: db.UserTickets,
        data: { id: ticketId },
        transaction
      })

      if (!ticket) return this.addError('TicketNotFoundType')
      if (ticket.resolve) return this.addError('TicketResolvedType')

      if (+(user.adminUserId) !== await getSuperAdminId() && +(ticket.assignTo) !== +(user.adminUserId)) return this.addError('TicketNotAssignedType')

      const timeDifferenceInMilliseconds = new Date() - new Date(ticket.createdAt)

      const secondsDifference = timeDifferenceInMilliseconds / 1000

      ticket.resolve = true
      ticket.status = TICKET_STATUS.SUCCESS
      ticket.resolvedAt = new Date()
      ticket.resolvedIn = Math.round(secondsDifference)
      ticket.moreDetails = {
        ...ticket.moreDetails,
        resolvedBy: user.adminUserId
      }

      await ticket.save({ transaction })

      return { message: SUCCESS_MSG.USER_TICKET_RESOLVED }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
