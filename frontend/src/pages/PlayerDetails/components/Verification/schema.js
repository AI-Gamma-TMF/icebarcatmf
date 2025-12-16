import * as Yup from 'yup'

export const userDocsUpload = () => Yup.object().shape({
  documentType: Yup.string().required('Document Type Required.'),
  document: Yup.mixed().required('Document Required.')
    .test('File Size',
      'File Size should be less than 1 MB',
      (value) => !value || (value && value.size <= 1024 * 1024))
    .test('FILE_FORMAT', 'Unsupported Format',
      (value) => !value || (value && ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        .includes(value.type)))
})