import * as Yup from 'yup';

export const createCmsSchema = (t) =>
  Yup.object().shape({
    cmsType: Yup.string().required(t('inputField.type.errors.required')),
    title: Yup.string().required(t('inputField.title.errors.required')),
    slug: Yup.string().when('cmsType', {
      is: (v) => v == '1',
      then: () =>
        Yup.string()
          .required(t('inputField.slug.errors.required'))
          .min(3, t('inputField.slug.errors.min'))
          .max(30, t('inputField.slug.errors.max'))
          .matches(
            /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/,
            t('inputField.slug.errors.invalid')
          ),
      otherwise: () => Yup.string(),
    }),
    targetUrl: Yup.string().when('cmsType', {
      is: (v) => v == '2',
      then: () =>
        Yup.string().required(t('inputField.targetUrl.errors.required')),
      otherwise: () => Yup.string(),
    }),
  });
