import React from 'react'
import {
  Button,
  Form as BForm,
  Row,
  Col,
  Modal
} from '@themesberg/react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'
import { aggregatorSchema } from '../schema'
// import Preloader from '../../../../components/Preloader'

const CreateAggregator = ({
  handleClose,
  show,
  createAggregator,
}) => {
  return (
    <>
       
          <>
            <Formik
              initialValues={{
                name: '',
                isActive: false
              }}
              validationSchema={aggregatorSchema}
              onSubmit={(formValues) => {
                createAggregator(formValues)
                handleClose()
              }}
            >
              {({ values, handleChange, handleSubmit, handleBlur, handleReset }) => (
                <Form>
                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop='static'
                    keyboard={false}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Add Aggregator</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row className='mt-3'>
                        <Col>
                          <BForm.Label>
                            Aggregator Name<span className='text-danger'> *</span>
                          </BForm.Label>

                          <BForm.Control
                            type='text'
                            name='name'
                            placeholder='Enter Aggregator Name'
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          <ErrorMessage
                            component='div'
                            name='name'
                            className='text-danger'
                          />
                        </Col>
                      </Row>

                      <Row className='mt-3'>
                        <Col sm='2'>
                          <BForm.Label>
                            Status<span className='text-danger'> *</span>
                          </BForm.Label>
                        </Col>
                        <Col sm='2'>
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
                    </Modal.Body>

                    <div className='mt-4 '>
                      <Modal.Footer className='d-flex justify-content-between align-items-center'>
                        <Button
                          className='btn-danger'
                          onClick={() => {
                            handleReset()
                            handleClose()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className='btn-primary'
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </Modal.Footer>
                    </div>
                  </Modal>
                </Form>
              )}
            </Formik>
          </>
    </>
  )
}

export default CreateAggregator
