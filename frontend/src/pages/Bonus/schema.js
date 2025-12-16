import * as Yup from 'yup'

export const createBonusSchema = (t) =>
  Yup.object().shape({
    bonusName: Yup.string()
      .required(t('errors.bonusName')),

    description: Yup.string()
      .required(t('errors.description')),

    bonusAmountSc: Yup.number()
      .min(0, 'Bonus SC must be a positive number')
      .typeError('Bonus SC must be a valid number'),

    bonusAmountGc: Yup.number()
      .min(0, 'Bonus GC must be a positive number')
      .typeError('Bonus GC must be a valid number'),


    // postalCodeIntervalInMinutes: Yup.number()
    // .when("bonusName", {
    //   is: 'Postal Code Bonus',
    //   then: (schema) =>
    //     schema
    //   .required(t('This is required field'))
    //   .min(1, 'Value must be greater than 0')
    //   .integer('Postal code validity (in minutes) must be an integer'),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
    // postalCodeValidityInDays: Yup.number()
    // .when("bonusName", {
    //   is: 'Postal Code Bonus',
    //   then: (schema) =>
    //     schema
    //   .required(t('This is required field'))
    //   .min(1, 'Value must be greater than 0')
    //   .integer('Postal code validity (in days) must be an integer'),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
      
  })
