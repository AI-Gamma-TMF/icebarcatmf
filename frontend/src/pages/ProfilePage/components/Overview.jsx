import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, InputGroup, Row, Form as BForm, Button, Spinner } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { adminProfileSchema } from '../schema'
import '../profile.scss'

const Overview = ({
  details,
  adminDetails,
  setEditable,
  editable,
  updateData,
  constant,
  type,
  setType,
  loading,
  openQRModalToggle,
  isGetOtpLoading,
  disable2FA
}) => {
  const { t } = useTranslation(['profile'])
  return (
    <>
      <Row className='my-n2 pt-3'>
        <Col sm={12} className='my-2'>
          <div className='profile-actions'>
            <Button
              type='button'
              variant='success'
              className='profile-action-btn'
              onClick={() => setEditable(true)}
            >
              {t('editButton')}
            </Button>
          </div>
        </Col>

        {details &&
          <Formik
            enableReinitialize
            initialValues={{
              firstName: details?.firstName || '',
              lastName: details?.lastName || '',
              email: details?.email || '',
              adminUsername: details?.adminUsername || '',
              oldPassword: null,
              newPassword: null,
              confirmNewPassword: null,
              role: details?.AdminRole?.name || '',
              agentName: details?.agentName || '',
              group: details?.group || ''
            }}
            validationSchema={adminProfileSchema(t)}
            onSubmit={(
              formValues
            ) => {
              updateData(formValues)
            }}
          >
            {({ values, handleChange, handleSubmit, handleBlur }) => {
              return (
                <Form className='p-0'>
                  <Row lg={2} md={2} sm={2} className='w-100 m-auto'>
                    {details && constant.map(({ key, value, subValue, edit }, index) => {
                      return (
                        <Col className="mb-3 col-lg-6 col-12" key={index} hidden={(details?.adminRoleId === 1 || details?.roleId === 1) ? key === 'group' : false}>
                          <div className='profile-field'>
                            <label className='fw-bold'>{t(`overviewHeaders.${key}`) || 'N/A'}</label>
                            <span className='mb-0'>
                              {key === 'status'
                                ? (details[value] ? 'Active' : 'In-Active')
                                : subValue
                                  ? <p>{details?.[value]?.[subValue]}</p>
                                  : (
                                    <>
                                      <InputGroup>
                                        <BForm.Control
                                          autoComplete="off"
                                          type={value.endsWith('Password') ? type[`${value}`] : 'text'}
                                          name={value}
                                          disabled={!edit || !editable}
                                          value={values?.[value]}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          className='profile-field__control'
                                        />
                                        {value.endsWith('Password') && (edit && editable) &&
                                          <InputGroup.Text className='profile-field__addon'>
                                            <FontAwesomeIcon
                                              icon={type[`${value}`] === 'password' ? faEyeSlash : faEye}
                                              onClick={() => {
                                                type[`${value}`] === 'password' ? setType((typ) => {
                                                  const temp = { ...typ }
                                                  temp[`${value}`] = 'text'
                                                  return temp
                                                }) : setType((typ) => {
                                                  const temp = { ...typ }
                                                  temp[`${value}`] = 'password'
                                                  return temp
                                                })
                                              }}
                                            />
                                          </InputGroup.Text>}
                                      </InputGroup>

                                      <ErrorMessage
                                        component='div'
                                        name={value}
                                        className='text-danger'
                                      />
                                    </>
                                  )}
                            </span>
                          </div>
                        </Col>
                      )
                    })}
                  </Row>
                  <div className='mt-4 mb-3'>
                    <Button
                      variant='success'
                      onClick={handleSubmit}
                      className='profile-primary-btn'
                      hidden={!editable}
                      disabled={loading}
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
                  </div>
                </Form>
              )
            }}
          </Formik>
        }
        <Col sm={12} className='my-2'>
          <div className='profile-actions profile-actions--left'>
            <Button
              type='button'
              variant={adminDetails?.authEnable ? 'danger' : 'warning'}
              className='profile-action-btn'
              onClick={adminDetails?.authEnable ? disable2FA : openQRModalToggle}
              disabled={isGetOtpLoading}
            >
              {isGetOtpLoading ? (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              ) : adminDetails?.authEnable ? (
                'Disable 2FA'
              ) : (
                'Enable 2FA'
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Overview
