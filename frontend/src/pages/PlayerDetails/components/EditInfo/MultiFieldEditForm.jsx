import React, { useState } from 'react'
import { Form, Button } from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { multiFieldFormSchema } from './schema'
import { SimpleEditFormContainer } from '../../style'
import { allowOnlyNumber } from './constant';

const MultiFieldEditForm = (props) => {
  const { closeModal, onSubmit, selectedInnerButton } = props
  const [isFav, setIsFav] = useState(false)
  const headDisplay = () => {
    switch (selectedInnerButton.innerItem) {
      case 'socialSecurityChild':
        return (
          <div className='simple-text-head'>
            <h6>Edit Social Security</h6>
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
          reason: '',
          ssn: null
        }}
        validationSchema={multiFieldFormSchema()}
        onSubmit={(formValues) => {
          onSubmit(formValues, isFav)
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form>
            {headDisplay()}
            <div className='form-group'>
              <label
                htmlFor='ssn'
                className={touched.reason && errors.reason ? 'text-danger' : ''}
              >
                New Social Security
              </label>
              <Form.Control
                as='input'
                name='ssn'
                min='0'
                type='text'
                placeholder='Social Security Number'
                value={values.ssn}
                onChange={(event) => {
                  setFieldValue('ssn', allowOnlyNumber(event.target.value))
                }}                onBlur={handleBlur}
              />
              <ErrorMessage
                component='div'
                name='ssn'
                className='text-danger'
              />
            </div>
            <div className='form-group'>
              <label
                htmlFor='reason'
                className={touched.reason && errors.reason ? 'text-danger' : ''}
              >
                Reason
              </label>
              <Form.Control
                as='textarea'
                name='reason'
                placeholder='Reason'
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component='div'
                name='reason'
                className='text-danger'
              />
            </div>
            <div className='form-group fab-icon-wrap'>
              <label
                htmlFor='favIcon'
                className={touched.reason && errors.reason ? 'text-danger' : ''}
              >
                Favourite
              </label>
              <div className='fab-icon'>
                <FontAwesomeIcon
                  icon={faStar} size='1x'
                  style={{ color: isFav ? '#ffdd77' : '' }}
                  onClick={() => setIsFav(!isFav)}
                />
              </div>
            </div>
            <div className='edit-btn-wrap'>
              <Button
                variant='success'
                onClick={handleSubmit}
                className='me-2'
              >
                Save
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

export default MultiFieldEditForm