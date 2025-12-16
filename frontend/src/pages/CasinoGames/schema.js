import * as Yup from 'yup'

export const editGamesSchema = (t) => {
  return Yup.object().shape({
    name: Yup.string()
      .max(50, t('editGames.fields.name.errors.max'))
      .required(t('editGames.fields.name.errors.required')),
    description: Yup.string()
      .max(1000, t('editGames.fields.description.errors.max')).nullable(),
    webLongImg: Yup.mixed()
      .test('File Size',
        t('editGames.fields.thumbnail.errors.fileSize'),
        (value) => !value || (value && value.size <= 1024 * 1024))
      .test('FILE_FORMAT', t('editGames.fields.thumbnail.errors.fileFormat'),
        (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
          .includes(value.type))).nullable(),
    webShortImg: Yup.mixed()
      .test('File Size',
        t('editGames.fields.thumbnail.errors.fileSize'),
        (value) => !value || (value && value.size <= 1024 * 1024))
      .test('FILE_FORMAT', t('editGames.fields.thumbnail.errors.fileFormat'),
        (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          .includes(value.type))).nullable(),
    mobileImg: Yup.mixed()
      .test('File Size',
        t('editGames.fields.thumbnail.errors.fileSize'),
        (value) => !value || (value && value.size <= 1024 * 1024))
      .test('FILE_FORMAT', t('editGames.fields.thumbnail.errors.fileFormat'),
        (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
          .includes(value.type))).nullable()
  })
}


export const uploadGamesSchema = (t) => {
  return Yup.object().shape({
    inputJson: Yup.mixed().required(t('uploadGames.fields.inputJson.errors.required'))
    .test('FILE_FORMAT', t('uploadGames.fields.inputJson.errors.fileFormat'),
        (value) => !value || (value && ['application/json']
          .includes(value.type))),
    masterCasinoProviderId: Yup.string().required(t('uploadGames.fields.providers.errors.required')),
    assetsURL: Yup.string().required(t('uploadGames.fields.assetsURL.errors.required'))
  })    
}

export const addGamesSchema = (t) => {
  return Yup.object().shape({
    // masterGameSubCategoryId: Yup.number()
    // .nullable()
    // .required(t('addGames.fields.masterGameSubCategoryId.errors.required')),
  providerId: Yup.number()
    .nullable()
    .required(t('addGames.fields.providerId.errors.required')),
  gameName: Yup.string()
    .max(50, t('addGames.fields.gameName.errors.max'))
    .required(t('addGames.fields.gameName.errors.required')),
  identifier: Yup.string()
    .nullable()
    .required(t('addGames.fields.identifier.errors.required'))
    .matches(/^[a-zA-Z0-9_-]*$/, t('addGames.fields.identifier.errors.invalid')) 
    .max(100, t('addGames.fields.identifier.errors.max')),
  returnToPlayer: Yup.number()
    .nullable()
    .min(0, t('addGames.fields.returnToPlayer.errors.min'))
    .required(t('addGames.fields.returnToPlayer.errors.required'))
    .max(100, t('addGames.fields.returnToPlayer.errors.max')),
    webLongImg: Yup.mixed()
    .test('File Size',
      t('addGames.fields.thumbnail.errors.fileSize'),
      (value) => !value || (value && value.size <= 1024 * 1024))
    .test('FILE_FORMAT', t('addGames.fields.thumbnail.errors.fileFormat'),
      (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
        .includes(value.type))).nullable(),
});
};