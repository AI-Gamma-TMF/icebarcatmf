import React from 'react'
import {
  Button,
  Form as BForm,
  Row,
  Col,
  Modal,
  Spinner
} from '@themesberg/react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'
import { editproviderSchema, providerSchema } from '../schema'
import Trigger from '../../../components/OverlayTrigger'

const CreateCasinoProviders = ({
  t,
  handleClose,
  data,
  show,
  type,
  loading,
  createProvider,
  updateProvider
}) => {
  return (
    <>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >

<Formik
            initialValues={
          data?.masterCasinoProviderId
            ? {
                name: data.name,
                isActive: data.isActive,
                thumbnail: null,
              }
            : {
                name: '',
                isActive: false,
                thumbnail: null
              }
        }
            validationSchema={
              data?.masterCasinoProviderId ? editproviderSchema(t) : providerSchema(t)
            }
            onSubmit={(formValues) => {
              data?.masterCasinoProviderId
                ? updateProvider(formValues, { masterCasinoProviderId: data?.masterCasinoProviderId })
                : createProvider(formValues)
            }}
          >
            {({ values, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
              <Form>
        <Modal.Header closeButton>
          <Modal.Title>{type ? type : ''} {t('casinoProvider.createProvider.provider')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                    <Row className='mt-3'>
                      <Col>
                        <BForm.Label>
                          {t('casinoProvider.inputField.providerName.label')}<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Control
                          type='text'
                          name='name'
                          placeholder={t('casinoProvider.inputField.providerName.placeholder')}
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <ErrorMessage
                          component='div'
                          name='name'
                          className='text-danger'
                        />
                      </Col>
                    </Row>

                    <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                        {t('casinoProvider.inputField.status.label')}
                        </BForm.Label>

                        <BForm.Check
                          className='mx-auto'
                          type='checkbox'
                          name='isActive'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.isActive}
                          defaultChecked={values.isActive}
                        />

                        <ErrorMessage
                          component='div'
                          name='isActive'
                          className='text-danger'
                        />
                      </Col>
                    </Row>

                    <Row className='mt-3'>
                      <Col className='d-grid'>
                        <BForm.Label>{t('casinoProvider.inputField.thumbnail.label')}</BForm.Label>

                        <BForm.Text>
                          <Trigger message={t('casinoProvider.inputField.thumbnail.message')} id={'trig'} />
                            <input
                            id={'trig'}
                              title=' '
                              name='thumbnail'
                              type='file'
                              onChange={(event) => {
                                setFieldValue(
                                  'thumbnail',
                                  event.currentTarget.files[0]
                                )
                              }}
                            />
                          {values?.thumbnail && (
                            <img
                              alt='not found'
                              width='60px'
                              src={URL.createObjectURL(values.thumbnail)}
                            />
                          )}
                          {!values?.thumbnail && data?.thumbnailUrl && (
                            <img
                              alt='not found'
                              width='60px'
                              src={data.thumbnailUrl}
                            />
                          )}
                        </BForm.Text>

                        <ErrorMessage
                          component='div'
                          name='thumbnail'
                          className='text-danger'
                        />
                      </Col>
                    </Row>

              
            </Modal.Body>

                  <div className='mt-4 '>
                    <Modal.Footer className='d-flex justify-content-between align-items-center'>
                      <Button variant='warning' onClick={() => handleClose()}>
                      {t('casinoProvider.createProvider.cancel')}
                      </Button>
                      <Button
                        variant='success'
                        onClick={handleSubmit}
                        className='ml-2'
                        disabled={loading}
                      >
                        {t('casinoProvider.createProvider.submit')}
                        {loading && (
                          <Spinner
                            style={{marginLeft: '4px'}}
                            as='span'
                            animation='border'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        )}
                      </Button>
                    </Modal.Footer>
                  </div>
                  </Form>
                  )}
                </Formik>
                </Modal>
    </>
  )
}

export default CreateCasinoProviders
