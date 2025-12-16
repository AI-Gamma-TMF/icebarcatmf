import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { Row, Col, Form as BForm, Button } from '@themesberg/react-bootstrap'
import { BankModalContainer } from './style'
import { bankFormSchmes } from './schemas'

const BankAddModal = (props) => {
  const {
    closeModal,
    onSubmit
  } = props
  return (
    <BankModalContainer>
      <Formik
        initialValues={{
          holderName: '',
          bankAccNumber: '',
          abaRouting: '',
          nameOfBank: '',
          remark: ''
        }}
        validationSchema={bankFormSchmes}
        onSubmit={(formValues, { _resetForm }) => {
          // const tempValue = { ...formValues }
          // setGlobalSearch(tempValue)
          onSubmit(formValues)
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <Form>
            <Row>
              <Col>
                <div className='bank-modal-head'>
                  <h6>Player Bank Details</h6>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <BForm.Group className='mb-3' controlId='holderName'>
                  <BForm.Label>Account Holder Name</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='holderName'
                    placeholder='Account Holder Name'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.holderName}
                  />
                  <ErrorMessage
                    component='div'
                    name='holderName'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <BForm.Group className='mb-3' controlId='bankAccNumber'>
                  <BForm.Label>Bank Account Number</BForm.Label>
                  <BForm.Control
                    type='text'
                    placeholder='Bank Account Number'
                    name='bankAccNumber'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bankAccNumber}
                  />
                  <ErrorMessage
                    component='div'
                    name='bankAccNumber'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <BForm.Group className='mb-3' controlId='abaRouting'>
                  <BForm.Label>ABA Routing Number(9 digits)</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='abaRouting'
                    placeholder='ABA Routing Number(9 digits)'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.abaRouting}
                  />
                  <ErrorMessage
                    component='div'
                    name='abaRouting'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <BForm.Group className='mb-3' controlId='nameOfBank'>
                  <BForm.Label>Name Of Bank</BForm.Label>
                  <BForm.Control
                    type='text'
                    name='nameOfBank'
                    placeholder='Name Of Bank'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nameOfBank}
                  />
                  <ErrorMessage
                    component='div'
                    name='nameOfBank'
                    className='text-danger'
                  />
                </BForm.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <BForm.Group className='mb-3' controlId='remark'>
                  <BForm.Label>Remark</BForm.Label>
                  <BForm.Control
                    as='textarea'
                    name='remark'
                    placeholder='Remark'
                    value={values.remark}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </BForm.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='buttonDiv-bank'>
                  <Button variant='primary' type='submit' onClick={handleSubmit}>Add</Button>
                  <Button variant='secondary' onClick={closeModal} type='button'>Cancel</Button>
                </div>
              </Col>
            </Row>
          </Form>)}
      </Formik>
    </BankModalContainer>
  )
}

export default BankAddModal;