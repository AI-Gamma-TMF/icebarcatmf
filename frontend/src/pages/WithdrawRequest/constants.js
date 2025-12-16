export const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'inprogress' },
    { label: 'Approved', value: 'success' },
    { label: 'Declined', value: 'declined' },
    { label: 'Failed', value: 'failed' },
    { label: 'Canceled', value: 'canceled' },
    // { label: 'Scheduled', value: 'scheduled' }
  ]

  export const paymentProviderName = [
    {label: 'All', value: 'all'},
    { label: 'Skrill', value: 'SKRILL' },
    { label: 'Pay By Bank', value: 'PAY_BY_BANK' },
    { label: 'Trustly', value: 'TRUSTLY' }
  ]

  export const minPendingDays = [
    { label: 'One day', value: 'all' },
    { label: 'Two Days', value: 'pending' },
    { label: 'Three Days', value: 'success' },
  ]


  export const redeemRules = [
    // { label: 'Minimum Account Balance', value: 'MINIMUM_ACCOUNT_BALANCE' },
    { label: 'Maximum Redemption Amount', value: 'Maximum Redemption Amount' },
    { label: 'Minimum Redemption Amount', value: 'Minimum Redemption Amount' },
    // { label: 'Daily Redemption Limit', value: 'DAILY_REDEMPTION_LIMIT' },
    { label: 'Ngr', value: 'Ngr' },
    { label: 'Ggr', value: 'Ggr' },
  ];
  

  export const tableHeaders = [
    { labelKey: 'ngr', value: 'ngr' },
    { labelKey: 'user Id', value: 'userId' },
    { labelKey: 'email', value: 'email' },
    { labelKey: 'payment Id', value: 'paymentId' },
    { labelKey: '30 days Rolling Amount', value: 'last30daysRollingRedeemAmount' },
    { labelKey: 'payment Provider', value: 'paymentProvider' },
    { labelKey: 'redemption amount', value: 'amount' },
    { labelKey: 'cancel Redemption Count', value: 'cancelRedemptionCount' },
    { labelKey: 'last Redeem Date', value: 'lastApprovedRedeemDate' },
    { labelKey: 'Playthrough', value: 'playThrough' },
    // { labelKey: 'last Run At', value: 'lastRunAt' },
    // { labelKey: 'last Approved Redeem Amount', value: 'lastApprovedRedeemAmount' },
    { labelKey: 'zip code', value: 'zipcode' },
    { labelKey: 'ip Location', value: 'ipLocation' },
    { labelKey: 'action', value: '' },
    { labelKey: 'status', value: '' },
    { labelKey: 'more details', value: '' },
  ]

  
  export const initialSet = {
    idSearch: null,
    emailSearch: '',
    firstNameSearch: '',
    lastNameSearch: '',
    userNameSearch: '',
    phoneSearch: '',
    affiliateIdSearch: '',
    regIpSearch: '',
    lastIpSearch: ''
  }
  
  export const checkForReset = (globalSearch) => {
    const tempData = { ...globalSearch }
    for (const key in tempData) {
      if (tempData[key] === '' || !tempData[key]) {
        delete tempData[key]
      }
    }
  }
  