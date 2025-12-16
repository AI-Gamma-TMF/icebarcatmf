import React from 'react'
import { Form, Button } from '@themesberg/react-bootstrap'
import { ErrorMessage, Formik } from 'formik'
import { editSimpleFormSchema } from '../EditInfo/schema'

import { SimpleEditFormContainer } from '../../style'

const VerifyModal = (props) => {
    const { closeModal, onSubmit,verifiedAccount } = props
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
                                <h6>Verify/Unverify Player</h6>
                            </div>
                            <div className='form-group'>
                                <label
                                    htmlFor='reason'
                                    className={touched.reason && errors.reason ? 'text-danger' : ''}
                                >
                                    Do you want to {verifiedAccount ? 'unverify':'verify'} this player ?
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
        </>
    )
}

export default VerifyModal