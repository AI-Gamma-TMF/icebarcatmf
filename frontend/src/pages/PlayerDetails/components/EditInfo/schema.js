import * as Yup from 'yup'

export const userStatusSchema = () => {
  return Yup.object().shape({
    reasonTitle: Yup.string()
    .strict(true)
    .max(50, 'Reason title can be a maximum of 50 characters')
    .required('Reason title is required')
    .matches(/^(?!\s*$).+$/, 'Reason title cannot be only empty spaces'),
  reasonDescription: Yup.string()
    .strict(true)
    .max(500, 'Description can be a maximum of 500 characters')
    .required('Description is required')
    .matches(/^(?!\s*$).+$/, 'Description cannot be only empty spaces'),
    type: Yup.string().required('Reason type is required'),
    isAllowToSentEmail: Yup.boolean(),
    clearUserWallet: Yup.boolean(),
    clearUserVault: Yup.boolean(),
    cancelRedeemRequest: Yup.boolean(),
  });
};

export const editSimpleFormSchema = () => {
  return (Yup.object().shape({
    reason: Yup.string()
      .max(50, 'Max 50 characters')
      .required('Reason Required')
  }))
}

export const documentApproveSchema = () => {
  return (Yup.object().shape({
    reason: Yup.string()
      .max(50, 'Max 50 characters')
      .required('Reason Required'),
    expiryDate: Yup.string()
      .required('Date Required'),
    status: Yup.string()
      .required('Status Required')
  }))
}

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required('New Password must contain at least 10 characters')
    .min(10, 'New Password must contain at least 10 characters')
    .max(20, 'New Password must not contain more than 20 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#\\$%\\^&\\*])/,
      'New Password must contain at least one lowercase & uppercase letter, digit and special character'
    ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'New Password and Confirm Password do not match')
})

export const addDeductCoinFormSchema = () => {
  return (Yup.object().shape({
    coinType: Yup.object().required('Coin Type value is required.'),
    operationType: Yup.object().required('Operation Type value is required.'),
    gcAmount: Yup.number().when('coinType', ([coinType], schema) => {
      if (coinType.value === 'both' || coinType.value === 'gc' || coinType.value === 'sc') {
        return Yup.number()
          .typeError('Must be number')
          .required('Amount is required')
      }
      return schema
    }),
    scAmount: Yup.number().when('coinType', ([coinType], schema) => {
      if (coinType.value === 'both') {
        return Yup.number()
          .typeError('Must be number')
          .required('Amount is required')
      }
      return schema
    }),
    reason: Yup.string()
      .max(50, 'Max 50 characters')
      .required('Reason Required')

  }))
}

export const addDeductScCoinFormSchema = () => {
  return (Yup.object().shape({
    reason: Yup.string()
      .max(50, 'Max 50 characters')
      .required('Reason Required')

  }))
}

export const multiFieldFormSchema = () => {
  return (Yup.object().shape({
    reason: Yup.string()
      .max(50, 'Max 50 characters')
      .required('Reason Required'),

    ssn: Yup.number()
      .integer('Only numbers are allowed')
      .lessThan(1000000000, 'Number can not contain more than 9 numbers')
      .positive('Number should be positive')
      .required('Social Security Number Required')
  }))
}
