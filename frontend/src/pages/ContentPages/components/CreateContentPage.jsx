import React from 'react'
import { createContentPageSchema } from '../schema'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Modal,
} from '@themesberg/react-bootstrap'

import useCreateContentPage from '../hooks/useCreateContentPage'

const CreateContentPage = ({
  t,
  pageName: editPageName,
  pageId,
  handleClose,
  showModal,
  type
}) => {
  const {
    loading,
    updateContentPage,
    createContentPage
  } = useCreateContentPage(handleClose)
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{type} {t('createContentPage.label')}</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={{
          pageName: editPageName ? editPageName : ''
        }}
        validationSchema={createContentPageSchema(t)}
        onSubmit={({ pageName }) => {
          pageId
            ? updateContentPage({
                pageId: pageId,
                pageName: pageName
              })
            : createContentPage({
                pageName: pageName
              })
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur }) => (
          <Form>
            <Modal.Body>
              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                  {t('inputField.pageName.label')}<span className='text-danger'> *</span>
                  </BForm.Label>

                  <BForm.Control
                    type='text'
                    name='pageName'
                    placeholder={t('inputField.pageName.placeholder')}
                    value={values.pageName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component='div'
                    name='pageName'
                    className='text-danger'
                  />
                </Col>
              </Row>
            </Modal.Body>

            <div className='mt-4'>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => handleClose()}>
                {t('cancelButton')}
                </Button>

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
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateContentPage
