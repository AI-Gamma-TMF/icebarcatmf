import { Op } from 'sequelize'
import ajv from '../../libs/ajv'
import ServiceBase from '../../libs/serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { getSuperAdminId, pageValidation } from '../../utils/common'
import { RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE, USER_STATUS } from '../../utils/constants/constant'
import { minus, round, plus } from 'number-precision'

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
    isActive: { type: ['string', 'null'] },
    orderBy: { type: 'string' },
    sort: { type: 'string' },
    kycStatus: {
      type: ['string', 'null'],
      enum: ['PENDING', '', 'INIT', 'COMPLETED', 'ONHOLD']
    },
    tierSearch: { type: ['string', 'null'] },
    ratingSearch: { type: ['string', 'null'] },
    totalPurchaseAmount: { type: ['string', 'null'] },
    totalRedemptionAmount: { type: ['string', 'null'] },
    vipStatusSearch: { type: ['string', 'null'] },
    ratingScoreMin: { type: ['string', 'null'] },
    ratingScoreMax: { type: ['string', 'null'] },
    ratingScoreSearch: { type: ['string', 'null'] },
    ratingMin: { type: ['string', 'null'] },
    ratingMax: { type: ['string', 'null'] },
    unifiedSearch: { type: ['string', 'null', 'number'] },
    managedBySearch: { type: ['string', 'null', 'number'] }
  }
}

const constraints = ajv.compile(schema)

