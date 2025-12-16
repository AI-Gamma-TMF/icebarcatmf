import { Row, Form as BForm, Button, Spinner, Col } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { seoDetailsSchema } from '../../schema'
import { useUpdateSEODetailsMutation } from '../../../../reactQuery/hooks/customMutationHook'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../../components/Toast'

const SeoDetails = ({
  pageId,
  seoDetails
}) => {
  const { t } = useTranslation(['contentPages'])
  const [editableCredentials, setEditableCredentials] = useState(false)
  const queryClient = useQueryClient()
  const { isLoading, mutate: updateSeoDetails } = useUpdateSEODetailsMutation({onSuccess: () => {
    toast('SEO details updated Successfully.', 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPagesList'] })
  }})
  
  return (
    <Row>
      <Col sm={12} className='my-2'>
        <div className='text-right m-n1'>
          <button
            type='button' className='m-1 btn btn-warning'
            disabled={editableCredentials}
            onClick={() => {
              setEditableCredentials(true)
            }}
          >{t('editButton')}
          </button>
        </div>
      </Col>
      <Formik
        enableReinitialize
        initialValues={{
          title: seoDetails?.title ? seoDetails.title : '',
          description: seoDetails?.description ? seoDetails.description : '',
          keywords: seoDetails?.keywords ? seoDetails.keywords : ''
        }}
        validationSchema={seoDetailsSchema(t)}
        onSubmit={(formValues) => {
          updateSeoDetails({pageId: +pageId, ...formValues})
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur }) => {
          return (
            <Form>
              <Row>
                <Col>
                  <BForm.Label>
                    {t('seoDetails.inputField.title.label')}
                    <span className='text-danger'> *</span>
                  </BForm.Label>
                  <BForm.Control
                    type='text'
                    name='title'
                    disabled={!editableCredentials}
                    value={values?.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />

                  <ErrorMessage
                    component='div'
                    name='title'
                    className='text-danger'
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <BForm.Label>
                    {t('seoDetails.inputField.description.label')}
                    <span className='text-danger'> *</span>
                  </BForm.Label>
                  <BForm.Control
                    type='text'
                    name='description'
                    disabled={!editableCredentials}
                    value={values?.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />

                  <ErrorMessage
                    component='div'
                    name='description'
                    className='text-danger'
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <BForm.Label>
                    {t('seoDetails.inputField.keywords.label')}
                    <span className='text-danger'> *</span>
                  </BForm.Label>
                  <BForm.Control
                    type='text'
                    name='keywords'
                    disabled={!editableCredentials}
                    value={values?.keywords}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />

                  <ErrorMessage
                    component='div'
                    name='keywords'
                    className='text-danger'
                  />
                </Col>
              </Row>

              {
                  editableCredentials &&
                    <div className='mt-4 mb-3'>
                      <Button
                        variant='success'
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className='ml-2'
                      >
                        {t('submitButton')}
                        {isLoading && (
                          <Spinner
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        )}
                      </Button>
                    </div>
              }
            </Form>
          )
        }}
      </Formik>

    </Row>
  )
}

export default SeoDetails
