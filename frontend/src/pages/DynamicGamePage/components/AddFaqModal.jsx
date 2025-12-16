import React from 'react'
import { Modal, Button, Spinner, Form as BootstrapForm } from '@themesberg/react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import { addFaqSchema } from '../../Blogs/schema'


const AddFaqModal = ({
  show,
  setShow,
  handleSubmit,
  blogId,
  loading
}) => {
  const { t } = useTranslation(['translation'])

  const initialValues = {
    faqs: [
      { question: '', answer: '' }
    ]
  }

  const handleClose = (resetForm) => {
    setShow(false)
    resetForm()
  }

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Formik
        initialValues={initialValues}
        validationSchema={addFaqSchema}
        onSubmit={(values, { resetForm }) => {
            console.log(values,blogId);
            
          handleSubmit(values) 
          resetForm()
          setShow(false)
        }}
      >
        {({ resetForm, values }) => (
          <Form>
            <Modal.Header closeButton onHide={() => handleClose(resetForm)}>
              <Modal.Title>{t('Add Faq')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FieldArray name="faqs">
                {({ push, remove }) => (
                  <>
                    {values.faqs.map((_, index) => (
                      <div key={index} className="mb-4 border rounded p-3">
                        <BootstrapForm.Group controlId={`faqs.${index}.question`}>
                          <BootstrapForm.Label>{t('Question')} {index + 1}</BootstrapForm.Label>
                          <Field
                            name={`faqs.${index}.question`}
                            placeholder={t('Add Question')}
                            as={BootstrapForm.Control}
                          />
                          <div className="text-danger small mt-1">
                            <ErrorMessage name={`faqs.${index}.question`} />
                          </div>
                        </BootstrapForm.Group>

                        <BootstrapForm.Group controlId={`faqs.${index}.answer`} className="mt-3">
                          <BootstrapForm.Label>{t('Answer')} {index + 1}</BootstrapForm.Label>
                          <Field
                            name={`faqs.${index}.answer`}
                            as="textarea"
                            rows={3}
                            placeholder={t('Add Answer')}
                            className="form-control"
                          />
                          <div className="text-danger small mt-1">
                            <ErrorMessage name={`faqs.${index}.answer`} />
                          </div>
                        </BootstrapForm.Group>

                        {values.faqs.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="mt-3"
                            onClick={() => remove(index)}
                          >
                            {t('Remove')}
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => push({ question: '', answer: '' })}
                    >
                      {t('Add More FAQ')}
                    </Button>
                  </>
                )}
              </FieldArray>
            </Modal.Body>

            <Modal.Footer>
              <Button variant='secondary' onClick={() => handleClose(resetForm)}>
                {t('Cancel')}
              </Button>
              <Button type="submit" variant='primary' disabled={loading}>
                {t('Submit')}
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="ms-2"
                  />
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddFaqModal
