import { Button, Row, Form as BForm, Col, Modal, Spinner } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { addGamesSchema } from '../schema'
import { useTranslation } from 'react-i18next'
import { serialize } from 'object-to-formdata'
import Select from 'react-select';
import useAddCasinoGames from '../hooks/useAddGames'

const AddGames = ({
  handleClose,
  show,
  gameData,
  type,
  subCategories
}) => {
  const {
    addCasinoGame,
    updateLoading,
    allProviders
  } = useAddCasinoGames(handleClose)
  const { t } = useTranslation('casinoGames')
  const [imageErr, setImageErr] = useState('')

  const formSubmit = (formValues) => {
    const data = {
      masterCasinoGameId: gameData?.masterCasinoGameId,
      gameName: formValues.gameName,
      masterGameSubCategoryId: formValues.masterGameSubCategoryId,
      providerId: formValues.providerId ? Number(formValues.providerId) : null,
      isActive: formValues.isActive,
      identifier: formValues.identifier,
      returnToPlayer: formValues.returnToPlayer,
    }
    if(formValues?.webLongImg) data.thumbnail = formValues.webLongImg;
      if(formValues?.webShortImg) data.thumbnailShort = formValues.webShortImg;
      if(formValues?.mobileImg) data.thumbnail = formValues.mobileImg;

    const formData = serialize(data)
    addCasinoGame(formData)
  }
  const categoryOptions = subCategories?.rows?.map(({ name, masterGameSubCategoryId }) => ({ value: masterGameSubCategoryId, label: (name)?.EN }))
  const providerOptions = allProviders?.rows?.map(({ masterCasinoProviderId, name }) => ({ value: masterCasinoProviderId, label: name }))

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          gameName: '',
          masterGameSubCategoryId: gameData?.subCategoryGames?.map(i => ({ value: i.masterGameSubCategoryId, label: i.name?.EN })) || null,                
          isActive: gameData?.isActive || true,
          webLongImg: null,
          providerId: '',
          identifier: '',
          returnToPlayer: '',
        }}
        validationSchema={addGamesSchema(t)}        
        onSubmit={(formValues, { resetForm }) => {
          formSubmit(formValues)
          handleClose()
          resetForm({ formValues: '' })
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue, handleReset, _resetForm }) => (
          <Form>
            <Modal
              show={show}
              onHide={handleClose}
              // onHide={() => {
              //   handleClose();
              //   resetForm();
              //   setImageErr('')
              // }}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>{type} {t('addGames.title')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="mt-3">
                  <Col>
                    <div className="d-flex align-items-center">
                      <BForm.Label className="w-50">
                        {t('addGames.fields.gameName.label')}
                        <span className="text-danger"> *</span>
                      </BForm.Label>
                      <BForm.Control
                        type="text"
                        name="gameName"
                        placeholder={t('addGames.fields.gameName.placeholder')}
                        value={values.gameName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="gameName"
                      className="text-danger"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <div className="d-flex align-items-center">
                      <BForm.Label className="w-50">
                        {t('addGames.fields.masterGameSubCategoryId.label')}
                        {/* <span className="text-danger"> *</span> */}
                      </BForm.Label>
                      <Select
                        styles={{
                          control: (baseStyles, _state) => ({
                            ...baseStyles,
                            width: '313px',
                          }),
                        }}
                        value={categoryOptions.find(option => option.value === values.masterGameSubCategoryId)}
                        onChange={(option) => setFieldValue('masterGameSubCategoryId', option.value)}
                        options={categoryOptions}
                      />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="masterGameSubCategoryId"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col className='d-flex'>
                    <BForm.Label className="" style={{width:'155px'}}>
                    {t('addGames.fields.status.label')}<span className='text-danger'> *</span>
                    </BForm.Label>

                    <BForm.Check
                      // className='mx-auto'
                      type='checkbox'
                      name='isActive'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.isActive}
                      defaultChecked={values?.isActive}
                    />

                    <ErrorMessage
                      component='div'
                      name='isActive'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <div className="d-flex align-items-center">
                      <BForm.Label className="w-50">
                        {t('addGames.fields.providerId.label')}<span className="text-danger"> *</span>
                      </BForm.Label>
                      <Select
                        styles={{
                          control: (baseStyles, _state) => ({
                            ...baseStyles,
                            width: '313px',
                          }),
                        }}
                        value={providerOptions.find(option => option.value === values.providerId)}
                        onChange={(option) => setFieldValue('providerId', option.value)}
                        options={providerOptions}
                      />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="providerId"
                      className="text-danger"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <div className="d-flex align-items-center">
                      <BForm.Label className="w-50">
                        {t('addGames.fields.identifier.label')}<span className="text-danger"> *</span>
                      </BForm.Label>
                      <BForm.Control
                        type="text"
                        name="identifier"
                        placeholder={t('addGames.fields.identifier.placeholder')}
                        value={values.identifier}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="identifier"
                      className="text-danger"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <div className="d-flex align-items-center">
                      <BForm.Label className="w-50">
                        {t('addGames.fields.returnToPlayer.label')}
                        <span className="text-danger"> *</span>
                      </BForm.Label>
                      <BForm.Control
                        type="number"
                        name="returnToPlayer"
                        placeholder={t('addGames.fields.returnToPlayer.placeholder')}
                        value={values.returnToPlayer}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <ErrorMessage
                      component="div"
                      name="returnToPlayer"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col className='d-grid'>
                    <BForm.Label>
                    {t('addGames.fields.thumbnail.label')}
                    </BForm.Label>
                  
                    <BForm.Label>{'Size (340px X 480px)'}</BForm.Label>
                    <BForm.Text>
                      <input
                        id='file'
                        name='webLongImg'
                        type='file'
                        onChange={(event) => {
                          setFieldValue(
                            'webLongImg',
                            event.currentTarget.files[0]
                          )
                          setImageErr('')
                        }}
                      />
                      {values?.webLongImg && (
                        <img
                          alt='not found'
                          width='60px'
                          src={URL.createObjectURL(values.webLongImg)}
                        />
                      )}
                      {!values?.webLongImg && gameData?.imageUrl && (
                        <img
                          alt='not found'
                          width='60px'
                          src={gameData?.imageUrl}
                        />
                      )}
                    </BForm.Text>

                    <ErrorMessage
                      component='div'
                      name='webLongImg'
                      className='text-danger'
                    />
                  </Col>                  
                </Row>
                <div>
                  {imageErr && <span className='text-danger'>{imageErr}</span>}
                </div>
              </Modal.Body>
              <div className="mt-2 ">
                <Modal.Footer className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="warning"
                    onClick={() => {
                      handleClose();
                      handleReset();
                      setImageErr('');
                    }}
                  >
                    {t('addGames.cancel')}
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    className="ml-2"
                    disabled={updateLoading}
                  >
                    {t('addGames.submit')}
                    {updateLoading && (
                      <Spinner
                        style={{ marginLeft: '4px' }}
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </Modal.Footer>
              </div>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AddGames
