import * as Yup from 'yup';
// const today = new Date(Date.now());
export const createPromotionSchema = () =>
  Yup.object().shape({
    promocode: Yup.string() .required('Promocode is Required.')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,15}$/, 'Promocode must be alphanumeric, between 4 and 15 characters long, and include at least one alphabetic character.')
    .min(4, 'Promocode must be at least 4 characters long.')
    .max(15, 'Promocode must be at most 15 characters long.'),
    // maxUses: Yup.number().required('Maximum uses is Required.')  ,
    affiliateId: Yup.number().required('Affiliate Id is Required.'),
    bonusSc: Yup.number().required('Bonus Sc is Required.'),
    bonusGc: Yup.number().required('Bonus Gc is Required.'),
    // validTill: Yup.date()
    // .min(today, 'Date cannot be earlier than today.')
    // .typeError('The value must be a date (MM-DD-YYYY)')
    // .required('Valid Till field is required'),
  });
export const editPromotionSchema = () =>
  Yup.object().shape({
    promocode: Yup.string() .required('Promocode is Required.')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,15}$/, 'Promocode must be alphanumeric, between 4 and 15 characters long, and include at least one alphabetic character.')
    .min(4, 'Promocode must be at least 4 characters long.')
    .max(15, 'Promocode must be at most 15 characters long.'),
    // maxUses: Yup.number().required('Maximum uses is Required.'),
    affiliateId: Yup.number().required('Affiliate Id is Required.'),
    bonusSc: Yup.number().required('Bonus Sc is Required.'),
    bonusGc: Yup.number().required('Bonus Gc is Required.'),
    // validTill: Yup.date()
    //   .min(today, 'Date cannot be earlier than today.')
    //   .typeError('The value must be a date (MM-DD-YYYY)')
    //   .required('Valid Till field is required'),
  });