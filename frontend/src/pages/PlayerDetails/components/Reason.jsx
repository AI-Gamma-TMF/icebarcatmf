import { Modal, Form, Button } from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import React from 'react'
import { reasonOptions } from '../constants'
import { reasonSchema } from '../schema'

const Reason = ({
  show,
  handleClose,
  handleYes,
  title,
  enable,
  setEnable
}) => {
  return (
    <>
      <Formik
        initialValues={{
          reason: ''
        }}
        validationSchema={reasonSchema}
        onSubmit={(formValues, { resetForm }) => {
          handleYes(formValues.reason, title === 'Re-Requesting' ? 'request' : '')
          resetForm({ formValues: '' })
          handleClose()
        }}
      >
        {({ values, handleChange, setFieldValue, handleBlur, handleSubmit }) => (
          <Modal
            show={show}
            onHide={() => handleClose()}
            backdrop='static'
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Reason for {title} Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='form-group'>
                <label
                  htmlFor='reason'
                >
                  Reason
                </label>

                <Form.Select
                  name='reason'
                  type='text'
                  placeholder='Enter the reason'
                  value={values.reason}
                  onChange={(e) => {
                    if (e.target.value === 'Add Custom Reason') {
                      setEnable(true)
                      setFieldValue('reason', '')
                    } else {
                      handleChange(e)
                      setEnable(false)
                    }
                  }}
                  onBlur={handleBlur}
                >
                  <option value=''>---Choose Reason---</option>
                  {
                    title === 'Re-Requesting'
                      ? (reasonOptions.map((reason, index) => {
                          return index !== 0 && index !== 1 && <option key={reason} value={reason}>{reason}</option>
                        }))
                      : (reasonOptions.map(reason => {
                          return <option key={reason} value={reason}>{reason}</option>
                        }))
                  }
                </Form.Select>

                {enable &&
                  <Form.Control
                    name='reason'
                    type='text'
                    className='mt-3'
                    placeholder='Enter the reason'
                    value={values.reason}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setFieldValue('reason', '')
                      } else {
                        handleChange(e)
                      }
                    }}
                    onBlur={handleBlur}
                  />}

                <ErrorMessage
                  component='div'
                  name='reason'
                  className='text-danger'
                />
              </div>
            </Modal.Body>
            <div className='mt-4 '>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button
                  variant='warning'
                  onClick={() => handleClose()}
                >
                  Cancel
                </Button>
                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                >
                  Submit
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
        )}

      </Formik>
    </>
  )
}

export default Reason
