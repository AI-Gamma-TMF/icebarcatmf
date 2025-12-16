import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, InputGroup, Row, Form as BForm, Button, Spinner } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { adminProfileSchema } from '../schema'

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
          <div className='text-right m-n1'>
            <button
              type='button' className='m-1 btn btn-warning'
              onClick={() => {
                setEditable(true)
              }}
            >{t('editButton')}
            </button>
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
                          <div className='bg-light py-2 px-3 rounded'>
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
                                        />
                                        {value.endsWith('Password') && (edit && editable) &&
                                          <InputGroup.Text className='b-1'>
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
                      className='ml-2'
                      hidden={!editable}
                      disabled={loading}
                      style={{marginLeft:"18px"}}
                     
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
          <div className='text-left m-n1'>
            <button
              type='button' className='btn btn-warning'
              onClick={adminDetails?.authEnable ? disable2FA : openQRModalToggle}
                            
            >
              {isGetOtpLoading ?
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                : adminDetails?.authEnable ? 'Disable 2FA' : 'Enable 2FA'
              }
            </button>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Overview
