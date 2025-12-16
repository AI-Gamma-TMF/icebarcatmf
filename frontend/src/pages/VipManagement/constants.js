
export const tableHeaders = [
  { labelKey: 'User ID', value: 'userId' },
  { labelKey: 'User Name', value: 'username' },
  { labelKey: 'Email', value: 'email' },
  { labelKey: 'GGR', value: 'totalGgr' },
  { labelKey: 'NGR', value: 'ngr' },
  { labelKey: 'Lifetime Purchase Amount', value: 'totalPurchaseAmount' },
  { labelKey: 'Lifetime Redemption Amount', value: 'totalRedemptionAmount' },
  { labelKey: 'Player Rating', value: 'rating' },
  { labelKey: 'User Profile', value: 'userProfile' },
  { labelKey: 'Player Status', value: 'status' },
  { labelKey: 'Managed By', value: 'managedBy' },
];

export const customerHeaders = [
  { labelKey: 'User ID', value: 'userId' },
  { labelKey: 'User Name', value: 'username' },
  { labelKey: 'Email', value: 'email' },
  { labelKey: 'Player Rating', value: 'rating' },
  { labelKey: 'Tier Level', value: 'level' },
  { labelKey: 'Final VIP Status', value: 'vipStatus' },
  { labelKey: 'Player Status', value: 'status' },
  { labelKey: 'Managed By', value: 'managedBy' },
];

export const vipStatusOptions = [
  { label: 'Approved VIP', value: 'approved' },
  { label: 'Revoked VIP', value: 'rejected' },
];

export const daysOptions = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '21 Days', value: 21 },
  { label: '30 Days', value: 30 },
  { label: '60 Days', value: 60 },
  { label: '90 Days', value: 90 },
  { label: 'Custom Range', value: 'custom' },
];

export const tierOptions = [
  { label: 'Tier Level', value: '' },
  { label: 'Empire', value: 'Empire' },
  { label: 'Reserve', value: 'Reserve' },
  { label: 'Forge', value: 'Forge' },
  { label: 'Valut', value: 'Valut' },
  { label: 'Mint', value: 'Mint' },
  { label: 'Nexus', value: 'Nexus' },
];

export const internalTierRating = [
  { label: 'All', value: 'all' },
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];


export const formBuilderHeader = [
  { labelKey: 'Id', value: 'questionnaireId' },
  { labelKey: 'Question', value: 'question' },
  { labelKey: 'Question Type', value: 'frontendQuestionType' },
  { labelKey: 'Status', value: 'isActive' },
  { labelKey: 'Action', value: 'action' }
]

const QUESTIONNAIRE_QUESTION_TYPE = {
  ONE_LINER: 'one_liner',
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  TICK_MARK: 'tick_mark',
  SEQUENCE: 'sequence'
}

export const fieldTypeToQuestionType = {
  text: QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
  textarea: QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
  select: QUESTIONNAIRE_QUESTION_TYPE.SINGLE_CHOICE,
  radio: QUESTIONNAIRE_QUESTION_TYPE.SINGLE_CHOICE,
  checkbox: QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE,
  number: QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
  email: QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER
}

export const fieldTypeLabels = {
  text: 'Short Text',
  textarea: 'Paragraph',
  select: 'Dropdown',
  radio: 'Multiple Choice (Radio)',
  checkbox: 'Multiple Choice (Checkbox)',
  number: 'Number',
  date: 'Date Picker',
};

export const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'true' },
  { label: 'In Active', value: 'false' }
]

export const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  // { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown Selection' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Check Boxes' }
];

export const getFieldLabel = (value) => {
  const field = fieldTypes.find((f) => f.value === value);
  return field ? field.label : value;
};


export const commissionHeader = [
  {label:'Parameters', value:'parameter'},
  {label:'Custom Data', value:'customDate'},
  {label:'Last Month', value:'lastMonth'},
  {label:'Last Week', value:'lastWeek'},
  {label:'Monthly Average', value:'monthlyAverage'},
  {label:'Month To Date', value:'mtd'},
  {label:'Year To Date', value:'ytd'}
]