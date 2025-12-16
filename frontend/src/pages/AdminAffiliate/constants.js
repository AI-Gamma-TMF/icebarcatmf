export const tableHeaders = [
  { labelKey: 'Affiliate Id', value: '' },
  { labelKey: 'Email', value: 'email' },
  { labelKey: 'FirstName', value: 'firstName' },
  { labelKey: 'LastName', value: 'lastName' },
  { labelKey: 'Phone', value: 'phone' },
  { labelKey: 'State', value: 'state' },
  { labelKey: 'Contact method', value: '' },
  { labelKey: 'Status', value: '' },
  { labelKey: 'Action', value: '' },
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
