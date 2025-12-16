import * as Yup from 'yup'

export const playerSearchSchmes = () =>
  Yup.object().shape({
    search: Yup.string()
      .trim()
      .max(100, 'Search text too long')
      .matches(
        /^[a-zA-Z0-9@._\s-]*$/,
        'Only alphanumeric characters, @, ., -, and _ are allowed'
      ),

      phoneSearch: Yup.number()
      .typeError('Must be a number')
      .positive('Must be a positive number')
      .integer('Must be an integer')
      .max(9999999999, 'Cannot be more than 10 digits'),
    
      promocodeStatus: Yup.string()
      .oneOf(['all', 'true', 'false'], 'Invalid status'),

      isActiveSearch: Yup.string()
      .oneOf(['all', 'true', 'false']),

      unifiedSearch: Yup.string().nullable(),

  });