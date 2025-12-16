import * as Yup from 'yup'

export const adminProfileSchema = (t) => Yup.object().shape({
  oldPassword: Yup.string()
    .when('newPassword', {
      is: (v) => v || v?.length > 0,
      then: () => Yup.string().max(50, t("inputFields.oldPassword.errors.max")).required(t('inputFields.oldPassword.errors.required')),
      otherwise: () => Yup.string().max(50, t("inputFields.oldPassword.errors.max")).nullable(),
    }),
  newPassword: Yup.string()
    .when('oldPassword', {
      is: (v) => v || v?.length > 0,
      then: () => Yup.string().max(50, t("inputFields.newPassword.errors.max")).required(t('inputFields.newPassword.errors.required')).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t('inputFields.newPassword.errors.invalid')
      ),
      otherwise: () => Yup.string().max(50, t("inputFields.newPassword.errors.max")).nullable(),
    }),
  confirmNewPassword: Yup
    .string().max(50, t("inputFields.confirmNewPassword.errors.max")).oneOf([Yup.ref('newPassword'), null], t('inputFields.confirmNewPassword.errors.notMatch')).nullable()
    .when('newPassword', {
      is: (v) => v?.length > 0 || v !== null,
      then: (schema) => schema.required(t('inputFields.confirmNewPassword.errors.required'))
    })
    .when('newPassword', {
      is: (v) => {
        return v?.length === 0 || !v
      },
      then: () => {
        return Yup
          .string().max(50, t("inputFields.confirmNewPassword.errors.max")).oneOf([Yup.ref('newPassword'), null], t('inputFields.confirmNewPassword.errors.notMatch')).nullable()
      }
    }),
  firstName: Yup.string().min(3, t('inputFields.firstName.errors.min'))
    .max(30, t('inputFields.firstName.errors.max'))
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, t('inputFields.firstName.errors.invalid'))
    .required(t('inputFields.firstName.errors.required')),
  lastName: Yup.string().min(3, t('inputFields.lastName.errors.min'))
    .max(30, t('inputFields.lastName.errors.max'))
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, t('inputFields.lastName.errors.invalid'))
    .required(t('inputFields.lastName.errors.required')),
  phone: Yup.string()
    .min(10, t('inputFields.lastName.errors.min'))
    .max(20, t('inputFields.lastName.errors.max'))
    .matches(
      /^((\\+[1-9]{1,10}[ \\-]*)|(\\([0-9]{1,10}\\)[ \\-]*)|([0-9]{1,10})[ \\-]*)*?[0-9]{1,10}?[ \\-]*[0-9]{1,10}?$/,
      t('inputFields.lastName.errors.invalid')
    )
}, [['oldPassword', 'newPassword'], ['newPassword', 'confirmNewPassword']])

const validUrlRE = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

export const siteConfigSchema = (t) => Yup.object().shape({
  siteName: Yup.string().min(3, t('inputFields.siteName.errors.min'))
    .max(30, t('inputFields.siteName.errors.max')).nullable(),
  siteUrl: Yup.string().matches(validUrlRE, t('inputFields.siteUrl.errors.invalid')).nullable(),
  supportEmailAddress: Yup.string().email(t('inputFields.supportEmailAddress.errors.invalid'))
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('inputFields.supportEmailAddress.errors.invalid')).nullable(),
  minRedeemableCoins: Yup.number().integer().min(1, t('inputFields.minRedeemableCoins.errors.min')).required(t('inputFields.minRedeemableCoins.errors.required')),
  maxRedeemableCoins: Yup.number().integer().min(1, t('inputFields.maxRedeemableCoins.errors.min')).required(t('inputFields.maxRedeemableCoins.errors.required')),
  scToGcRate: Yup.number().integer().min(1, t('inputFields.scToGcRate.errors.min')).required(t('inputFields.scToGcRate.errors.required')),
  minScSpinLimit: Yup.number().typeError(t('inputFields.minScSpinLimit.errors.invalid')).required(t('inputFields.minScSpinLimit.errors.required')),
  minGcSpinLimit: Yup.number().typeError(t('inputFields.minGcSpinLimit.errors.invalid')).min(0, t('inputFields.minGcSpinLimit.errors.min')).required(t('inputFields.minGcSpinLimit.errors.required')),
  scVaultPercentage: Yup.number().typeError(t('inputFields.scVaultPercentage.errors.invalid')).min(1, t('inputFields.scVaultPercentage.errors.min')).max(100, t('inputFields.scVaultPercentage.errors.max')).required(t('inputFields.scVaultPercentage.errors.required')),
  gcVaultPercentage: Yup.number().typeError(t('inputFields.gcVaultPercentage.errors.invalid')).min(1, t('inputFields.gcVaultPercentage.errors.min')).max(100, t('inputFields.gcVaultPercentage.errors.max')).required(t('inputFields.gcVaultPercentage.errors.required')),
  xpScToGcRate: Yup.number().integer().min(1, t('inputFields.xpScToGcRate.errors.min')).required(t('inputFields.xpScToGcRate.errors.required')),
  siteLogo: Yup.mixed().required(t('inputFields.siteLogo.errors.required')),
  amoeBonusAmount: Yup.number().integer().min(1, t('inputFields.amoeBonusAmount.errors.min')).required(t('inputFields.amoeBonusAmount.errors.required')),
  vipMinQuestionnaireBonus: Yup.number().integer().min(1, t('inputFields.vipMinQuestionnaireBonus.errors.min')).required(t('inputFields.vipMinQuestionnaireBonus.errors.required')),
  vipMaxQuestionnaireBonus: Yup.number().integer().min(1, t('inputFields.vipMaxQuestionnaireBonus.errors.min')).required(t('inputFields.vipMaxQuestionnaireBonus.errors.required')),
  vipNgrQuestionnaireMultiplier: Yup.number().required(t('inputFields.vipNgrQuestionnaireMultiplier.errors.required'))
})

export const qrSubmitSchema = Yup.object().shape({
  token: Yup.string().min(4, 'Min Length is 4').required('Code is required'),
})