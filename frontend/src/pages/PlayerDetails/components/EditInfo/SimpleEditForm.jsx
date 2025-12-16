import React, { useState } from 'react'
import { Form, Button ,Spinner} from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editSimpleFormSchema } from './schema'

import { SimpleEditFormContainer } from '../../style'

// const showSave = ['removePwLock']

const SimpleEditForm = (props) => {
  const { closeModal, onSubmit, basicInfo, selectedInnerButton, showSaveBtn, title, placeholder,isDelete, createLoading } = props
  const [isFav, setIsFav] = useState(false)
  
  const headDisplay = () => {
    switch (selectedInnerButton?.innerItem) {
      case 'isBan':
        return (
          <div className='simple-text-head'>
            <h6>Player Ban/Unban</h6>
            Are you sure you want to {basicInfo[selectedInnerButton?.innerItem] ? 'UnBan' : 'Ban'} this player ?
          </div>
        )
        case 'is2FaEnabled':
          return (
            <div className='simple-text-head'>
              <h6>Two Factor Authentication disabled</h6>
              Are you sure you want to disable Two Factor Authentication this player ?
            </div>
          )
      case 'isRestrict':
        return (
          <div className='simple-text-head'>
            <h6>Restrict Player</h6>
            Are you sure you want to {basicInfo[selectedInnerButton?.innerItem] ? 'Remove Restriction' : 'Restrict '} this player ?
          </div>
        )
        case 'phoneVerified':
        return (
          <div className='simple-text-head'>
            <h6>Phone Verification</h6>
            Are you sure you want to {basicInfo[selectedInnerButton?.innerItem] ? 'PhoneVerification' : 'Phone Verification '} this player ?
          </div>
        )
      case 'isInternalUser':
        return (
          <div className='simple-text-head'>
            <h6>Mark as Test</h6>
          </div>
        )
        case 'canadianUser':
          return (
            <div className='simple-text-head'>
              <h6>Mark as Canadian User</h6>
            </div>
          )
      case 'forceLogoutChild':
        return (
          <div className='simple-text-head'>
            <h6>Force Logout</h6>
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
          reason: ''
        }}
        validationSchema={editSimpleFormSchema()}
        onSubmit={(formValues) => {
          onSubmit(formValues, isFav)
          // setIsFav(false)
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form>
            {selectedInnerButton ? headDisplay() : <></>}
            <div className='form-group'>
              <label
                htmlFor='reason'
                className={touched.reason && errors.reason ? 'text-danger' : ''}
              >
                {title ? title : 'Reason'}
              </label>
              <Form.Control
                as='textarea'
                name='reason'
                placeholder={placeholder ? placeholder : 'Reason'}
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
            <div className='form-group fab-icon-wrap'
            hidden={isDelete}>
              <label
                htmlFor='reason'
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
            {selectedInnerButton ?
              <div className='edit-btn-wrap'>
                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='me-2'
                  disabled={createLoading}
                > Save
                {createLoading && (
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
              :
              <></>
            }
            {
              showSaveBtn ?
                <div className='edit-btn-wrap'>
                   <Button
                    variant='success'
                    onClick={handleSubmit}
                    className='me-2'
                  >
                    Save
                  </Button>
                </div>
                :
                <></>

            }
          </Form>
        )}
      </Formik>
    </SimpleEditFormContainer>
  )
}

export default SimpleEditForm