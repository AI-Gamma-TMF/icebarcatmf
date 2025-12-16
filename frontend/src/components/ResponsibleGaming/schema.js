import * as Yup from 'yup'

export const limitsSchema = ({ minimum, currLabel, label, t }) => Yup.object().shape({
  limit: Yup.number()
    .positive(t('playerLimit.errors.limitPositive'))
    .integer(t('playerLimit.errors.limitInt'))
    .min(minimum + 1, `${currLabel} Must Be Greater Than ${label} (${minimum})`)
    .required(t('playerLimit.errors.limitReq'))
})

export const setDisableUserlimitsSchema = (t) => Yup.object().shape({
  limit: Yup.number()
    .positive(t('playerLimit.errors.timePeriodPositive'))
    .integer(t('playerLimit.errors.timePeriodInt'))
    .required(t('playerLimit.errors.timePeriodReq'))
})

export const selfExclusionSchema = (t) => Yup.object().shape({
  days: Yup.number()
    .positive(t('playerLimit.errors.monthPositive'))
    .integer(t('playerLimit.errors.monthInt'))
    .required(t('playerLimit.errors.monthReq'))
})

export const responsibleSessionSchema = Yup.object().shape({
    sessionReminderTime: Yup
      .object()
      .shape({
      value: Yup.string().required('Please select session')
      })
      .nullable() // for handling null value when clearing options via clicking 'x'
      .required('Please select session')
  })