export class GetVipUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { sequelize } = this.context
    let {
      limit,
      pageNo,
      idSearch,
      emailSearch,
      firstNameSearch,
      lastNameSearch,
      userNameSearch,
      phoneSearch,
      isActive,
      kycStatus,
      orderBy,
      sort,
      tierSearch,
      ratingSearch,
      totalPurchaseAmount,
      totalRedemptionAmount,
      vipStatusSearch,
      ratingScoreMin,
      ratingScoreMax,
      ratingScoreSearch,
      ratingMin,
      ratingMax,
      unifiedSearch,
      managedBySearch
    } = this.args
    const { id } = this.context.req.body
    const managedBy = id

    try {
      const ratingQuery = {}
      let query = {}
      let tierQuery

      const { page, size } = pageValidation(pageNo, limit)

      if (idSearch) query = { userId: +idSearch }
      if (emailSearch) query.email = { [Op.iLike]: `%${emailSearch}%` }
      if (firstNameSearch) query.firstName = { [Op.iLike]: `%${firstNameSearch}%` }
      if (lastNameSearch) query.lastName = { [Op.iLike]: `%${lastNameSearch}%` }
      if (userNameSearch) query.username = { [Op.iLike]: `%${userNameSearch}%` }
      if (phoneSearch) query.phone = { [Op.iLike]: `%${phoneSearch}%` }
      if (kycStatus) query.kycStatus = kycStatus
      if (tierSearch && tierSearch !== 'all') tierQuery = { level: +tierSearch }
      if (totalPurchaseAmount) query['$UserReport.total_purchase_amount$'] = { [Op.gte]: +totalPurchaseAmount }
      if (totalRedemptionAmount) query['$UserReport.total_redemption_amount$'] = { [Op.gte]: +totalRedemptionAmount }
      if (ratingSearch && ratingSearch !== 'all') ratingQuery.rating = +ratingSearch
      if (vipStatusSearch) ratingQuery.vipStatus = vipStatusSearch
      if (ratingScoreSearch) ratingQuery.score = +ratingScoreSearch
      if (ratingScoreMin || ratingScoreMax) {
        ratingQuery.score = {}
        if (ratingScoreMin) ratingQuery.score[Op.gte] = +ratingScoreMin
        if (ratingScoreMax) ratingQuery.score[Op.lte] = +ratingScoreMax
      }
      if (ratingSearch === 'all' && (ratingMin || ratingMax)) {
        ratingQuery.rating = {}
        if (ratingMin) ratingQuery.rating[Op.gte] = +ratingMin
        if (ratingMax) ratingQuery.rating[Op.lte] = +ratingMax
      }

      if (unifiedSearch) {
        if (/^\d+$/.test(unifiedSearch)) {
          query = { userId: +unifiedSearch }
        } else {
          query = {
            [Op.or]: [
              { username: { [Op.iLike]: `%${unifiedSearch}%` } },
              { email: { [Op.iLike]: `%${unifiedSearch}%` } }
            ]
          }
        }
      }

      if (isActive && isActive !== 'all') {
        query.isActive = isActive === 'true'
        if (isActive === 'true') query[Op.and] = { signInCount: { [Op.gt]: 0 } }
        else query[Op.or] = { signInCount: { [Op.eq]: 0 } }
      }
      if (managedBySearch && managedBySearch !== 'all') ratingQuery.managedBy = +managedBySearch

      if (orderBy === 'totalPurchaseAmount') orderBy = sequelize.literal('"UserReport"."total_purchase_amount"')
      if (orderBy === 'totalRedemptionAmount') orderBy = sequelize.literal('"UserReport"."total_redemption_amount"')
      if (orderBy === 'playThrough') orderBy = sequelize.literal('ROUND(COALESCE((total_sc_bet_amount / NULLIF(total_purchase_amount, 0)), 0) :: numeric, 2)')
      if (orderBy === 'totalGgr') orderBy = sequelize.literal('ROUND(COALESCE((total_sc_bet_amount - total_sc_win_amount), 0) :: NUMERIC, 2)')

      const users = await this.fetchData({ query, size, offset: (page - 1) * size, sort, orderBy, ratingQuery, tierQuery, managedBy })
      return users ? { users, message: SUCCESS_MSG.GET_SUCCESS } : this.addError('UserNotExistsErrorType')
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }

  async fetchData ({ query, size, offset, sort, orderBy, ratingQuery, tierQuery, managedBy }) {
    const {
      dbModels: {
        User: UserModel,
        UserInternalRating: UserInternalRatingModel,
        UserReports: UserReportsModel,
        Wallet: WalletModel,
        UserTier: UserTierModel,
        ResponsibleGambling: ResponsibleGamblingModel
      },
      sequelize
    } = this.context

    let orderClause

    if (['rating', 'score', 'vipStatus'].includes(orderBy)) orderClause = [[UserInternalRatingModel, orderBy, sort || 'DESC']]
    else if (orderBy === 'level') orderClause = [[UserTierModel, orderBy, sort || 'DESC']]
    else if ([
      'totalPurchaseAmount', 'totalRedemptionAmount', 'totalScBetAmount', 'totalPendingRedemptionAmount'
    ].includes(orderBy)) orderClause = [[UserReportsModel, orderBy, sort || 'DESC']]
    else orderClause = [[orderBy || 'createdAt', sort || 'DESC']]

    const superAdminId = await getSuperAdminId()
    const managers = {
      relationshipManagerId: 6, // jared
      manager: 595, // Dakota
      Qa: 4 // QA
    }

    const usersCount = await UserModel.count({
      where: query,
      order: orderClause,
      limit: size,
      offset,
      include: [
        {
          model: UserInternalRatingModel,
          attributes: ['rating', 'score', 'vipStatus', 'moreDetails', 'managedBy'],
          where: {
            ...ratingQuery,
            ...(
              [superAdminId, managers.relationshipManagerId, managers.manager, managers.Qa].includes(managedBy)
                ? {
                    [Op.and]: [
                      sequelize.literal(`EXISTS (
              SELECT 1
              FROM "admin_user_permissions"
              WHERE "admin_user_id" IN (${[superAdminId, managers.relationshipManagerId, managers.manager, managers.Qa].join(',')})
              AND "permission" ? 'VipManagedBy'
            )`)
                    ]
                  }
                : {
                    [Op.and]: [
                      { managedBy },
                      {
                        managedBy: {
                          [Op.in]: sequelize.literal(`(
                  SELECT "admin_user_id"
                  FROM "admin_user_permissions"
                  WHERE "permission" ? 'VipManagedBy'
                )`)
                        }
                      }
                    ]
                  }
            )
          },
          required: true
        },
        { model: UserReportsModel, as: 'UserReport', attributes: [], required: false },
        { model: UserTierModel, attributes: [], where: { ...tierQuery } },
        { model: WalletModel, as: 'userWallet', attributes: [] }
      ]
    })

    const users = await UserModel.findAll({
      where: query,
      order: orderClause,
      limit: size,
      offset,
      attributes: [
        'userId', 'email', 'firstName', 'isActive', 'lastName', 'username', 'createdAt', 'kycStatus',
        'lastLoginDate', 'isBan', 'isRestrict', 'isInternalUser', 'reasonId'
      ],
      include: [
        {
          model: UserInternalRatingModel,
          attributes: ['rating', 'score', 'vipStatus', 'moreDetails', 'managedBy'],
          where: {
            ...ratingQuery,
            ...(
              [superAdminId, managers.relationshipManagerId, managers.manager, managers.Qa].includes(managedBy)
                ? {
                    [Op.and]: [
                      sequelize.literal(`EXISTS (
              SELECT 1
              FROM "admin_user_permissions"
              WHERE "admin_user_id" IN (${[superAdminId, managers.relationshipManagerId, managers.manager, managers.Qa].join(',')})
              AND "permission" ? 'VipManagedBy'
            )`)
                    ]
                  }
                : {
                    [Op.and]: [
                      { managedBy },
                      {
                        managedBy: {
                          [Op.in]: sequelize.literal(`(
                  SELECT "admin_user_id"
                  FROM "admin_user_permissions"
                  WHERE "permission" ? 'VipManagedBy'
                )`)
                        }
                      }
                    ]
                  }
            )
          },
          required: true
        },
        {
          model: UserReportsModel,
          as: 'UserReport',
          attributes: [
            'totalPurchaseAmount', 'totalRedemptionAmount', 'totalScBetAmount', 'totalScWinAmount', 'totalPendingRedemptionAmount',
            [sequelize.literal('ROUND(COALESCE((total_sc_bet_amount / NULLIF(total_purchase_amount, 0)), 0) :: numeric, 2)'), 'playThrough'],
            [sequelize.literal('ROUND(COALESCE((total_sc_bet_amount - total_sc_win_amount), 0) :: NUMERIC, 2)'), 'totalGgr']
          ],
          required: false
        },
        {
          model: UserTierModel,
          attributes: ['level', [sequelize.literal('(SELECT name FROM tiers WHERE "tiers"."tier_id" = "UserTier"."tier_id")'), 'tierName']],
          where: { ...tierQuery }
        },
        {
          model: WalletModel,
          as: 'userWallet',
          attributes: [
            'ownerId',
            [sequelize.literal("ROUND((vault_sc_coin->>'bsc')::numeric + (vault_sc_coin->>'psc')::numeric + (vault_sc_coin->>'wsc')::numeric, 2)"), 'vaultScBalance'],
            [sequelize.literal("ROUND((sc_coin->>'bsc')::numeric +  (sc_coin->>'psc')::numeric +  (sc_coin->>'wsc')::numeric, 2)"), 'currentScBalance']
          ]
        },
        {
          model: ResponsibleGamblingModel,
          as: 'responsibleGambling',
          attributes: ['timeBreakDuration', 'status', 'selfExclusion'],
          where: {
            responsibleGamblingType: {
              [Op.in]: [RESPONSIBLE_GAMBLING_TYPE.TIME_BREAK, RESPONSIBLE_GAMBLING_TYPE.SELF_EXCLUSION]
            },
            status: RESPONSIBLE_GAMBLING_STATUS.ACTIVE
          },
          required: false,
          separate: true
        }
      ],
      group: ['userId', 'UserInternalRating.user_internal_rating_id', 'UserReport.user_id', 'UserTier.user_tier_id', 'userWallet.wallet_id']
    })

    await Promise.all(users.map(async user => {
      let status = USER_STATUS.Active
      if (!user.isActive) status = USER_STATUS.isActive
      else if (user.isBan) status = USER_STATUS.isBan
      else if (user.isRestrict) status = USER_STATUS.isRestrict
      else if (user.isInternalUser) status = USER_STATUS.isInternalUser
      else if (
        user?.responsibleGambling &&
        user?.responsibleGambling.length > 0 &&
        user?.responsibleGambling[0].status === RESPONSIBLE_GAMBLING_STATUS.ACTIVE
      ) {
        const selfExcluded = user.responsibleGambling[0].selfExclusion
        if (selfExcluded) {
          status = USER_STATUS.selfExclusion
        } else {
          status = USER_STATUS.timeBreakDuration
        }
      }

      user.dataValues.ngr = +round(
        +minus(
          +(user?.UserReport?.totalPurchaseAmount ?? 0),
          +plus(
            +(user?.UserReport?.totalRedemptionAmount ?? 0),
            +(user?.UserReport?.totalPendingRedemptionAmount ?? 0),
            +(user?.userWallet?.dataValues?.currentScBalance ?? 0),
            +(user?.userWallet?.dataValues?.vaultScBalance ?? 0)
          )
        ),
        2
      )
      user.dataValues.status = status
      delete user.dataValues.responsibleGambling
    }))

    return { count: usersCount, rows: users, isSuperAdmin: superAdminId === managedBy }
  }
}
