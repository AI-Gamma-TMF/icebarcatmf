import { Button, Row, Form as BForm, Col, Modal, Spinner } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React, { useState } from 'react'
import useEditCasinoGames from '../hooks/useEditCasinoGames'
import { editGamesSchema } from '../schema'
import { useTranslation } from 'react-i18next'
import { serialize } from 'object-to-formdata'
import Select from 'react-select';


const EditGames = ({
  handleClose,
  show,
  gameData,
  type,
  subCategories
}) => {
  const {
    updateCasinoGame,
    updateLoading
  } = useEditCasinoGames(handleClose)
  const { t } = useTranslation('casinoGames')

  const [imageErr, setImageErr] = useState('')

  const formSubmit = (formValues) => {
    const data = {
      masterCasinoGameId: gameData?.masterCasinoGameId,
      name: formValues.name,
      isActive: formValues.isActive,
      // fullScreen: formValues.fullScreen,
      masterGameSubCategoryId: formValues.category?.filter(i => i)?.map(i => i?.value)?.toString()
    }
    if (formValues?.webLongImg) data.thumbnailLong = formValues.webLongImg;
    if (formValues?.webShortImg) data.thumbnailShort = formValues.webShortImg;
    if (formValues?.mobileImg) data.thumbnail = formValues.mobileImg;
    const formData = serialize(data)
    updateCasinoGame(formData)
  }

  const categoryOptions = subCategories?.rows?.map(({ name, masterGameSubCategoryId }) => ({ value: masterGameSubCategoryId, label: (name)?.EN }))

  const categoryForGameData = subCategories?.rows?.filter(({ _name, masterGameSubCategoryId }) => gameData?.masterGameSubCategoryIds?.map(i => i)?.includes(masterGameSubCategoryId))
  const categoryOptionsGameData = categoryForGameData?.map(({ name, masterGameSubCategoryId }) => ({ value: masterGameSubCategoryId, label: (name)?.EN }))

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={
          {
            name: gameData?.gameName || '',
            webLongImg: null,
            webShortImg: null,
            mobileImg: null,
            isActive: gameData?.isActive || false,
            // fullScreen: gameData?.fullScreen || false,
            category: gameData ? categoryOptionsGameData : null
          }
        }
        validationSchema={editGamesSchema(t)}
        onSubmit={formSubmit}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
          <Form>
            <Modal
              show={show}
              onHide={() => {
                setImageErr('')
                handleClose()
              }}
              backdrop='static'
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>{type} {t('editGames.title')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className='mt-3'>
                  <Col>
                    <div className='d-flex align-items-center'>
                      <BForm.Label className='w-50'>
                        {t('editGames.fields.name.label')}<span className='text-danger'> *</span>
                      </BForm.Label>

                      <BForm.Control
                        type='text'
                        name='name'
                        placeholder={t('editGames.fields.name.placeholder')}
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <ErrorMessage
                      component='div'
                      name='name'
                      className='text-danger'
                    />
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <div className='d-flex align-items-center'>
                      <BForm.Label className='w-50'>
                        {t('editGames.fields.subCategory.label')}<span className='text-danger'> *</span>
                      </BForm.Label>
                      <Select
                        isMulti
                        styles={{
                          control: (baseStyles, _state) => ({
                            ...baseStyles,
                            width: '313px',
                          }),
                        }}
                        // className='subcategory-select'
                        value={values.category}
                        onChange={(e) => setFieldValue(
                          'category', e
                        )}
                        options={categoryOptions}
                      />
                    </div>
                    <ErrorMessage
                      component='div'
                      name='masterGameSubCategoryId'
                      className='text-danger'
                    />
                  </Col>
                </Row>

                <Row className='mt-3'>
                  <Col className='d-flex'>
                    <BForm.Label>
                      {t('editGames.fields.status.label')}<span className='text-danger'> *</span>
                    </BForm.Label>

                    <BForm.Check
                      className='mx-auto'
                      type='checkbox'
                      name='isActive'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.isActive}
                      defaultChecked={gameData?.isActive}
                    />

                    <ErrorMessage
                      component='div'
                      name='isActive'
                      className='text-danger'
                    />
                  </Col>
                </Row>
                {/* <Row className='mt-3'>
                  <Col className='d-flex'>
                    <BForm.Label>
                      Full Screen<span className='text-danger'> *</span>
                    </BForm.Label>

                    <BForm.Check
                      className='mx-auto'
                      type='checkbox'
                      name='fullScreen'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fullScreen}
                      defaultChecked={gameData?.fullScreen}
                    />

                    <ErrorMessage
                      component='div'
                      name='fullScreen'
                      className='text-danger'
                    />
                  </Col>
                </Row> */}

                <Row className='mt-3'>
                  <Col className='d-grid'>
                    <BForm.Label>
                      {t('editGames.fields.thumbnail.label')}<span className='text-danger'> *</span>
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
                  {/* <Col className='d-grid mt-3'>
                  
                    <BForm.Label>{'Size (170px X 230px)'}</BForm.Label>
                    <BForm.Text>
                      <input
                        id='file'
                        name='webShortImg'
                        type='file'
                        onChange={(event) => {
                          setFieldValue(
                            'webShortImg',
                            event.currentTarget.files[0]
                          )
                          setImageErr('')
                        }}
                      />
                      {values?.webShortImg && (
                        <img
                          alt='not found'
                          width='60px'
                          src={URL.createObjectURL(values.webShortImg)}
                        />
                      )}
                      {!values?.webShortImg && gameData?.MasterCasinoGamesThumbnails?.filter(i => i.thumbnailType == 'short')[0]?.thumbnailPath && (
                        <img
                          alt='not found'
                          width='60px'
                          src={gameData?.MasterCasinoGamesThumbnails?.filter(i => i.thumbnailType == 'short')[0]?.thumbnailPath}
                        />
                      )}
                    </BForm.Text>

                    <ErrorMessage
                      component='div'
                      name='webShortImg'
                      className='text-danger'
                    />
                  </Col>
                  <Col className='d-grid mt-3'>
                  
                    <BForm.Label>{'Size (112px X 154px)'}</BForm.Label>
                    <BForm.Text>
                      <input
                        id='file'
                        name='mobileImg'
                        type='file'
                        onChange={(event) => {
                          setFieldValue(
                            'mobileImg',
                            event.currentTarget.files[0]
                          )
                          setImageErr('')
                        }}
                      />
                      {values?.mobileImg && (
                        <img
                          alt='not found'
                          width='60px'
                          src={URL.createObjectURL(values.mobileImg)}
                        />
                      )}
                      {!values?.mobileImg && gameData?.MasterCasinoGamesThumbnails?.filter(i => i?.thumbnailType == 'mobile')?.[0]?.thumbnailPath && (
                        <img
                          alt='not found'
                          width='60px'
                          src={gameData?.MasterCasinoGamesThumbnails?.filter(i => i?.thumbnailType == 'mobile')?.[0]?.thumbnailPath}
                        />
                      )}
                    </BForm.Text>

                    <ErrorMessage
                      component='div'
                      name='mobileImg'
                      className='text-danger'
                    />
                  </Col> */}
                </Row>
                <div>
                  {imageErr && <span className='text-danger'>{imageErr}</span>}
                </div>
              </Modal.Body>

              <div className='mt-2 '>
                <Modal.Footer className='d-flex justify-content-between align-items-center'>
                  <Button
                    variant='warning'
                    onClick={() => {
                      handleClose()
                      handleReset()
                      setImageErr('')
                    }}
                  >
                    {t('editGames.cancel')}
                  </Button>
                  <Button
                    variant='success'
                    onClick={handleSubmit}
                    className='ml-2'
                    disabled={updateLoading}
                  >
                    {t('editGames.submit')}
                    {updateLoading && (
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
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default EditGames
