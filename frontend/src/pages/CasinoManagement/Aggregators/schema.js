import * as Yup from 'yup'

export const aggregatorSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[A-Za-z0-9 ]+$/, 'Only Alpha-Numeric values Allowed')
    .required('Aggregator Name Required')
})
