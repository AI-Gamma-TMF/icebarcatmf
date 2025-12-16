import * as Yup from 'yup'

export const providerSchema = (t) =>  Yup.object().shape({
  name: Yup.string()
    .max(50, t('casinoProvider.inputField.providerName.errors.max'))
    .matches(/^[A-Za-z0-9. ]+$/, t('casinoProvider.inputField.providerName.errors.invalid'))
    .required(t('casinoProvider.inputField.providerName.errors.required')),
  thumbnail: Yup.mixed().required(t('casinoProvider.inputField.thumbnail.errors.required'))
    .test('File Size',
    t('casinoProvider.inputField.thumbnail.errors.max'),
      (value) => !value || (value && value.size <= 1024 * 1024))
    .test('FILE_FORMAT', t('casinoProvider.inputField.thumbnail.errors.invalidFormat'),
      (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
        .includes(value.type)))
})

// export const editproviderSchema = (t)=> Yup.object().shape({
//   name: Yup.string()
//     .max(50, t('casinoProvider.inputField.providerName.errors.max'))
//     .matches(/^[A-Za-z0-9. ]+$/, t('casinoProvider.inputField.providerName.errors.invalid'))
//     .required(t('casinoProvider.inputField.providerName.errors.required')),
//     thumbnail: Yup.mixed()
//   .test('File Size',
//     t('casinoProvider.inputField.thumbnail.errors.max'),
//     (value) => !value || (value && value.size <= 1024 * 1024))
//   .test('FILE_FORMAT', 
//     t('casinoProvider.inputField.thumbnail.errors.invalidFormat'),
//     (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
//       .includes(value.type))
//   ).nullable()
// })
export const editproviderSchema = (t) => Yup.object().shape({
  name: Yup.string()
    .max(50, t('casinoProvider.inputField.providerName.errors.max'))
    .matches(
      /^[A-Za-z0-9 .!@#$%^&*()_\-+=|\\{}[\]:;"'<>,.?/~`]+$/,
      t('casinoProvider.inputField.providerName.errors.invalid')
    )
    .required(t('casinoProvider.inputField.providerName.errors.required')),

  thumbnail: Yup.mixed()
    .test(
      'File Size',
      t('casinoProvider.inputField.thumbnail.errors.max'),
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      'FILE_FORMAT',
      t('casinoProvider.inputField.thumbnail.errors.invalidFormat'),
      (value) =>
        !value ||
        (value &&
          ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'].includes(value.type))
    )
    .nullable()
})
