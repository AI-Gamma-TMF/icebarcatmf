import * as Yup from 'yup'

export const affiliateLoginSchema = (t) => {
  return (Yup.object().shape({
    email: Yup.string().email(t('InputField.email.errors.invalid')).required(t('InputField.email.errors.required')),
    password: Yup.string().required(t('InputField.password.errors.required'))
  }))
}
