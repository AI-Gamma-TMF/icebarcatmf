import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Col, Row, Button, Spinner, Form as BForm, Modal } from '@themesberg/react-bootstrap';
import { useAddFreeEntryOfPlayerMutation } from '../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../components/Toast';

const AddFreeEntry = ({ tournamentData, refetchTournament }) => {
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const playerFreeEntry = useAddFreeEntryOfPlayerMutation({
        onSuccess: (res) => {
            if (res?.data) {
                toast(res?.data?.message, 'success');
                refetchTournament()
            }
            setModalShow(false)
            setLoading(false);
        },
        onError: (error) => {
            if (error?.response?.data?.errors.length > 0) {
                const { errors } = error.response.data;
                errors.map((error) => {
                    if (error?.description) toast(error?.description, 'error');
                });
            }
            setModalShow(false)
            setLoading(false);
        }
    });

    const initialValues = {
        email: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is Required'),
    });

    const handleSubmit = (values) => {
        const payload = {
            email: values?.email,
            tournamentId: tournamentData?.tournamentId
        };
        setLoading(true);
        playerFreeEntry.mutate(payload);
    };

    return (
        <>
            <Button className="btn btn-primary" onClick={() => setModalShow(true)}>
                Add Player
            </Button>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Player Free Entry</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched }) => (
                            <Form>
                                <Row>
                                    <Col md={12} sm={12}>
                                        <BForm.Label htmlFor="email">
                                            Enter Email
                                            <span className="text-danger"> *</span>
                                        </BForm.Label>
                                        <Field
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            values={values?.email}
                                            as={BForm.Control}
                                            isInvalid={touched.email && !!errors.email}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-danger"
                                        />
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col md={12} sm={12}>
                                        <Button className="btn btn-success" type="submit" disabled={loading}>
                                            {loading ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                'Submit'
                                            )}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddFreeEntry;
