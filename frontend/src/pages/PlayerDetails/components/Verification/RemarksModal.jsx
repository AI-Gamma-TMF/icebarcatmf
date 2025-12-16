import React from 'react'
import { Form, Button, Spinner } from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import { editSimpleFormSchema } from '../EditInfo/schema'

import { SimpleEditFormContainer } from '../../style'

const RemarksModal = (props) => {
    const { closeModal, onSubmit, loading } = props
    return (
        <>
            <SimpleEditFormContainer>
                <Formik
                    initialValues={{
                        reason: ''
                    }}
                    validationSchema={editSimpleFormSchema()}
                    onSubmit={(formValues) => {
                        onSubmit(formValues)
                    }}
                >
                    {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
                        <Form>
                            <div className='simple-text-head'>
                                <h6>Remarks</h6>
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
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className='me-2'
                                >
                                    Save
                                    {loading && (
                                        <Spinner
                                        style={{marginLeft: '4px'}}
                                        as='span'
                                        animation='border'
                                        size='sm'
                                        role='status'
                                        aria-hidden='true'
                                        />
                                    )}
                                </Button>
                                <Button
                                    variant='warning'
                                    onClick={closeModal}
                                    disabled = {loading}
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

export default RemarksModal