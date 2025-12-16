import * as Yup from 'yup'

export const createAdminSchema = (t) => Yup.object().shape({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('staffFields.email.errors.invalid'))
    .email(t('staffFields.email.errors.invalid'))
    .max(200)
    .required(t('staffFields.email.errors.required')),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/,
      t('staffFields.password.errors.invalid')
    )
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //   t('staffFields.password.errors.invalid')
    // )
    .max(50)
    .required(t('staffFields.password.errors.required')),
  firstName: Yup.string()
    .min(3, t('staffFields.firstName.errors.min'))
    .max(30, t('staffFields.firstName.errors.max'))
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, t('staffFields.firstName.errors.invalid'))
    .required(t('staffFields.firstName.errors.required')),
  lastName: Yup.string().min(3, t('staffFields.lastName.errors.min'))
    .max(30, t('staffFields.lastName.errors.max'))
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, t('staffFields.lastName.errors.invalid'))
    .required(t('staffFields.lastName.errors.required')),
  role: Yup.string()
    .required(t('staffFields.role.errors.required')),
  adminId: Yup.string()
    .when('role', {
      is: (role) => role === 'Support',
      then: () => Yup.string().required(t('staffFields.manager.errors.required')).nullable(),
      otherwise: () => Yup.string().nullable()
    }),
  adminUsername: Yup.string()
    .matches(/^[A-Za-z]+$/, t('staffFields.username.errors.invalid'))
    .min(8, t('staffFields.username.errors.min'))
    .max(30, t('staffFields.username.errors.max'))
    .required(t('staffFields.username.errors.required')),
  group: Yup.string()
    .min(3, t('staffFields.group.errors.min'))
    .max(50, t('staffFields.group.errors.max'))
    .matches(/^[A-Za-z0-9 ]+$/, t('staffFields.group.errors.invalid'))
    .required(t('staffFields.group.errors.required')),
  gcLimit: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .typeError(t('staffFields.gcLimit.errors.invalidType'))
    .min(1, t('staffFields.gcLimit.errors.minValue')),
  scLimit: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .typeError(t('staffFields.gcLimit.errors.invalidType'))
    .min(1, t('staffFields.gcLimit.errors.minValue')),
})

export const updateStaffSchema = (t) => Yup.object().shape({
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('staffFields.email.errors.invalid'))
    .email(t('staffFields.email.errors.invalid'))
    .max(200)
    .required(t('staffFields.email.errors.required')),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      t('staffFields.password.errors.invalid')
    )
    .max(50),
  firstName: Yup.string()
    .min(3, t('staffFields.firstName.errors.min'))
    .max(30, t('staffFields.firstName.errors.max'))
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, t('staffFields.firstName.errors.invalid'))
    .required(t('staffFields.firstName.errors.required')),
  lastName: Yup.string()
    .min(3, t('staffFields.lastName.errors.min'))
    .max(30, t('staffFields.lastName.errors.max'))
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/, t('staffFields.lastName.errors.invalid'))
    .required(t('staffFields.lastName.errors.required')),
  role: Yup.string()
    .required(t('staffFields.role.errors.required')).nullable(),
  adminId: Yup.string()
    .when('role', {
      is: (role) => role === 'Support',
      then: () => Yup.string().required('Parent Admin is required').nullable(),
      otherwise: () => Yup.string().nullable()
    }),

  adminUsername: Yup.string()
    .matches(/^[A-Za-z]+$/, t('staffFields.username.errors.invalid'))
    .min(8, t('staffFields.username.errors.min'))
    .max(30, t('staffFields.username.errors.max'))
    .required(t('staffFields.username.errors.required')),

  group: Yup.string()
    .min(3, t('staffFields.group.errors.min'))
    .max(50, t('staffFields.group.errors.max'))
    .matches(/^[A-Za-z0-9 ]+$/, t('staffFields.group.errors.invalid'))
    .required(t('staffFields.group.errors.required')).nullable(),
  gcLimit: Yup.number()
    // .required(t('staffFields.gcLimit.errors.required'))
    .nullable()
    .typeError(t('staffFields.gcLimit.errors.invalidType'))
    .min(1, t('staffFields.gcLimit.errors.minValue')),
  scLimit: Yup.number()
    // .required(t('staffFields.gcLimit.errors.required'))
    .nullable()
    .typeError(t('staffFields.gcLimit.errors.invalidType'))
    .min(1, t('staffFields.gcLimit.errors.minValue'))
})
