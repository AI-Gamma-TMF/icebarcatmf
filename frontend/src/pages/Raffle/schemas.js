import * as Yup from 'yup';
// const today = new Date(Date.now());
export const uploadBannerSchema = (type, t) =>
  Yup.object().shape({
    // visibility: Yup.string().required(t('casinoBannerManagement.inputField.visibility.errors.required')),
    pageName: Yup.string().required(t('casinoBannerManagement.inputField.pageName.errors.required')),
    name: Yup.string().required(t('casinoBannerManagement.inputField.name.errors.required')),
    desktopImage:
      type === 'Create'
        ? Yup.mixed().required(t('casinoBannerManagement.inputField.desktopImage.errors.required'))
          .test('File Size', t('casinoBannerManagement.inputField.desktopImage.errors.max'),
            (value) => !value || (value && value.size <= 1024 * 1024)
          )
          .test('FILE_FORMAT', t('casinoBannerManagement.inputField.desktopImage.errors.invalidFormat'),
            (value) =>
              !value ||
              (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
        : Yup.mixed().test('File Size', t('casinoBannerManagement.inputField.desktopImage.errors.max'),
          (value) => !value || (value && value.size <= 1024 * 1024))
          .test('FILE_FORMAT', t('casinoBannerManagement.inputField.desktopImage.errors.invalidFormat'),
            (value) =>
              !value ||
              (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
          .nullable(),
    mobileImage:
      type === 'Create'
        ? Yup.mixed().required(t('casinoBannerManagement.inputField.mobileImage.errors.required'))
          .test('File Size', t('casinoBannerManagement.inputField.mobileImage.errors.max'),
            (value) => !value || (value && value.size <= 1024 * 1024)
          )
          .test('FILE_FORMAT', t('casinoBannerManagement.inputField.mobileImage.errors.invalidFormat'),
            (value) =>
              !value ||
              (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
        : Yup.mixed().test('File Size', t('casinoBannerManagement.inputField.mobileImage.errors.max'),
          (value) => !value || (value && value.size <= 1024 * 1024))
          .test('FILE_FORMAT', t('casinoBannerManagement.inputField.mobileImage.errors.invalidFormat'),
            (value) =>
              !value ||
              (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
          .nullable(),
    textOne: Yup.string().max(100, t("casinoBannerManagement.inputField.textOne.max")).nullable(),
    textTwo: Yup.string().max(100, t("casinoBannerManagement.inputField.textTwo.max")).nullable(),
    textThree: Yup.string().max(100, t("casinoBannerManagement.inputField.textThree.max")).nullable(),
    btnText: Yup.string().max(50, t("casinoBannerManagement.inputField.btnText.max")).nullable(),
  });

export const editRaffleSchema = () =>
  Yup.object().shape({
    startDate: Yup.date()
      // .min(today, 'Date cannot be earlier than today.')
      .max(Yup.ref('endDate'), "Start Date must be less than end Date.")
      .typeError('The value must be a date (MM-DD-YYYY)')
      .required('Start Date field is required'),

    endDate: Yup.date().min(
      Yup.ref('startDate'),
      "End Date must be greater than start Date."
    )
      .test('notSameAsStart', 'End date cannot be the same as start date', function (endDate) {
        const { startDate } = this.parent;
        return !startDate || !endDate || startDate.getTime() !== endDate.getTime();
      }).required('End Date field is required'),
  });
