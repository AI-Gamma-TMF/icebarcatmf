import * as Yup from 'yup';

function getImageDimensions(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 }); // fallback
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}


export const uploadBannerSchema = (type, t) =>

  Yup.object().shape({
    pageRoute: Yup.string().required("Page route required"),
    bannerImage:
      type === 'Create'
        ? Yup.mixed().required(t('casinoBannerManagement.inputField.desktopImage.errors.required'))
          .test('FILE_FORMAT', t('casinoBannerManagement.inputField.desktopImage.errors.invalidFormat'),
            (value) =>
              !value ||
              ['image/png', 'image/jpeg', 'image/jpg','image/webp'].includes(value.type))
              .test(
                'imageDimensions',
                'Image must be exactly 900x240 pixels',
                async (value) => {
                  if (!value) return false;
          
                  const dimensions = await getImageDimensions(value);
                  return dimensions.width === 900 && dimensions.height === 240;
                }
              )
        : Yup.mixed().test('FILE_FORMAT', t('casinoBannerManagement.inputField.desktopImage.errors.invalidFormat'),
            (value) =>
              !value ||
               ['image/png', 'image/jpeg', 'image/jpg','image/webp'].includes(value.type))
              .test(
                'imageDimensions',
                'Image must be exactly 900x240 pixels',
                async (value) => {
                  if (!value) return true;
          
                  const dimensions = await getImageDimensions(value);
                  return dimensions.width === 900 && dimensions.height === 240;
                }
              )
          .nullable(),
 mobileBannerImage:
  type === 'Create'
    ? Yup.mixed().required(t('casinoBannerManagement.inputField.mobileImage.errors.required'))
     
      .test('FILE_FORMAT', t('casinoBannerManagement.inputField.mobileImage.errors.invalidFormat'),
        (value) =>
          !value ||
           ['image/png', 'image/jpeg', 'image/jpg','image/webp'].includes(value.type))
          .test(
            'imageDimensions',
            'Image must be exactly 600x258 pixels',
            async (value) => {
              if (!value) return false;
      
              const dimensions = await getImageDimensions(value);
              return dimensions.width === 600 && dimensions.height === 258;
            }
          )
    : Yup.mixed()
   
      .test('FILE_FORMAT', t('casinoBannerManagement.inputField.mobileImage.errors.invalidFormat'),
        (value) =>
          !value ||
           ['image/png', 'image/jpeg', 'image/jpg','image/webp'].includes(value.type))
          .test(
            'imageDimensions',
            'Image must be exactly 600x258 pixels',
            async (value) => {
              if (!value) return true;
      
              const dimensions = await getImageDimensions(value);
              return dimensions.width === 600 && dimensions.height === 258;
            }
          )
      .nullable(),
  });
