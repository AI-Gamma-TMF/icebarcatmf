import { Op, QueryTypes } from 'sequelize'
import ajv from '../../libs/ajv'
import db, { sequelize } from '../../db/models'
import ServiceBase from '../../libs/serviceBase'
import moment from 'moment'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation, exportCenterAxiosCall } from '../../utils/common'
import { USER_ACTIVITIES_TYPE, USER_STATUS, CSV_TYPE, RESPONSIBLE_GAMBLING_TYPE, TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'
const schema = {
  type: 'object',
  properties: {
    user: { type: 'object' },
    limit: { type: 'string' },
    pageNo: { type: 'string' },
    userType: { type: 'string' },
    adminId: { type: ['string', 'null'] },
    idSearch: { type: ['string', 'null'] },
    emailSearch: { type: ['string', 'null'] },
    firstNameSearch: { type: ['string', 'null'] },
    lastNameSearch: { type: ['string', 'null'] },
    userNameSearch: { type: ['string', 'null'] },
    phoneSearch: { type: ['string', 'null'] },
    affiliateIdSearch: { type: ['string', 'null'] },
    regIpSearch: { type: ['string', 'null'] },
    statusSearch: {
      type: 'string',
      enum: ['all', 'active', 'inActive', 'isBan', 'isRestrict', 'isInternalUser']
    },
    filterBy: { type: ['string', 'null'] },
    operator: { type: ['string', 'null'] },
    value: { type: ['string', 'null'] },
    lastIp: { type: ['string', 'null'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    kycStatus: {
      type: ['string', 'null'],
      enum: ['PENDING', '', 'INIT', 'COMPLETED', 'ONHOLD']
    },
    csvDownload: { type: ['string', 'null'] },
    tierSearch: { type: ['string', 'null'] },
    vipTournamentId: { type: 'integer' },
    excludeVipTournamentUsers: { type: 'boolean' },
    timezone: { type: ['string', 'null'] },
    vipStatus: {
      type: ['string', 'null'],
      enum: ['pending', 'approved', 'rejected', 'all']
    }
  }
}
const constraints = ajv.compile(schema)

export class GetUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let {
      limit,
      pageNo,
      idSearch,
      emailSearch,
      firstNameSearch,
      lastNameSearch,
      userNameSearch,
      phoneSearch,
      affiliateIdSearch,
      regIpSearch,
      kycStatus,
      orderBy,
      sort,
      lastIp,
      csvDownload,
      tierSearch,
      vipTournamentId,
      excludeVipTournamentUsers,
      vipStatus,
      statusSearch,
      filterBy,
      operator,
      value,
      timezone
    } = this.args

    try {
      const { page, size } = pageValidation(pageNo, limit)
      const query = {}
      let whereClause = '1 = 1'
      let vipUserIds = []

      if (vipTournamentId) {
        const tournament = await db.Tournament.findOne({
          attributes: ['allowedUsers'],
          where: {
            tournamentId: +vipTournamentId,
            vipTournament: true
          },
          raw: true
        })

        if (tournament?.allowedUsers?.length) {
          vipUserIds = tournament.allowedUsers

          if (orderBy === 'vipTournamentId') {
            orderBy = `CASE ${vipUserIds.map((id, i) => `WHEN u.user_id = ${id} THEN ${i + 1}`).join(' ')} ELSE ${vipUserIds.length + 1} END`
          } else if (excludeVipTournamentUsers) {
            query.userId = { [Op.notIn]: vipUserIds }
          } else {
            query.userId = { [Op.in]: vipUserIds }
          }
        } else {
          if (orderBy === 'vipTournamentId') {
            orderBy = 'u.user_id'
          }
        }
      }
      if (query.userId) {
        if (query.userId[Op.in]) {
          whereClause += ` AND u.user_id IN (${query.userId[Op.in].join(',')})`
        } else if (query.userId[Op.notIn]) {
          whereClause += ` AND u.user_id NOT IN (${query.userId[Op.notIn].join(',')})`
        }
      }
      let statusQuery
      let statusName
      if (statusSearch && statusSearch !== 'all') {
        switch (statusSearch) {
          case 'active':
            statusQuery = 'AND u.is_active = true AND u.sign_in_count > 0'
            statusName = 'Active'
            break
          case 'inActive':
            statusQuery = 'AND u.is_active = false'
            statusName = 'In-Active'
            break
          case 'isBan':
            statusQuery = 'AND u.is_ban = true'
            statusName = 'Ban'
            break
          case 'isRestrict':
            statusQuery = 'AND u.is_restrict = true'
            statusName = 'Restrict'
            break
          case 'isInternalUser':
            statusQuery = 'AND u.is_internal_user = true'
            statusName = 'Internal-User'
            break
          default:
            return ''
        }
      }

      if (orderBy === 'scBalance') {
        orderBy = 'ROUND(( COALESCE(SUM((w.sc_coin->>\'wsc\')::numeric), 0) +  COALESCE(SUM((w.sc_coin->>\'psc\')::numeric), 0) +  COALESCE(SUM((w.sc_coin->>\'bsc\')::numeric), 0)), 2)'
      } else if (orderBy === 'tierName') {
        orderBy = '(SELECT name FROM tiers WHERE tiers.tier_id = ut.tier_id )'
      } else if (orderBy === 'totalPurchaseAmount') {
        orderBy = 'ur.total_purchase_amount'
      } else if (orderBy === 'totalRedemptionAmount') {
        orderBy = 'ur.total_redemption_amount'
      } else if (orderBy === 'userId') {
        orderBy = 'ur.user_id'
      } else if (orderBy === 'playThrough') {
        orderBy = 'ROUND(COALESCE((ur.total_sc_bet_amount / NULLIF(ur.total_purchase_amount, 0)), 0)::numeric, 2)'
      } else if (orderBy === 'firstName') {
        orderBy = 'u.first_name'
      }

      let exportId = null
      let exportType = null
      const payload = { limit, pageNo, idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, affiliateIdSearch, regIpSearch, kycStatus, orderBy, sort, lastIp, csvDownload, tierSearch, statusSearch, vipStatus, vipTournamentId, excludeVipTournamentUsers, filterBy, operator, value, timezone }
      if (csvDownload === 'true') {
        const transaction = await sequelize.transaction()
        try {
          const { id } = this.context.req.body
          // Adding a table in Db called export center
          const exportTbl = await db.ExportCenter.create(
            { type: CSV_TYPE.PLAYERS_CSV, adminUserId: id, payload: payload },
            { transaction }
          )
          exportId = exportTbl.dataValues.id
          exportType = exportTbl.dataValues.type
          const axiosBody = {
            limit: limit || 15,
            pageNo: pageNo || 1,
            idSearch: idSearch || '',
            emailSearch: emailSearch || '',
            firstNameSearch: firstNameSearch || '',
            lastNameSearch: lastNameSearch || '',
            userNameSearch: userNameSearch || '',
            phoneSearch: phoneSearch || '',
            affiliateIdSearch: affiliateIdSearch || '',
            regIpSearch: regIpSearch || '',
            kycStatus: kycStatus || '',
            orderBy: orderBy || '',
            sort: sort || '',
            lastIp: lastIp || '',
            csvDownload: csvDownload || '',
            whereClause: whereClause || '',
            tierSearch: tierSearch || '',
            statusSearch: statusSearch || '',
            filterBy: filterBy || '',
            operator: operator || '',
            value: value || '',
            timezone: timezone || '',
            vipStatus,
            exportId: exportId,
            exportType: exportType,
            type: CSV_TYPE.PLAYERS_CSV
          }
          // Hitting CSV Download API
          await exportCenterAxiosCall(axiosBody)

          await transaction.commit()
          return { message: SUCCESS_MSG.CSV_DOWNLOAD_SUCCESS }
        } catch (error) {
          await transaction.rollback()
          return this.addError('InternalServerErrorType', error)
        }
      }

      const users = await this.fetchData({ timezone, whereClause, statusSearch, statusQuery, size, offset: (page - 1) * size, sort, orderBy, idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, affiliateIdSearch, regIpSearch, kycStatus, lastIp, operator, filterBy, value, vipStatus, tierSearch, statusName })
      return users ? { users, message: SUCCESS_MSG.GET_SUCCESS } : this.addError('UserNotExistsErrorType')
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ timezone, whereClause, statusSearch, vipStatus, statusQuery, size, offset, idSearch, emailSearch, firstNameSearch, lastNameSearch, userNameSearch, phoneSearch, affiliateIdSearch, regIpSearch, kycStatus, orderBy, sort, lastIp, tierSearch, operator, filterBy, value, statusName }) {
    let havingCondition = ''
    const reverseMapping = {}
    for (const key in RESPONSIBLE_GAMBLING_TYPE) {
      const value = RESPONSIBLE_GAMBLING_TYPE[key]
      reverseMapping[value] = key
    }
    // Build HAVING conditions using Sequelize.literal
    if (filterBy && operator && value !== undefined) {
      if (filterBy === 'totalPurchaseAmount') {
        havingCondition = `ROUND(COALESCE(ur.total_purchase_amount, 0), 2) ${operator} ${parseFloat(value)}`
      }
      if (filterBy === 'totalRedemptionAmount') {
        havingCondition = `ROUND(COALESCE(ur.total_redemption_amount, 0), 2) ${operator} ${parseFloat(value)}`
      }
      if (filterBy === 'playThrough') {
        havingCondition = `ROUND(COALESCE((total_sc_bet_amount / NULLIF(total_purchase_amount, 0)), 0) :: numeric, 2) ${operator} ${parseFloat(value)}`
      }
    }

    const [{ count = 0 }] = await sequelize.query(
      `
      SELECT COUNT(*) AS "count"
      FROM users u
      LEFT JOIN user_reports ur ON ur.user_id = u.user_id
      INNER JOIN users_tiers ut ON ut.user_id = u.user_id
      ${lastIp ? 'LEFT JOIN user_ips ip ON ip.user_id = u.user_id' : ''}
      WHERE 1 = 1
        ${idSearch ? 'AND u.user_id = :idSearch' : ''}
        ${emailSearch ? 'AND u.email = :emailSearch' : ''}
        ${firstNameSearch ? 'AND u.first_name ILIKE :firstNameSearch' : ''}
        ${lastNameSearch ? 'AND u.last_name ILIKE :lastNameSearch' : ''}
        ${userNameSearch ? 'AND u.username = :userNameSearch' : ''}
        ${phoneSearch ? 'AND u.phone = :phoneSearch' : ''}
        ${affiliateIdSearch ? 'AND u.affiliate_id = :affiliateIdSearch' : ''}
        ${regIpSearch ? 'AND u.sign_in_ip ILIKE :regIpSearch' : ''}
        ${lastIp ? 'AND ip.ip_address ILIKE :lastIp' : ''}
        ${tierSearch && tierSearch !== 'all' ? 'AND ut.level = :tierSearch' : ''}
        ${kycStatus ? 'AND u.kyc_status = :kycStatus' : ''}
        ${vipStatus && vipStatus !== 'all' ? 'AND u.vip_status = :vipStatus' : ''}
        ${statusSearch && statusSearch !== 'all' ? statusQuery : ''}
      `, {
        type: QueryTypes.SELECT,
        replacements: {
          ...(idSearch ? { idSearch: +idSearch } : {}),
          ...(emailSearch ? { emailSearch } : {}),
          ...(firstNameSearch ? { firstNameSearch: `%${firstNameSearch}%` } : {}),
          ...(lastNameSearch ? { lastNameSearch: `%${lastNameSearch}%` } : {}),
          ...(userNameSearch ? { userNameSearch } : {}),
          ...(phoneSearch ? { phoneSearch } : {}),
          ...(affiliateIdSearch ? { affiliateIdSearch: +affiliateIdSearch } : {}),
          ...(regIpSearch ? { regIpSearch: `%${regIpSearch}%` } : {}),
          ...(lastIp ? { lastIp: `%${lastIp}%` } : {}),
          ...(tierSearch && tierSearch !== 'all' ? { tierSearch: +tierSearch } : {}),
          ...(kycStatus ? { kycStatus } : {}),
          ...(vipStatus && vipStatus !== 'all' ? { vipStatus } : {})
        }
      })

    const users = await sequelize.query(`
        SELECT 
          sub.*,
           json_build_object('scBalance', sub."scBalance") AS "userWallet",
        json_build_object('level', sub.level,'tierName', sub."tierName") AS "UserTier",
        json_build_object(
          'totalPurchaseAmount', sub."totalPurchaseAmount",
          'totalRedemptionAmount', sub."totalRedemptionAmount",
          'playThrough', sub."playThrough"
          ) AS "UserReport",
          rsg_data.rsg_data
        FROM (
          SELECT
            u.user_id AS "userId",
            u.email,
            u.first_name AS "firstName",
            u.last_name AS "lastName",
            u.username,
            u.created_at AS "createdAt",
            u.kyc_status AS "kycStatus",
            u.last_login_date AS "lastLoginDate",
            u.is_active AS "isActive",
            u.is_ban AS "isBan",
            u.is_restrict AS "isRestrict",
            u.is_internal_user AS "isInternalUser",
            u.reason_id AS "reasonId",
            (
              SELECT ua.ip_address
              FROM user_activities ua
              WHERE ua.user_id = u.user_id
                AND ua.activity_type IN ('${USER_ACTIVITIES_TYPE.LOGIN}', '${USER_ACTIVITIES_TYPE.LOGOUT}')
              ORDER BY ua.user_activity_id DESC
              LIMIT 1
            ) AS "ipAddress",
            ROUND(
              COALESCE(SUM((w.sc_coin->>'wsc')::numeric), 0) +
              COALESCE(SUM((w.sc_coin->>'psc')::numeric), 0) +
              COALESCE(SUM((w.sc_coin->>'bsc')::numeric), 0),
              2
            )::numeric(20, 2) AS "scBalance",
            ut.level,
            (SELECT t.name FROM tiers t WHERE t.tier_id = ut.tier_id) AS "tierName",
            ur.total_purchase_amount AS "totalPurchaseAmount",
            ur.total_redemption_amount AS "totalRedemptionAmount",
            ROUND(COALESCE((ur.total_sc_bet_amount / NULLIF(ur.total_purchase_amount, 0)), 0)::numeric, 2) AS "playThrough"
          FROM users u
          LEFT JOIN wallets w ON u.user_id = w.owner_id
          LEFT JOIN users_tiers ut ON u.user_id = ut.user_id
          LEFT JOIN user_reports ur ON u.user_id = ur.user_id
          WHERE
            ${whereClause}
            ${idSearch ? 'AND u.user_id = :idSearch' : ''}
            ${emailSearch ? 'AND u.email = :emailSearch' : ''}
            ${firstNameSearch ? 'AND u.first_name ILIKE :firstNameSearch' : ''}
            ${lastNameSearch ? 'AND u.last_name ILIKE :lastNameSearch' : ''}
            ${userNameSearch ? 'AND u.username = :userNameSearch' : ''}
            ${phoneSearch ? 'AND u.phone = :phoneSearch' : ''}
            ${affiliateIdSearch ? 'AND u.affiliate_id = :affiliateIdSearch' : ''}
            ${regIpSearch ? 'AND u.sign_in_ip ILIKE :regIpSearch' : ''}
            ${lastIp ? 'AND ip.ip_address ILIKE :lastIp' : ''}
            ${tierSearch && tierSearch !== 'all' ? 'AND ut.level = :tierSearch' : ''}
            ${kycStatus ? 'AND u.kyc_status = :kycStatus' : ''}
            ${vipStatus && vipStatus !== 'all' ? 'AND u.vip_status = :vipStatus' : ''}
            ${statusSearch && statusSearch !== 'all' ? statusQuery : ''}
          GROUP BY
            u.user_id,
            w.wallet_id,
            ut.user_tier_id,
            ur.user_id
          HAVING
            1 = 1
            ${havingCondition ? `AND ${havingCondition}` : ''}
          ORDER BY
            ${orderBy || 'u.created_at'} ${sort || 'DESC'}
          LIMIT ${size} OFFSET ${offset}
        ) sub
        LEFT JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'responsibleGamblingType', rsg.responsible_gambling_type,
              'timeBreakDuration', rsg.time_break_duration,
              'amount', rsg.amount,
              'limitType', rsg.limit_type
            )
          ) AS rsg_data
          FROM responsible_gambling rsg
          WHERE rsg.user_id = sub."userId" AND rsg.status = '1'
        ) rsg_data ON true;
      `, {
      type: QueryTypes.SELECT,
      replacements: {
        ...(idSearch ? { idSearch: +idSearch } : {}),
        ...(emailSearch ? { emailSearch } : {}),
        ...(firstNameSearch ? { firstNameSearch: `%${firstNameSearch}%` } : {}),
        ...(lastNameSearch ? { lastNameSearch: `%${lastNameSearch}%` } : {}),
        ...(userNameSearch ? { userNameSearch } : {}),
        ...(phoneSearch ? { phoneSearch } : {}),
        ...(affiliateIdSearch ? { affiliateIdSearch: +affiliateIdSearch } : {}),
        ...(regIpSearch ? { regIpSearch: `%${regIpSearch}%` } : {}),
        ...(lastIp ? { lastIp: `%${lastIp}%` } : {}),
        ...(tierSearch && tierSearch !== 'all' ? { tierSearch: +tierSearch } : {}),
        ...(kycStatus ? { kycStatus } : {}),
        ...(vipStatus && vipStatus !== 'all' ? { vipStatus } : {})
      }
    })

    await Promise.all(
      users.map(async user => {
        let status = statusSearch && statusSearch !== 'all' ? statusName : USER_STATUS.Active
        if (!user.isActive) {
          status = statusSearch && statusSearch !== 'all' ? statusName : USER_STATUS.isActive
        } else if (user.isBan) {
          status = statusSearch && statusSearch !== 'all' ? statusName : USER_STATUS.isBan
        } else if (user.isRestrict) {
          status = statusSearch && statusSearch !== 'all' ? statusName : USER_STATUS.isRestrict
        } else if (user.isInternalUser) {
          status = statusSearch && statusSearch !== 'all' ? statusName : USER_STATUS.isInternalUser
        }
        const rsgdata = await this.rsg(user, reverseMapping)

        if (rsgdata) {
          if (rsgdata.groupedData.SELF_EXCLUSION) {
            user.rsg = {
              type: 'Self Exclusion',
              message: 'User is self excluded'
            }
            delete user.rsg_data
          } else if (rsgdata.groupedData.TIME_BREAK && moment(rsgdata.groupedData.TIME_BREAK[0].timeBreakDuration) > moment()) {
            // console.log('timebreak---', rsgdata.groupedData.TIME_BREAK[0].timeBreakDuration)
            const time = rsgdata.groupedData.TIME_BREAK[0].timeBreakDuration
            const userTimezone = timezone ? TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone.toUpperCase()] : 'Etc/GMT'
            // console.log('safe--time', time, moment(time).tz(userTimezone).format('MMMM Do YYYY [at] hh:mm A'))
            user.rsg = {
              type: 'Time Break',
              message: `user is on time break untill ${moment(time).tz(userTimezone).format('MMMM Do YYYY [at] hh:mm A')}`
            }
            delete user.rsg_data
          } else if (rsgdata.groupedData.PURCHASE) {
            user.rsg = {
              type: 'Deposit Limit',
              message: `User Daily Purchase Limit ${
                rsgdata.groupedData.PURCHASE.find(val => val.limitType === '1')?.amount !== undefined
                  ? `$${rsgdata.groupedData.PURCHASE.find(val => val.limitType === '1')?.amount}`
                  : 'NA'
              }, User Weekly Purchase Limit ${
                rsgdata.groupedData.PURCHASE.find(val => val.limitType === '2')?.amount !== undefined
                  ? `$${rsgdata.groupedData.PURCHASE.find(val => val.limitType === '2')?.amount}`
                  : 'NA'
              }, User Monthly Purchase Limit ${
                rsgdata.groupedData.PURCHASE.find(val => val.limitType === '3')?.amount !== undefined
                  ? `$${rsgdata.groupedData.PURCHASE.find(val => val.limitType === '3')?.amount}`
                  : 'NA'
              }`
            }
            delete user.rsg_data
          } else if (rsgdata.groupedData.BET) {
            user.rsg = {
              type: 'Play Limit',
              message:
                `User Daily Play Limit ${
                  rsgdata.groupedData.BET.find(val => val.limitType === '1')?.amount !== undefined
                  ? `${rsgdata.groupedData.BET.find(val => val.limitType === '1')?.amount} SC`
                  : 'NA'
                }, User Weekly Play Limit ${
                  rsgdata.groupedData.BET.find(val => val.limitType === '2')?.amount !== undefined
                  ? `${rsgdata.groupedData.BET.find(val => val.limitType === '2')?.amount} SC`
                  : 'NA'
                }, User Monthly Play Limit ${rsgdata.groupedData.BET.find(val => val.limitType === '3')?.amount !== undefined
                  ? `${rsgdata.groupedData.BET.find(val => val.limitType === '3')?.amount} SC`
                  : 'NA'
                }`
            }
            delete user.rsg_data
          }
        } else {
          user.rsg = 'NA'
          delete user.rsg_data
        }
        user.status = status
      })
    )
    const dataCount = (filterBy && operator && value !== undefined) ? users.length : count
    return { count: +dataCount, rows: users }
  }

  async rsg (user, reverseMapping) {
    try {
      const groupedData = {}
      if (!user.rsg_data) { return false }
      user.rsg_data.forEach((item) => {
        const type = reverseMapping[item.responsibleGamblingType]
        if (!groupedData[type]) {
          groupedData[type] = []
        }
        groupedData[type].push(item)
      })
      if (!groupedData) { return false }
      return { groupedData }
    } catch (error) {

    }
  }
}
