import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Modal,
} from "@themesberg/react-bootstrap";
import { toast } from "../../../../components/Toast";
import { useUpdateUserKYCMutation } from "../../../../reactQuery/hooks/customMutationHook";
import { kycConstants } from "../../constants";

const KYCModal = ({ handleClose, showModal, userId,getUserDetails , userData }) => {
  const { mutate: updateKYC, isLoading: loading } =
  useUpdateUserKYCMutation({
      onSuccess: () => {
        toast("KYC Level updated successfully", "success");
        getUserDetails()
        handleClose();
      },
    });

  const handleUpdate = (data) => {
    updateKYC((data));
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update User KYC Level</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={{
          kycLevel : userData?.kycStatus
        }}
        // validationSchema={userDocsUpload()}
        onSubmit={(formValues) => {
          formValues.userId = parseInt(userId);
          handleUpdate(formValues);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <Form>
            <Modal.Body>
              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    KYC Level
                    <span className='text-danger'> *</span>
                  </BForm.Label>

                  <BForm.Select
                    type='text'
                    name='kycLevel'
                    value={values.kycLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option disabled value=''>
                      ---Select KYC Level---
                    </option>
                    {kycConstants?.map(({ label, value }) => {
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </BForm.Select>

                  <ErrorMessage
                    component='div'
                    name='kycLevel'
                    className='text-danger'
                  />
                </Col>
              </Row>

            </Modal.Body>

            <div className='mt-4'>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => handleClose()} disabled = {loading}>
                  Cancel
                </Button>

                <Button
                  variant='success'
                  disabled = {loading}
                  onClick={handleSubmit}
                  className='ml-2'
                >
                  Update
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
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default KYCModal;
