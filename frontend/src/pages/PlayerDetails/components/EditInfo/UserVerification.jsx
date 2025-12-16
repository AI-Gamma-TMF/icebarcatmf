import React from 'react'
import Select from 'react-select'
import { Button, Spinner} from '@themesberg/react-bootstrap'
import { Form, ErrorMessage, Formik } from 'formik'
import { SimpleEditFormContainer } from '../../style'
import { verificationLevel } from './constant'

const UserVerification = (props) => {
  const { closeModal, onSubmit, isLoading, selectedInnerButton} = props
  const headDisplay = () => {
    switch (selectedInnerButton.innerItem) {
      case 'isUserVerified':
        return (
          <div className='simple-text-head'>
            <h6>User Verification</h6>
          </div>
        )
      default:
        break
    }
  }
  return (
    <SimpleEditFormContainer>
      <Formik
        initialValues={{
          verificationLevel: verificationLevel[0],
        }}
        onSubmit={(formValues, { _resetForm }) => {
          onSubmit(formValues)
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form>
            {headDisplay()}
            <div className='form-group my-3'>
              <label
                htmlFor='verificationLevel'
                className={touched.verificationLevel && errors.verificationLevel ? 'text-danger' : ''}
              >
               Select Verification Level
              </label>
              <Select
                placeholder='Verification Level'
                className='custom-select'
                name='verificationLevel'
                options={verificationLevel}
                value={values.verificationLevel}
                onChange={(selectedOption) => {
                  const event = { target: { name: 'verificationLevel', value: selectedOption } }
                  handleChange(event)
                }}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component='div'
                name='verificationLevel'
                className='text-danger'
              />
            </div>
            <div className='edit-btn-wrap'>
              <Button
                variant='success'
                onClick={handleSubmit}
                className='me-2'
                disabled={isLoading}
              >
                 Update{isLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
              <Button
                variant='warning'
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </SimpleEditFormContainer>
  )
}

export default UserVerification