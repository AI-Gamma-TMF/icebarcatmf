import db, { sequelize } from '../../db/models'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TICKET_STATUS, TICKET_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    adminSearch: { type: 'string' },
    endDate: { type: ['string', 'null'] },
    startDate: { type: ['string', 'null'] }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class AgentOverviewService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { adminSearch, startDate, endDate } = this.args
    let query
    if (adminSearch) query = { adminUserId: adminSearch }
    try {
      const agentOverview = await db.AdminUser.findAll({
        attributes: ['adminUserId', 'firstName', 'lastName',
          [sequelize.literal(`(SELECT COUNT(id) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND created_at BETWEEN 
          TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'totalResolved'],
          [sequelize.literal(`(SELECT COUNT(id) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.VERIFICATION}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'verificationResolved'],
          [sequelize.literal(`(SELECT COUNT(id) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.REDEMPTION}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'redemptionResolved'],
          [sequelize.literal(`(SELECT COUNT(id) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.EXPIRY}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'expiryResolved'],
          [sequelize.literal(`(SELECT COUNT(id) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.FRAUD}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'fraudResolved'],
          [sequelize.literal(`(SELECT COUNT(id) FROM user_tickets WHERE assign_to = "AdminUser".admin_user_id::integer AND resolve = false AND status = '${TICKET_STATUS.PENDING}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'pendingTickets'],
          [sequelize.literal(`(SELECT AVG(resolved_in) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'avgTotalTime'],
          [sequelize.literal(`(SELECT AVG(resolved_in) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.VERIFICATION}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'avgVerificationTime'],
          [sequelize.literal(`(SELECT AVG(resolved_in) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.REDEMPTION}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'avgRedemptionTime'],
          [sequelize.literal(`(SELECT AVG(resolved_in) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.EXPIRY}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'avgExpiryTime'],
          [sequelize.literal(`(SELECT AVG(resolved_in) FROM user_tickets WHERE (user_tickets.more_details->>'resolvedBy')::integer = "AdminUser".admin_user_id::integer AND resolve = true AND status = '${TICKET_STATUS.SUCCESS}' AND ticket_type = '${TICKET_TYPE.FRAUD}' AND created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate} 00:00:00.000+00' 
          AND TIMESTAMP WITH TIME ZONE '${endDate} 23:59:59.999+00')`), 'avgFraudTime']
        ],
        where: query
      })

      return { message: SUCCESS_MSG.USER_TICKETS, agentOverview }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
