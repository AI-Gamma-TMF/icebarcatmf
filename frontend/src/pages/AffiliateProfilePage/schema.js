import * as Yup from 'yup'

export const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('This is required field')
    .min(8, 'Password must contain at least 8 characters')
    .max(20, 'Password must not contain more than 20 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#$%^&*])/,
      'Password must contain at least one lowercase & uppercase letter, digit and special character'
    ),
  newPassword: Yup.string()
    .required('This is required field')
    .min(10, 'Password must contain at least 10 characters') // Changed from 8 to 10 characters
    .max(20, 'Password must not contain more than 20 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#$%^&*])/,
      'Password must contain at least one lowercase & uppercase letter, digit and special character'
    )
    .notOneOf([Yup.ref('oldPassword')], 'New Password must be different from Old Password'), // Updated to ensure old and new passwords are different
  confirmPassword: Yup.string()
    .required('This is required field')
    .oneOf([Yup.ref('newPassword')], 'New Password and Confirm Password do not match'), // Ensuring new and confirm passwords match
})

export const updateAffiliateProfileSchema = () => Yup.object().shape({
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
    .required('State is required'),
  preferredContact: Yup.string()
    .required('Please enter your preferred contact method'),
  trafficSource: Yup.string()
    .required('Please enter your traffic source'),
  plan: Yup.string()
    .required('Please tell us how you plan to attract people'),
})
