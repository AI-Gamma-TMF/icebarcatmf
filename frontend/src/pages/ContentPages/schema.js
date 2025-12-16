import * as Yup from 'yup';
import { PAGE_ASSET_TYPE } from './constants';

export const createContentPageSchema = (t) =>
  Yup.object().shape({
    pageName: Yup.string().required(t('inputField.pageName.errors.required')),
  });

export const seoDetailsSchema = (t) =>
Yup.object().shape({
  title: Yup.string().required(t('seoDetails.inputField.title.errors.required')),
  description: Yup.string().required(t('seoDetails.inputField.description.errors.required')),
  keywords: Yup.string().required(t('seoDetails.inputField.keywords.errors.required'))
});

export const createAssetSchema = (t, assetType) => {
  if(assetType !== PAGE_ASSET_TYPE.DIGITAL) {
    return (
      Yup.object().shape({
        assetKey: Yup.string()
        .required(t('asset.inputField.assetKey.errors.required'))
        .matches('^[a-zA-Z]([\\w-]*[a-zA-Z0-9])?$', t('asset.inputField.assetKey.errors.isValid'))
        .max(50, t('asset.inputField.assetKey.errors.max')),
        assetValue: Yup.string()
        .required(t('asset.inputField.assetValue.errors.required')),
      })
    )
  } else {
    return (
      Yup.object().shape({
        assetKey: Yup.string()
        .required(t('asset.inputField.assetKey.errors.required'))
        .matches('^[a-zA-Z]([\\w-]*[a-zA-Z0-9])?$', t('asset.inputField.assetKey.errors.isValid'))
        .max(50, t('asset.inputField.assetKey.errors.max')),
        assetValue: Yup.mixed()
        .required(t('asset.inputField.assetImageValue.errors.required'))
        .test('File Size',
        t('asset.inputField.assetImageValue.errors.max'),
          (value) => !value || (value && value.size <= 1024 * 1024))
        .test('FILE_FORMAT', t('asset.inputField.assetImageValue.errors.invalidFormat'),
          (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg']
            .includes(value.type))).nullable()
      })
    )
  }
}