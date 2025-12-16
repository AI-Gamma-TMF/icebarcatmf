import * as Yup from 'yup';
// const today = new Date(Date.now());

export const createPromoSchema = () =>
  Yup.object().shape({
    promocode: Yup.string()
      .required('Promocode is required.')
      .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,15}$/, 'Promocode must be alphanumeric, between 4 and 15 characters long, and include at least one alphabetic character.')
      .min(4, 'Promocode must be at least 4 characters long.')
      .max(15, 'Promocode must be at most 15 characters long.'),
    // isActive: Yup.boolean().required('Active status is required.'),
    validTill: Yup.date().when('isValidUntil', {
      is: true,
      then: () => Yup.date()
        .min(new Date(), 'Date cannot be earlier than today.')
        .typeError('The value must be a date (MM-DD-YYYY)')
        .required('Valid Till field is required.')
    }),
    maxUsersAvailed: Yup.number()
      .min(0, 'Max Users Availed must be at least 0.'),
      // .required('Max Users Availed is required.'),
    perUserLimit: Yup.number()
      // .required('Per user limit is required.')
      .min(0, 'Per user limit must be at least 0.'),
    isDiscountOnAmount: Yup.boolean().required('Discount on Amount is required.'),
    //isDiscountOnAmount: Yup.boolean(),
    discountPercentage: Yup.number().when('isDiscountOnAmount', {
      is: true,
      then: () => Yup.number()
        .required('Discount percentage is required.')
        .min(1, 'Discount percentage must be at least 1.')
        .max(99, 'Discount percentage must be less than 100.'),
      otherwise: () => Yup.number()
        .required('Bonus percentage is required.')
        .min(1, 'Bonus percentage must be at least 1.')
        .max(100, 'Bonus percentage must be at most 100.'),
    }),
    // promotionName: Yup.string().when('crmPromocode',{
    //   is:true,
    //   then:()=>Yup.string().required('Promotion Name is required.')
    // })
    promotionName: Yup.string()
    .required('Promotion Name is required.')
  
      
  });



export const editPromoSchema = (maxUsersAvailedCount) =>
  Yup.object().shape({
    promocode: Yup.string()
      .required('Promocode is required.')
      .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,15}$/, 'Promocode must be alphanumeric, between 4 and 15 characters long, and include at least one alphabetic character.')
      .min(4, 'Promocode must be at least 4 characters long.')
      .max(15, 'Promocode must be at most 15 characters long.'),
    // isActive: Yup.boolean().required('Active status is required.'),
    validTill: Yup.date().when('isValidUntil', {
      is: true,
      then: () => Yup.date()
        .min(new Date(), 'Date cannot be earlier than today.')
        .typeError('The value must be a date (MM-DD-YYYY)')
        .required('Valid Till field is required.')
    }),
    maxUsersAvailed: Yup.number()
      .min(0, 'Max Users Availed must be at least 0.')
      // .required('Max Users Availed is required.')
      .test(
        'maxUsersAvailed-greater-than-maxUsersAvailedCount',
        `Max Users Availed must be greater than ${maxUsersAvailedCount}.`,
        function (value) {
          return value===0?true:value >= maxUsersAvailedCount;
        }
      ),
    perUserLimit: Yup.number()
      // .required('Per user limit is required.')
      .min(0, 'Per user limit must be at least 0.'),
    isDiscountOnAmount: Yup.boolean().required('Discount on Amount is required.'),
    //isDiscountOnAmount: Yup.boolean(),
    discountPercentage: Yup.number().when('isDiscountOnAmount', {
      is: true,
      then: () => Yup.number()
        .required('Discount percentage is required.')
        .min(1, 'Discount percentage must be at least 1.')
        .max(99, 'Discount percentage must be less than 100.'),
      otherwise: () => Yup.number()
        .required('Bonus percentage is required.')
        .min(1, 'Bonus percentage must be at least 1.')
        .max(100, 'Bonus percentage must be at most 100.'),
    }),
  });