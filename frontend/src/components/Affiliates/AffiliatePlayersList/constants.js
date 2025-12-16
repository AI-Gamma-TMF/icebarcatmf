export const tableHeaders = [
  { labelKey: 'userId', value: 'userId' },
  { labelKey: 'Email', value: 'email' },
  { labelKey: 'Registration Date', value: 'created_at' },
  { labelKey: 'UserName', value: '' },
  { labelKey: 'Name', value: '' },
  { labelKey: 'Status', value: '' },
  // { labelKey: 'Action', value: '' },
  ];

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
