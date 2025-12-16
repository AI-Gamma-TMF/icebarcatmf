import * as Yup from 'yup'

export const createAffiliateSchema = () => Yup.object().shape({
  firstName: Yup.string()
  .required('Please enter your first name'),
lastName: Yup.string()
  .required('Please enter your last name'),
  email: Yup.string().test('is-email', 'Invalid email address', value => {
    if (!value) return true; // Let Yup.string().required() handle empty values
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
  }).required('Please enter an email address'),
  phone: Yup.string()
  .min(10, 'Phone number must be at least 10 digits')
  .required('Please provide a valid phone number'),
state: Yup.string()
  .required('State is required'),
preferredContact: Yup.string()
  .required('Please enter your preferred contact method'),
trafficSource: Yup.string().min(30,"min 30 character is description is required")
  .required('Please enter your traffic source'),
plan: Yup.string().min(30,"min 30 character is description is required")
  .required('Please tell us how you plan to attract people'),
})

export const updateStaffSchema = () => Yup.object().shape({
  firstName: Yup.string()
  .required('Please enter your first name'),
  lastName: Yup.string()
  .required('Please enter your last name'),
  email: Yup.string().test('is-email', 'Invalid email address', value => {
    if (!value) return true; // Let Yup.string().required() handle empty values
    // Regular expression for email validation according to RFC 5322
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
  }).required('Please enter an email address'),
  phone: Yup.string()
  .min(10, 'Phone number must be at least 10 digits')
  .required('Please provide a valid phone number'),
state: Yup.string()
  .required('please select your state'),
preferredContact: Yup.string()
  .required('Please enter your preferred contact method'),
trafficSource: Yup.string().min(30,"min 30 character is description required")
  .required('Please enter your traffic source'),
plan: Yup.string().min(30,"min 30 character is description is required")
  .required('Please tell us how you plan to attract people'),
})

export const playerSearchSchmes = () => Yup.object().shape({
  idSearch: Yup.number()
    .typeError('Must be number')
    .positive('Must be positive')
    .integer('Must be more than 0'),
  phoneSearch: Yup.number().typeError('Must be number'),
  affiliateIdSearch: Yup.number().typeError('Must be number'),
  lastIpSearch: Yup.number().typeError('Must be number')
})