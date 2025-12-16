import React from 'react'
import { casinoCategorySchema } from '../schemas'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Modal,
} from '@themesberg/react-bootstrap'


const CreateCasinoMenu = ({
  t,
  categoryName: editCategoryName,
  isActive: editIsActive,
  categoryId,
  handleClose,
  showModal,
  type
}) => {
  // const {
  //   loading,
  //   updateCasinoCategory,
  //   createCasinoCategory
  // } = useCreateCasinoCategory(handleClose)

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{type} {t('casinoCategory.createCategory.label')}</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={{
          isActive: categoryId ? editIsActive : false,
          categoryName: editCategoryName ? editCategoryName?.EN : ''
        }}
        validationSchema={casinoCategorySchema(t)}
        // onSubmit={({ isActive, categoryName }) => {
        //   categoryId
        //     ? updateCasinoCategory({
        //         casinoCategoryId: categoryId,
        //         name: {'EN': categoryName},
        //         isActive
        //       })
        //     : 
        //     createCasinoCategory({
        //         isActive,
        //         name: {'EN': categoryName}
        //       })
        // }}
      >
        {({ values, handleChange, handleSubmit, handleBlur }) => (
          <Form>
            <Modal.Body>
              <Row className='mt-3'>
                      <Col>
                        <BForm.Label>
                        {t('casinoCategory.inputField.categoryName.label')}<span className='text-danger'> *</span>
                        </BForm.Label>

                        <BForm.Control
                          type='text'
                          name='categoryName'
                          placeholder={t('casinoCategory.inputField.categoryName.placeholder')}
                          value={values.categoryName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />

                        <ErrorMessage
                          component='div'
                          name='categoryName'
                          className='text-danger'
                        />
                      </Col>
                    </Row>

              <Row className='mt-3'>
                <Col className='d-flex'>
                  <BForm.Label>
                  {t('casinoCategory.inputField.isActive.label')} 
                  </BForm.Label>

                  <BForm.Check
                    type='checkbox'
                    className='mx-auto'
                    name='isActive'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.isActive}
                    defaultChecked={editIsActive}
                  />
                </Col>
              </Row>
            </Modal.Body>

            <div className='mt-4'>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => handleClose()}>
                {t('casinoCategory.createCategory.cancel')}
                </Button>

                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                  // disabled={loading}
                >
                  {t('casinoCategory.createCategory.submit')}
                  {/* {loading && (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )} */}
                </Button>
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateCasinoMenu
