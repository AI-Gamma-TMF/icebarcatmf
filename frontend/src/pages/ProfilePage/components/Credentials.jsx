import { Row, Form as BForm, Button, Spinner, Col } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import { Buffer } from 'buffer'
import { useTranslation } from 'react-i18next'

const Credentials = ({
  details,
  updateCreds,
  loading,
  editableCreds,
  setEditableCreds
}) => {
  const { t } = useTranslation(['profile'])
  let sKey = details?.siteConfig?.find((obj) => obj.key === 'SENDGRID_API_KEY')?.value || ''
  const sEmail = details?.siteConfig?.find((obj) => obj.key === 'SENDGRID_EMAIL')?.value || ''
  sKey = Buffer.from(sKey, 'base64').toString('ascii')
  return (
    <Row>
      <Col sm={12} className='my-2'>
        <div className='text-right m-n1'>
          <button
            type='button' className='m-1 btn btn-warning'
            onClick={() => {
              setEditableCreds(true)
            }}
          >{t('editButton')}
          </button>
        </div>
      </Col>

      {details &&
        <Formik
          enableReinitialize
          initialValues={{
            sendgridKey: sKey,
            sendgridEmail: sEmail
          }}
          // validationSchema={adminProfileSchema}
          onSubmit={(formValues) => {
            updateCreds({ data: formValues })
          }}
        >
          {({ values, handleChange, handleSubmit, handleBlur }) => {
            return (
              <Form>
                <Row>
                  <Col>
                    <BForm.Label>
                      {t('sendgridEmail')}
                      <span className='text-danger'> *</span>
                    </BForm.Label>
                    <BForm.Control
                      type='email'
                      name='sendgridEmail'
                      disabled={!editableCreds}
                      value={values?.sendgridEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />

                    <ErrorMessage
                      component='div'
                      name='sendgridEmail'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col>
                    <BForm.Label>
                      {t('sendgridApiKey')}
                      <span className='text-danger'> *</span>
                    </BForm.Label>
                    <BForm.Control
                      type={editableCreds ? 'text' : 'password'}
                      name='sendgridKey'
                      disabled={!editableCreds}
                      value={values?.sendgridKey}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />

                    <ErrorMessage
                      component='div'
                      name='sendgridKey'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                {
                    editableCreds &&
                      <div className='mt-4 mb-3'>
                        <Button
                          variant='success'
                          onClick={handleSubmit}
                          className='ml-2'
                        >
                          {t('submitButton')}
                          {loading && (
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
        </Formik>}

    </Row>
  )
}

export default Credentials
