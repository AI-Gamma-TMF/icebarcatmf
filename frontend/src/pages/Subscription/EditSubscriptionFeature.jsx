import {
  Col,
  Form as BForm,
  Row,
  Modal,
  Button,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { SimpleEditFormContainer } from "../PlayerDetails/style";
import { capitalizeFirstLetter } from "../../utils/helper";
import useSubscriptionFeature from "./hooks/useSubscriptionFeature";
import { InlineLoader } from "../../components/Preloader";
import { subscriptionFeatureSchema } from "./schema";

const SubscriptionFeatureModal = ({
  show,
  setShow,
  mode,
  subscriptionFeatureId,
  setSubscriptionFeatureId,
}) => {
  const {
    subscriptionFeatureData,
    isLoading,
    updateFeature,
    updateFeatureLoading,
  } = useSubscriptionFeature(subscriptionFeatureId);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setSubscriptionFeatureId("");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{capitalizeFirstLetter(mode)} Feature</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SimpleEditFormContainer>
          {isLoading ? (
            <InlineLoader />
          ) : (
            <Row>
              <Formik
                enableReinitialize
                initialValues={{
                  subscriptionFeatureId:
                    subscriptionFeatureData?.length > 0
                      ? subscriptionFeatureData?.[0]?.subscriptionFeatureId
                      : "",
                  name:
                    subscriptionFeatureData?.length > 0
                      ? subscriptionFeatureData?.[0]?.name
                      : "",
                  description:
                    subscriptionFeatureData?.length > 0
                      ? subscriptionFeatureData?.[0]?.description
                      : "",
                  isActive:
                    subscriptionFeatureData?.length > 0
                      ? subscriptionFeatureData?.[0]?.isActive
                      : false,
                }}
                validationSchema={subscriptionFeatureSchema}
                onSubmit={(formValues) => {
                  updateFeature(formValues);
                  setShow(false);
                  setSubscriptionFeatureId("");
                }}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  setFieldValue,
                  errors,
                }) => (
                  <Form>
                    <Row className="mt-3">
                      <Col>
                        <BForm.Label>Feature Name</BForm.Label>
                        <span className="text-danger"> *</span>
                        <BForm.Control
                          type="text"
                          name="name"
                          placeholder="Enter the Feature name"
                          value={values?.name}
                          onChange={handleChange}
                          disabled={mode === "view"}
                        />
                        <ErrorMessage
                          component="div"
                          name="name"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <BForm.Label>Feature Description</BForm.Label>
                        <span className="text-danger"> *</span>
                        <BForm.Control
                          type="text"
                          name="description"
                          placeholder="Enter Feature Description"
                          value={values?.description}
                          onChange={handleChange}
                          disabled={mode === "view"}
                        />
                        <ErrorMessage
                          component="div"
                          name="description"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <div
                          className="d-flex align-items-center  rounded p-2 justify-content-between"
                          style={{ border: "0.0625rem solid #d1d7e0" }}
                        >
                          <p className="mb-0">Is Active</p>
                          <BForm.Check
                            name="isActive"
                            className="ml-2"
                            checked={values.isActive}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={mode === "view"}
                          />
                        </div>

                        <ErrorMessage
                          component="div"
                          name="isActive"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                    <Modal.Footer hidden={mode === "view"}>
                      <Button variant="secondary" onClick={handleSubmit}>
                        Save
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShow(false);
                          setSubscriptionFeatureId("");
                        }}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Row>
          )}
        </SimpleEditFormContainer>
      </Modal.Body>
    </Modal>
  );
};

export default SubscriptionFeatureModal;
