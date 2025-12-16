

export const tableHeaders = [
    // { labelKey: 'Promocode Id', value: 'crmPromotionId' },
    { labelKey: 'Promocode', value: 'promocode' },
    { labelKey: 'Name', value: '' },
    { labelKey: 'Promotion Type', value: '' },
    // { labelKey: 'SC Amount', value: 'scAmount' },
    // { labelKey: 'GC Amount', value: 'gcAmount' },
    // { labelKey: 'Status', value: 'status' },
    { labelKey: 'Action', value: 'Action' },
];


export const viewPromocodeHeaders = [
    { labelKey: 'CRM Promotion Id', value: 'crmPromotionId' },
    { labelKey: 'Promo Code', value: 'promoCode' },
    { labelKey: 'Name', value: 'name' },
    { labelKey: 'Campaign Id', value: 'campaignId' },
    { labelKey: 'SC Bonus', value: 'scBonus' },
    { labelKey: 'GC Bonus', value: 'gcBonus' },
    { labelKey: 'Claimed Count', value: 'claimedCount' },
    { labelKey: 'Claimed SC Amount', value: 'claimedScAmount' },
    // { labelKey: 'Claimed GC Amount', value: 'claimedGcAmount' },
    { labelKey: 'Pending Count', value: 'pendingCount' },
    { labelKey: 'Pending SC Count', value: 'pendingScAmount' },
    // { labelKey: 'Pending GC Count', value: 'pendingGcAmount' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Start Date', value: 'startDate' },
    { labelKey: 'End Date', value: 'endDate' },
    // { labelKey: 'Deleted Date', value: 'deletedAt' },
    { labelKey: 'Action', value: 'Action' },

  ];
  
  export const viewUserDetailsHeaders = [
    { labelKey: 'User Id', value: 'userId' },
    { labelKey: 'Username', value: 'username' },
    { labelKey: 'Email', value: 'email' },
    { labelKey: 'Name', value: 'firstName' },
    { labelKey: 'Last Name', value: 'lastName' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Claimed At', value: 'claimedAt' },]

  export const CRM_PROMOTION_TYPE = [
      {label: 'All', value:''},
      {label: 'Scheduled', value: 'scheduled-campaign'},
      {label: 'Triggered', value: 'triggered-campaign'}
  ]

  export const STATUS_LABELS = {
    0: 'UPCOMING',
    1: 'ACTIVE',
    2: 'EXPIRED',
    3: 'Deleted'
  };