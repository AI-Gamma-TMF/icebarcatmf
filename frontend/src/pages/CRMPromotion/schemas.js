import * as Yup from 'yup';

// const today = new Date(Date.now());

export const createCRMPromoSchema = () =>
  Yup.object().shape({
    promocode: Yup.string()
      .required('Promocode is required.')
      .min(4, 'Promocode must be at least 4 characters long.')
      .max(15, 'Promocode must be at most 15 characters long.'),

    name: Yup.string()
    .required('Name is required.'),

    gcAmount: Yup.number()
      .min(0, 'Bonus GC should be a positive value')
      .required('Bonus GC Required')
      .test(
        'at-least-one-greater-than-zero',
        'At least one of Bonus GC or Bonus SC must be greater than 0',
        function (value) {
          const { scAmount } = this.parent; 
          if (value === 0 && scAmount === 0) {
            return this.createError({
              message: 'At least one of Bonus GC or Bonus SC must be greater than 0',
            });
          }
          return true;
        }
      ),

    scAmount: Yup.number()
      .min(0, 'Bonus SC should be a positive value')
      .required('Bonus SC Required')
      .test(
        'at-least-one-greater-than-zero',
        'At least one of Bonus GC or Bonus SC must be greater than 0',
        function (value) {
          const { gcAmount } = this.parent; 
          if (value === 0 && gcAmount === 0) {
            return this.createError({
              message: 'At least one of Bonus GC or Bonus SC must be greater than 0',
            });
          }
          return true;
        }
      ),
  });




export const editCrmPromoSchema = () =>
Yup.object().shape({
    gcAmount: Yup.number()
    .min(0, 'Bonus GC should  be Positive value')
    .required('Bonus GC Required'),

    scAmount: Yup.number()
    .min(0, 'Bonus SC should  be Positive value')
    .required('Bonus SC Required'),
});