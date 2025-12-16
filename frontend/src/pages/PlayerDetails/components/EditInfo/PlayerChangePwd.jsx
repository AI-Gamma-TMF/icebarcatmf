import React, { useState } from 'react'
import { Form, Button } from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import { faStar,faEye, faEyeSlash  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { passwordSchema } from './schema'
import { SimpleEditFormContainer } from '../../style'

const PlayerChangePwd = (props) => {
  const { closeModal, onSubmit, isLoading } = props
  const [isFav, setIsFav] = useState(false)
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordHidden(!isConfirmPasswordHidden);
  };

 const IconStyle={
  position:"absolute",
  top:"34px",
  right:"15px"
 }

  return (
    <SimpleEditFormContainer>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: ''
        }}
        validationSchema={passwordSchema}
        onSubmit={(formValues) => {
          onSubmit(formValues, isFav)
        }}
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form>
            <div className='simple-text-head'>
              <h6>Change Password</h6>
            </div>
            <div className='form-group my-3 position-relative'>
              <label
                htmlFor='password'
                className={touched.password && errors.password ? 'text-danger' : ''}
              >
                New Password
              </label>
              <Form.Control
               type={isPasswordHidden ? 'password' : 'text'}
                name='password'
                placeholder='New Password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div style={IconStyle}>
                <FontAwesomeIcon
                 icon={isPasswordHidden ? faEyeSlash  : faEye }
                 size='1x'
                 style={{ cursor: 'pointer', marginLeft: '5px' }}
                 onClick={togglePasswordVisibility}
               />
               </div>
              <ErrorMessage
                component='div'
                name='password'
                className='text-danger'
              />
            </div>
            <div className='form-group my-3 position-relative'>
              <label
                htmlFor='changePwd'
                className={touched.confirmPassword && errors.confirmPassword ? 'text-danger' : ''}
              >
                Confirm Password
              </label>
              <Form.Control
                type={isConfirmPasswordHidden ? 'password' : 'text'}
                name='confirmPassword'
                placeholder='Confirm Password'
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div style={IconStyle}>
                <FontAwesomeIcon
                icon={isConfirmPasswordHidden ? faEyeSlash  : faEye }
                size='1x'
                style={{ cursor: 'pointer', marginLeft: '5px' }}
                onClick={toggleConfirmPasswordVisibility}
              />
              </div>
              <ErrorMessage
                component='div'
                name='confirmPassword'
                className='text-danger'
              />
            </div>
            <div className='form-group my-3'>
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
            <div className='form-group fab-icon-wrap my-3'>
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
            <div className='edit-btn-wrap'>
              <Button
                variant='success'
                onClick={handleSubmit}
                className='me-2'
                disabled={isLoading}
              >
                {isLoading ? 'Loading' : 'Submit'}
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

export default PlayerChangePwd