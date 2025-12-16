import React from 'react'
import { Form, Button } from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import { editSimpleFormSchema } from '../EditInfo/schema'

import { SimpleEditFormContainer } from '../../style'

const RedeemConfirmationForm = (props) => {
    const { closeModal, onSubmit } = props
    return (
        <>
            <SimpleEditFormContainer>
                <Formik
                    initialValues={{
                        status: 'approved',
                        reason: ''
                    }}
                    validationSchema={editSimpleFormSchema()}
                    onSubmit={(formValues, { _resetForm }) => {
                        onSubmit(formValues)
                    }}
                >
                    {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
                        <Form>
                            <div className='simple-text-head'>
                                <h6>Confirm</h6>
                                Are you sure you want to process this redemption request ?
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='status'
                                    className={touched.reason && errors.reason ? 'text-danger' : ''}
                                >
                                    Status
                                </label>
                                <Form.Select
                                    type='text'
                                    name='status'
                                    //   style={{ minWidth: '120px' }}
                                    value={values.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option key='success' value='approved'> Success</option>
                                    <option key='decline' value='rejected'> Decline</option>
                                </Form.Select>
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

                            <div className='edit-btn-wrap'>
                                <Button
                                    variant='success'
                                    onClick={handleSubmit}
                                    className='me-2'
                                >
                                    Process
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
        </>
    )
}

export default RedeemConfirmationForm