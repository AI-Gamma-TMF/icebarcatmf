import * as Yup from 'yup'

export const reasonSchema = () =>
  Yup.object().shape({
    reason: Yup.string()
      .max(50, 'Max 50 characters')
      .required('Reason Required')
  })
