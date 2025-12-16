import * as Yup from 'yup'

export const bankFormSchmes = Yup.object().shape({
  holderName: Yup.string().min(3, 'Holder Name must be at-least 3 characters')
    .max(200)
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, 'Only Alphabets and Space Allowed and Must Start with Alphabet')
    .required('Account Holder Name is Required'),
  bankAccNumber: Yup.number()
    .typeError('Must be number')
    .test('len', 'Min 6 numbers', (val) => val.toString().length >= 6)
    .positive('Must be more than 0')
    .integer('Must be more than 0')
    .required('Bank Account is required'),
  abaRouting: Yup.number()
    .typeError('Must be number')
    .test('len', 'Must be 9 numbers', (val) => val.toString().length === 9)
    .positive('Must be more than 0')
    .integer('Must be more than 0')
    .required('Bank Account is required'),
  nameOfBank: Yup.string().min(3, 'Name Of Bank must be at-least 3 characters')
    .max(200)
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, 'Only Alphabets and Space Allowed and Must Start with Alphabet')
    .required('Name Of Bank is Required'),
  remark: Yup.string()
    .max(50, 'Max 50 characters')
    .required('Remark Required')
})
