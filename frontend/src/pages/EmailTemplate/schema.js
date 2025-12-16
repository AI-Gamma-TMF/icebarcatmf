import * as Yup from 'yup'

export const createEmailTemplateSchema = (t) => Yup.object().shape({
    subject: Yup.string()
      .required(t('errors.subject')),
    scheduledAt: Yup.string()
        .required(t('errors.scheduleTime')),
    templateEmailCategoryId: Yup.string()
        .required(t('errors.emailCategory')),
  })