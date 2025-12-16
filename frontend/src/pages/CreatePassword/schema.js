
import * as Yup from 'yup';

export const createPasswordSchema = (t) => {
  return Yup.object().shape({
    password: Yup.string()
      .required('Please enter your password')
      .min(8, 'Password must contain at least 8 characters')
      .max(20, 'Password must not contain more than 20 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+={}[\]:;<>,.?]).{8,20}$/,
        'Password must contain at least one lowercase & uppercase letter, digit and special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('Passwords do not match'))
      .required(t('Please confirm your password'))
  });
};