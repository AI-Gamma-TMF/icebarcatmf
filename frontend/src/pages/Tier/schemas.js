import * as Yup from 'yup'
// const today = new Date(Date.now());

// const yesterday = new Date(Date.now() - 86400000);

export const casinoCategorySchema = () => Yup.object().shape({
  name: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must not exceed 50 characters')
    .matches(
      /^[a-zA-Z\s]+$/,
      'Title must only contain letters and spaces'
    ),
  requiredXp: Yup.number()
    .min(0, 'requiredXp should  be Positive value')
    //  .matches(
    //   /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
    //   'Enter Positive number'
    // )
    .required('requiredXp Required'),

  bonusGc: Yup.number()
    .min(0, 'Bonus GC should  be Positive value')
    .required('Bonus GC Required'),

  bonusSc: Yup.number()
    .min(0, 'Bonus SC should  be Positive value')
    .required('Bonus SC Required'),

  weeklyBonusPercentage: Yup.number()
    .min(0, 'Weekly Bonus Percentage  should  be Positive value')
    .required('Weekly Bonus Percentage  Required'),

  monthlyBonusPercentage: Yup.number()
    .min(0, 'Monthly bonus percentage  should  be Positive value')
    .required('Monthly bonus percentage  Required'),


  icon: Yup.mixed()
    // .required('Thumbnail required')
    .test(
      'File Size',
      'File Size Should be Less Than 1MB',
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      'FILE_FORMAT',
      'Uploaded file has unsupported format',
      (value) => {
        return !value ||
          (value && ['image/svg+xml'].includes(value.type))
      }
    ),

  // .required('At least one number is required'),

  // winnerPercentage: Yup.mixed().test({
  //     message: 'Required',test: 
  //    val => val.filter(i => i !== 0)})

})

