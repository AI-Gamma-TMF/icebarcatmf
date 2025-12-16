import * as Yup from 'yup'

export const casinoCategorySchema = (t) => Yup.object().shape({
  categoryName: Yup.string().max(100, t('casinoCategory.inputField.categoryName.errors.max')).required(t('casinoCategory.inputField.categoryName.errors.required'))
})
