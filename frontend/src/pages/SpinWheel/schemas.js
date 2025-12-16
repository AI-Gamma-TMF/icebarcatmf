import * as Yup from 'yup';


export const spinWheelValidationSchema = Yup.object().shape({
  wheelDivisionId: Yup.string()
    .required('Wheel Division Id field is required'),
  
  sc: Yup.number()
    .min(0, 'SC cannot be negative')
    .required('SC field is required'),
  
  gc: Yup.number()
    .min(0, 'GC cannot be negative')
    .required('GC field is required'),
  
  isAllow: Yup.boolean()
    .required('Is Allow field is required'),
  
    playerLimit: Yup.number()
    .min(0, 'Player Limit cannot be negative')
    .integer('Player Limit must be an integer')
    .nullable()
    .notRequired(),
  
  priority: Yup.number()
    .min(1, 'Priority must be at least 1')
    .max(5, 'Priority must be at most 5')
    .required('Priority field is required')
});