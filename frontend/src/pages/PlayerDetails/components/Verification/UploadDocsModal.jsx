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
import { userDocsUpload } from "./schema";
import { docsConstants } from "../../constants";
import { serialize } from "object-to-formdata";
import { toast } from "../../../../components/Toast";
import { useUploadUserDocumetMutation } from "../../../../reactQuery/hooks/customMutationHook";
import { useQueryClient } from "@tanstack/react-query";

const UploadDocsModal = ({ handleClose, showModal, userId }) => {
  const queryClient = useQueryClient();
  const { mutate: createCasinoSubCategory, isLoading: loading } =
    useUploadUserDocumetMutation({
      onSuccess: () => {
        toast("Document Uploaded Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["GET_USER_DOCUMENT"] });
        handleClose();
      },
    });

  const createCasinoMenu = (data) => {
    createCasinoSubCategory(serialize(data));
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload User Documents</Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={{
          reason: "",
          documentType: "",
          document: null,
        }}
        validationSchema={userDocsUpload()}
        onSubmit={(formValues) => {
          formValues.userId = parseInt(userId);
          createCasinoMenu(formValues);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Modal.Body>
              <Row className='mt-3'>
                <Col>
                  <BForm.Label>
                    Document Type
                    <span className='text-danger'> *</span>
                  </BForm.Label>

                  <BForm.Select
                    type='text'
                    name='documentType'
                    value={values.documentType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option disabled value=''>
                      ---Select Document Type---
                    </option>
                    {docsConstants?.map(({ label, value }) => {
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </BForm.Select>

                  <ErrorMessage
                    component='div'
                    name='documentType'
                    className='text-danger'
                  />
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <Row>
                    <Col>
                      <Col>
                        <BForm.Label>
                          Document
                          <span className='text-danger'> *</span>
                        </BForm.Label>
                      </Col>

                      <Col>
                        <BForm.Control
                          type='file'
                          name='document'
                          onChange={(event) => {
                            setFieldValue(
                              "document",
                              event.currentTarget.files[0]
                            );
                          }}
                          onBlur={handleBlur}
                        />

                        <ErrorMessage
                          component='div'
                          name='document'
                          className='text-danger'
                        />
                      </Col>
                    </Col>
                  </Row>
                  {!values?.document?.type.match("pdf") && values?.document && (
                    <Row className='text-center'>
                      <Col>
                        <img
                          alt='not found'
                          className='mt-2'
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                          }}
                          src={
                            values?.document &&
                            URL.createObjectURL(values?.document)
                          }
                        />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>

              <Row className='mt-3'>
                <Col>
                  <BForm.Label>Reason</BForm.Label>

                  <BForm.Control
                    type='text'
                    as='textarea'
                    name='reason'
                    placeholder='Enter Reason'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.reason}
                  />
                </Col>
              </Row>
            </Modal.Body>

            <div className='mt-4'>
              <Modal.Footer className='d-flex justify-content-between align-items-center'>
                <Button variant='warning' onClick={() => handleClose()}>
                  Cancel
                </Button>

                <Button
                  variant='success'
                  onClick={handleSubmit}
                  className='ml-2'
                  style={{width: '8ch'}}
                >
                  {loading ? (
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  ) : 'Submit'}
                </Button>
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UploadDocsModal;
