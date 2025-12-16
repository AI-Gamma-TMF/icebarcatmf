import * as Yup from 'yup'
import { AGE_RESTRICTION_19 } from './constant';

export const userPersonalSchema = Yup.object().shape({   
    firstName: Yup.string()
    .min(2, 'First Name must be at least 2 characters')
    .max(200, 'First Name must be at most 200 characters')
    .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Only Alphabets and Spaces Allowed, and Must Start with an Alphabet')
    .required('First Name is required'),
  lastName: Yup.string()
    .min(2, 'Last Name must be at-least 2 characters')
    .max(200)
    .matches(/^[a-zA-Z][a-zA-Z\s]*$/, 'Only Alphabets and Spaces Allowed, and Must Start with an Alphabet')
    .required('Last Name is required'),
  phone: Yup.string()
  .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Phone number is not valid')
  .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
  .required('Phone number is required')
  // .min(8, 'Phone must be at least of 8 digits').max(10,'Phone must be at most of 10 digits')
  .test('no-only-spaces', 'Phone number cannot contain spaces', (value) => {
    return !(/^\s*$/).test(value);
}),
  dateOfBirth: Yup.date()
    .test('dateOfBirth', 'Should be greater than 18', function (value, ctx) {
      let isMatched = false
      if (ctx?.parent?.state?.value) {
        isMatched = AGE_RESTRICTION_19.includes(ctx?.parent?.state?.value);
      }
      const dob = new Date(value);
      const validDate = new Date();
      const valid = validDate.getFullYear() - dob.getFullYear() >= (isMatched ? 19 : 18);
      return !valid ? ctx.createError({ message: isMatched ? 'Should be greater than 19' : 'Should be greater than 18' }) : valid;
    }),
  gender: Yup
    .object()
    .shape({
      value: Yup.string().required('Gender is required')
    })
    .nullable(),
  addressLine_1: Yup.string().min(3, 'Address must be at-least 3 characters')
    .max(200)
    .required('Please provide Address Line'),
  // state: Yup.string().required('State is a required field'),
    state: Yup
    .object()
    .shape({
      value: Yup.string().required('State is required')
    }).required('State is required'),
    // .nullable(), // for handling null value when clearing options via clicking 'x'
  city: Yup.string().nullable().max(100, "city must be at most 100 characters")
  .required('City is a required field'),
  zipCode: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(5, 'Must be exactly 5 digits')
    .max(5, 'Must be exactly 5 digits')
    .required('Zip Code is required'),
  email: Yup.string().test('is-email', 'Invalid email address', value => {
    if (!value) return true;
    const emailRegex = /^(([^<>()[\]\\.,+;:\s@"]+(\.[^<>()[\]\\.,+;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
  }).required('Please enter an email address'),
})
