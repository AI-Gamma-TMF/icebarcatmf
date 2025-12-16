import React from 'react';
import { Button, Col, Modal, Row, Form as BForm } from '@themesberg/react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCreateReasonMutation } from '../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../components/Toast';
import { useQueryClient } from '@tanstack/react-query'


const CreateReason = ({ show, setShow, isAccountClose }) => {
  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    reasonTitle: Yup.string()
      .strict(true)
      .max(50, 'Reason title can be a maximum of 50 characters')
      .required('Reason title is required')
      .matches(/^(?!\s*$).+$/, 'Reason title cannot be only empty spaces'),
    reasonDescription: Yup.string()
      .strict(true)
      .max(500, 'Description can be a maximum of 500 characters')
      .required('Description is required')
      .matches(/^(?!\s*$).+$/, 'Description cannot be only empty spaces'),
  });

  const { mutate: createReasonMutation } = useCreateReasonMutation({
    onSuccess: (data) => {
      toast(data.data.message, 'success')
      queryClient.invalidateQueries('reasonsList');
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }

  });

  return (
    <Formik
      initialValues={{
        reasonTitle: "",
        reasonId: undefined,
        reasonDescription: "",
        isAccountClose: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        createReasonMutation({
          ...values,
          isAccountClose: isAccountClose.toString(),
        });
        resetForm();
        setShow(false); // Close the modal after form submission
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, resetForm }) => (
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
            resetForm();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Reason</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Reason Title
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="reasonTitle"
                  placeholder="Enter reason title"
                  value={values.reasonTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="reasonTitle"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Reason Description
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <BForm.Control
                  as="textarea"
                  name="reasonDescription"
                  placeholder="Enter reason description"
                  value={values.reasonDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="reasonDescription"
                  className="text-danger"
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShow(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Formik>
  );
};

export default CreateReason;
