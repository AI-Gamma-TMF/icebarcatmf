import ServiceBase from '../../libs/serviceBase'
import { dateTimeUTCConversion } from '../../utils/common'
import { SUBSCRIPTION_STATUS, TIMEZONES_WITH_DAYLIGHT_SAVINGS } from '../../utils/constants/constant'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { divide, round, times } from 'number-precision'

export class GetUserSubscriptionDashboardService extends ServiceBase {
  async run () {
    const {
      sequelize
    } = this.context

    const { timezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS.UTC, startDate: userStartDate, endDate: userEndDate } = this.args

    const { /* startDate, endDate, todayStart, */ last7dayStart, todayEnd, startOfMonth, endOfMonth } = dateTimeUTCConversion(userStartDate, userEndDate, timezone)

    const userTimezone = TIMEZONES_WITH_DAYLIGHT_SAVINGS[timezone] || 'UTC'

    const [userSubMetrics, txnMetrics] = await Promise.all([
      sequelize.query(`
        WITH last7days AS (
          SELECT
              subscription_id,
              plan_type,
              TO_CHAR(created_at AT TIME ZONE :tz, 'YYYY-MM-DD') AS join_date,
              COUNT(*) AS count
          FROM user_subscriptions
          WHERE status IN (:active, :upgraded)
            AND created_at BETWEEN :last7dayStart AND :todayEnd
          GROUP BY subscription_id, plan_type, join_date
      )
      SELECT
          -- Core counts
          COUNT(DISTINCT user_id) FILTER (WHERE status = :active) AS "totalActiveSubscription",
          COUNT(DISTINCT user_id) AS "totalUniqueSubscribedUsers",
          COUNT(*) FILTER (WHERE status = :cancelled) AS "totalCancelledSubscription",
          COUNT(*) FILTER (WHERE status = :upgraded) AS "totalUpgradedSubscription",
          COUNT(*) FILTER (WHERE status = :cancelled AND canceled_at >= ((CURRENT_TIMESTAMP AT TIME ZONE :tz) - INTERVAL '30 DAY')) AS "totalSubscriptionCancelledLast30Days",
          COUNT(*) FILTER (WHERE status = :renewed AND created_at >= ((CURRENT_TIMESTAMP AT TIME ZONE :tz) - INTERVAL '30 DAY')) AS "totalSubscriptionRenewedLast30Days",

          -- Monthly start active users
          COUNT(DISTINCT user_id) FILTER (WHERE start_date <= :startOfMonth AND end_date >= :startOfMonth) AS "totalActiveSubscriptionAtMonthStart",

          -- Monthly cancellations
          COUNT(DISTINCT user_id) FILTER (WHERE status = :cancelled AND canceled_at BETWEEN :startOfMonth AND :endOfMonth) AS "totalSubscriptionCancelledThisMonth",

          -- Expected MRR from subscriptions table
          (SELECT
            SUM(CASE 
              WHEN us.plan_type = 'monthly' THEN s.monthly_amount
              WHEN us.plan_type = 'yearly' THEN s.yearly_amount
            ELSE 0
            END)
          FROM user_subscriptions us
          JOIN subscriptions s ON us.subscription_id = s.subscription_id
          WHERE us.end_date BETWEEN :startOfMonth AND :endOfMonth
          ) AS "expectedMonthlyRecurringSubscription",

          -- Last 7 days breakdown
          json_agg(
              json_build_object(
                  'subscriptionId', l7.subscription_id,
                  'planType', l7.plan_type,
                  'joinDate', l7.join_date,
                  'count', l7.count
              )
          ) AS "last7DaysSubscriptions",

          -- Subscription mapping
          ( SELECT json_object_agg(s.subscription_id, s.name)
            FROM subscriptions s
          ) AS "subscriptionKVM"
      FROM user_subscriptions us
      LEFT JOIN last7days l7 ON TRUE;     
      `, {
        replacements: {
          startOfMonth,
          endOfMonth,
          last7dayStart,
          todayEnd,
          active: SUBSCRIPTION_STATUS.ACTIVE,
          cancelled: SUBSCRIPTION_STATUS.CANCELLED,
          upgraded: SUBSCRIPTION_STATUS.UPGRADED,
          renewed: SUBSCRIPTION_STATUS.RENEWED,
          tz: userTimezone
        },
        type: sequelize.QueryTypes.SELECT
      }),
      sequelize.query(`
     WITH revenue_per_plan AS (
    SELECT 
        us.plan_type AS "planType",
        us.subscription_id AS "subscriptionId",
        SUM(tb.amount) AS "revenue"
    FROM transaction_bankings tb
    JOIN user_subscriptions us
        ON (tb.more_details ->> 'subscriptionId')::int = us.subscription_id
    WHERE tb.transaction_type = 'subscription'
      AND tb.is_success = true
      AND tb.status = 1
    GROUP BY us.plan_type, us.subscription_id
)
SELECT
    -- Monthly recurring subscription
    SUM(amount) FILTER (
        WHERE transaction_type = 'subscription'
          AND is_success = true
          AND status = 1
          AND more_details->>'subscriptionPurchaseType' = 'RECURRING'
          AND created_at >= ((CURRENT_TIMESTAMP AT TIME ZONE :tz) - INTERVAL '30 DAY')
    ) AS "monthlyRecurringSubscription",

    -- Average revenue per user
ROUND(
    (
        SUM(amount) FILTER (
            WHERE transaction_type = 'subscription'
              AND is_success = true
              AND status = 1
        ) /
        NULLIF(
            COUNT(DISTINCT actionee_id) FILTER (
                WHERE transaction_type = 'subscription'
                  AND is_success = true
                  AND status = 1
            ), 0
        )
    )::numeric, 2
) AS "averageRevenuePerUser",

    -- Revenue by plan as JSON
    (SELECT json_agg(rpp) FROM revenue_per_plan rpp) AS "revenuePerPlan"
FROM transaction_bankings;

      `,
      {
        replacements: {
          tz: userTimezone
        },
        type: sequelize.QueryTypes.SELECT
      })
    ])

    const u = userSubMetrics[0]
    const t = txnMetrics[0]

    const growthRateMRR = Math.round(((u.expectedMonthlyRecurringSubscription - t.monthlyRecurringSubscription) * t.monthlyRecurringSubscription) / 100)
    const monthlyChurnRate = +round(+divide(+times(u.totalSubscriptionCancelledThisMonth, u.totalActiveSubscriptionAtMonthStart), 100), 2)

    return {
      success: true,
      data: {
        totalActiveSubscription: u.totalActiveSubscription,
        totalUsersSubscribed: u.totalUniqueSubscribedUsers,
        totalCancelledSubscription: u.totalCancelledSubscription,
        totalUpgradedSubscription: u.totalUpgradedSubscription,
        totalSubscriptionCancelledLast30Days: u.totalSubscriptionCancelledLast30Days,
        totalSubscriptionRenewedLast30Days: u.totalSubscriptionRenewedLast30Days,
        monthlyRecurringSubscription: t.monthlyRecurringSubscription,
        expectedMonthlyRecurringSubscription: u.expectedMonthlyRecurringSubscription,
        averageRevenuePerUser: t.averageRevenuePerUser,
        revenuePerPlan: t.revenuePerPlan,
        growthRateMRR,
        monthlyChurnRate,
        last7DaysSubscriptions: u.last7DaysSubscriptions,
        subscriptionKVM: u.subscriptionKVM
      },
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
