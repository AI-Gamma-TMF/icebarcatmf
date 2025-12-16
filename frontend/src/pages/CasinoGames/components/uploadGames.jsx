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
import { uploadGamesSchema } from '../schema'
import Trigger from '../../../components/OverlayTrigger'
import { serialize } from 'object-to-formdata'
import { useTranslation } from 'react-i18next'

const UploadGames = ({
  handleClose,
  show,
  loading,
  uploadGames,
  casinoProviders
}) => {
  const { t } = useTranslation('casinoGames')
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >

      <Formik
        initialValues={
         {inputJson: null, masterCasinoProviderId: '', assetsURL: ''}
        }
        validationSchema={uploadGamesSchema(t)}
        onSubmit={(formValues) => {
          uploadGames(serialize({gameFile: formValues?.inputJson, masterCasinoProviderId: parseInt(formValues.masterCasinoProviderId), assetsURL: formValues?.assetsURL }))
        }}
      >
        {({ handleSubmit, setFieldValue, handleChange, handleBlur, values }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>{t('uploadGames.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                  {t('uploadGames.fields.providers.label')}  <span className='text-danger'>*</span>
                  </BForm.Label>

                  <BForm.Select
                    value={values.masterCasinoProviderId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name='masterCasinoProviderId'
                  >
                    <option value=''>{t('uploadGames.fields.providers.selectProviders')} </option>

                    {casinoProviders && casinoProviders?.rows?.map((c) => (
                      <option
                        key={c?.masterCasinoProviderId}
                        value={c?.masterCasinoProviderId}
                      >
                        {c?.name}
                      </option>
                    ))}
                  </BForm.Select>

                  <ErrorMessage
                    component='div'
                    name='masterCasinoProviderId'
                    className='text-danger'
                  />
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    {t('uploadGames.fields.assetsURL.label')}  <span className='text-danger'>*</span>
                  </BForm.Label>

                  <BForm.Control
                    type='text'
                    name='assetsURL'
                    value={values.assetsURL}
                    placeholder={t('uploadGames.fields.assetsURL.placeholder')}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component='div'
                    name='assetsURL'
                    className='text-danger'
                  />
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col className='d-grid'>
                  <BForm.Label>{t('uploadGames.fields.inputJson.label')} <span className='text-danger'>*</span></BForm.Label>

                  <BForm.Text>
                    <Trigger message={t('uploadGames.fields.inputJson.label')} id={'abc'} />
                      <input
                      id={'abc'}
                        title=' '
                        name='inputJson'
                        type='file'
                        onChange={(event) => {
                          setFieldValue(
                            'inputJson',
                            event.currentTarget.files[0]
                          )
                        }}
                      />
                  </BForm.Text>

                  <ErrorMessage
                    component='div'
                    name='inputJson'
                    className='text-danger'
                  />
                </Col>
              </Row>


            </Modal.Body>

            <div className='mt-4 '>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => handleClose()}>
                  {t('uploadGames.cancelButton')}
                </Button>
                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                  disabled={loading}
                >
                  {t('uploadGames.submitButton')}
                  {loading && (
                    <Spinner
                      style={{ marginLeft: '4px' }}
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
  )
}

export default UploadGames
