export const tableHeaders = [
  { labelKey: 'tableHeaders.id', value: 'userId' },
  { labelKey: 'tableHeaders.email', value: 'email' },
  { labelKey: 'tableHeaders.regDate', value: 'createdAt' },
  { labelKey: 'tableHeaders.username', value: 'username' },
  { labelKey: 'tableHeaders.name', value: 'firstName' },
  { labelKey: 'tableHeaders.SCBalance', value: 'scBalance' },
  { labelKey: 'tableHeaders.totalPurchaseAmount', value: 'totalPurchaseAmount' },
  { labelKey: 'tableHeaders.totalRedemptionAmount', value: 'totalRedemptionAmount' },
  { labelKey: 'tableHeaders.playThrough', value: 'playThrough' },
  { labelKey: 'tableHeaders.LastLogin', value: 'lastLoginDate' },
  { labelKey: 'tableHeaders.tierName', value: 'tierName' },
  { labelKey: 'tableHeaders.status', value: 'isActive' },  
  //{ labelKey: 'tableHeaders.', value: 'kycStatus' },
  { labelKey: 'tableHeaders.action', value: '' },
  ];

export const initialSet = {
  // unifiedSearch:'',
  idSearch: null,
  emailSearch: '',
  firstNameSearch: '',
  lastNameSearch: '',
  userNameSearch: '',
  phoneSearch: '',
  tierSearch:'',
  affiliateIdSearch: '',
  regIpSearch: '',
  lastIpSearch: '',
  isActiveSearch:''
 }

export const checkForReset = (globalSearch) => {
  const tempData = { ...globalSearch }
  for (const key in tempData) {
    if (tempData[key] === '' || !tempData[key]) {
      delete tempData[key]
    }
  }
}
