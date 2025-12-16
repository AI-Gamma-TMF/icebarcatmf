import { values } from "lodash";

export const featureHeaders = [
    { labelKey: 'Subscription Feature Id', value: 'subscriptionFeatureId' },
    { labelKey: 'Name', value: 'name' },
    { labelKey: 'Description', value: 'description' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Action', value: 'action' }

]
export const PlanHeaders = [
    { labelKey: 'Subscription Id', value: 'subscriptionId' },
    { labelKey: 'Name', value: 'name' },
    { labelKey: 'Thumbnail', value: 'thumbnail' },
    { labelKey: 'Monthly Amount', value: 'monthlyAmount' },
    { labelKey: 'Yearly Amount', value: 'yearlyAmount' },
    { labelKey: 'Weekly Purchase Count', value: 'weeklyPurchaseCount' },
    { labelKey: 'SC Coin', value: 'scCoin' },
    { labelKey: 'GC Coin', value: 'gcCoin' },
    { labelKey: 'Special Plan', value: 'specialPlan' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Action', value: 'action' }

]
export const platformNames = [
    { labelKey: 'All', value: 'all' },
    // {labelKey:'Mobile Device', value:'mobile'},
    // {labelKey:'Desktop Decvice', value:'desktop'}
]

export const tableHeaders = [
    { labelKey: 'User Id', value: 'userId' },
    { labelKey: 'User Name', value: 'userName' },
    { labelKey: 'Email', value: 'email' },
    { labelKey: 'Subscription Name', value: 'subscriptionName' },
    { labelKey: 'Subscription Id', value: 'subscriptionId' },
    { labelKey: 'Start Date', value: 'startDate' },
    { labelKey: 'End Date', value: 'endDate' },
    { labelKey: 'Status', value: 'status' },
    { labelKey: 'Plan Type', value: '' },
    { labelKey: 'Auto Renew', value: 'autoRenew' },
    { labelKey: 'Transaction Id', value: 'transactionId' },
    { labelKey: 'Action', value: 'action' },
];

export const allowedUserListKeysforOrder = [
    'userId',
    'subscriptionId',
    'startDate',
    'endDate',
    'status'
]

export const allowedSubscriptionFeatureKeysforOrder = [
    'subscriptionFeatureId',
    'name',
    'isActive'
]

export const allowedSubscriptionPlanKeysforOrder = [
    'subscriptionId',
    'name',
    'monthlyAmount',
    'yearlyAmount',
    'weeklyPurchaseCount',
    'scCoin',
    'gcCoin',
    'isActive'
]

export const rangeValidations = {
    GUARANTEED_REDEMPTION_APPROVED_TIME: { min: 1, max: 168 },
    DAILY_BONUS_MULTIPLIER: { min: 1, max: 10 },
    WEEKLY_FREE_SPIN: { min: 1, max: 100 },
    VAULT_INTEREST_RATE: { min: 1, max: 15 },
    TOURNAMENT_JOINING_FEE_DISCOUNT: { min: 1, max: 100 },
    PACKAGE_EXCLUSIVE_DISCOUNT: { min: 1, max: 50 },
};

