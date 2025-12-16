

export const tableHeaders = [
    { labelKey: 'Promocode Id', value: 'promocodeId' },
    { labelKey: 'Promocode', value: 'promocode' },
    { labelKey: 'Discount/Bonus Percentage', value: 'discountPercentage' },
    // { labelKey: 'Bonus Percentage', value: 'bonusPercentage'},
    { labelKey: 'Per User Limit', value: 'perUserLimit' },
    { labelKey: 'Max Users Availed', value: 'maxUsersAvailed' },
    { labelKey: 'Used Count', value: 'maxUsersAvailedCount' },
    // { labelKey: 'Is Active', value: 'isActive' },
    // { labelKey: 'Is Discount On Amount', value: 'isDiscountOnAmount' },
    // { labelKey: 'Created At', value: 'createdAt' },
    { labelKey: 'Valid From', value: 'validFrom' },
    { labelKey: 'Valid Till', value: 'validTill' },
    { labelKey: 'Status', value: 'status' },
    { labelKey: 'Action', value: 'Action' },
];

export const archivedTableHeaders = [
  { labelKey: 'Promocode Id', value: 'promocodeId' },
  { labelKey: 'Promocode', value: 'promocode' },
  { labelKey: 'Discount/Bonus Percentage', value: 'discountPercentage' },
  // { labelKey: 'Bonus Percentage', value: 'bonusPercentage'},
  { labelKey: 'Per User Limit', value: 'perUserLimit' },
  { labelKey: 'Max Users Availed', value: 'maxUsersAvailed' },
  { labelKey: 'Used Count', value: 'maxUsersAvailedCount' },
  { labelKey: 'Status', value: 'status' },
  { labelKey: 'Valid From', value: 'validFrom' },
  { labelKey: 'Valid Till', value: 'validTill' },
  // { labelKey: 'Is Discount On Amount', value: 'isDiscountOnAmount' },
  // { labelKey: 'Created At', value: 'createdAt' },
  // { labelKey: 'Valid Till', value: 'validTill' },
  { labelKey: 'Action', value: 'Action' },
];


export const viewPromocodeHeaders = [
    { labelKey: 'User Id', value: 'userId' },
    { labelKey: 'Username', value: 'username' },
    { labelKey: 'Email', value: 'email' },
    { labelKey: 'Name', value: 'firstName' },
    // { labelKey: 'Last Name', value: 'lastName' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Claimed At', value: 'claimedAt' },
  ];

  export const viewPurchasePromocodeHeaders = [
    { labelKey: 'User Id', value: 'userId' },
    { labelKey: 'Username', value: 'username' },
    { labelKey: 'Email', value: 'email' },
    { labelKey: 'Name', value: 'firstName' },
    { labelKey: 'Package Id', value: 'packageId' },
    { labelKey: 'Status', value: 'isActive' },
    { labelKey: 'Claimed At', value: 'claimedAt' },
  ];
  
  export const CRM_PROMOTION_TYPE = {
    SCHEDULED: 'scheduled-campaign',
    TRIGGERED: 'triggered-campaign'
  }

  // export const statusOptions = [
  //   { label: 'All', value: 'all' },
  //   { label: 'Active', value: 'true' },
  //   { label: 'In Active', value: 'false' }
  // ]

  export const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 0 },
    { label: 'Active', value: 1 },
    { label: 'Expired', value: 2 },
    // { label: 'Deleted', value: 3 }
  ];
  

  export const STATUS_LABELS = {
    0: 'UPCOMING',
    1: 'ACTIVE',
    2: 'EXPIRED',
    3: 'Deleted'
  };