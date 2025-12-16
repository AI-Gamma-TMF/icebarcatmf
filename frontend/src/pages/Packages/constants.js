export const tableHeaders = [
  { labelKey: 'headers.id', value: 'packageId' },
  { labelKey: 'headers.orderId', value: 'orderId' },
  { labelKey: 'Package Name', value: 'packageName' },
  {labelKey:'Package Tag', value:'packageTag'},
  { labelKey: 'headers.amount', value: 'amount' },
  { labelKey: 'headers.gcCoin', value: 'gcCoin' },
  { labelKey: 'headers.scCoin', value: 'scCoin' },
  // { labelKey: 'headers.type', value: 'action' },
  // { labelKey: 'headers.visibleInStore', value: 'isVisibleInStore' },
  // { labelKey: 'headers.visibleInStore', value: 'isVisibleInStore' },
  { labelKey: 'headers.packageType', value: 'packageType'},
  { labelKey: 'headers.purchaseCount', value: 'claimedCount'},
  { labelKey: 'Purchase Number', value: 'purchaseNo'},
  { labelKey: 'Valid From', value: 'validFrom'},
  { labelKey: 'Valid Until', value: 'validTill'},
  { labelKey: 'headers.status', value: 'isActive' },
  { labelKey: 'headers.action', value: 'action' },
]

export const hotOptions = [
  { label: 'All', value: '' },
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]
export const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Up-coming', value: 'upcoming' },
  { label: 'Expired', value: 'expired' }
]
export const isVisibleInStoreOptions = [
  { label: 'All', value: '' },
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]

export const PACKAGE_USER_FILTER = {
  NGR: 'ngr',
  GGR: 'ggr',
  RTP: 'rtp',
  DEPOSIT: 'deposit',
  HOUSE_EDGE: 'house-edge'
};

export const PACKAGE_TYPE = [
  { label: 'All', value: 'all' },
  { label: 'Basic', value: 'basic' },
  { label: 'Special', value: 'special' },
  { label: 'Welcome', value: 'welcome' },
  { label: 'Purchase', value: 'purchase' }
]