import * as Yup from 'yup';


  export const playerSearchSchmes = () => Yup.object().shape({
    idSearch: Yup.number()
      .typeError('Must be number')
      .positive('Must be positive')
      .integer('Must be more than 0'),
  })
  