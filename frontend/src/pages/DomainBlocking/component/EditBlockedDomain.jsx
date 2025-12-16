import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row, Form as BForm, Button, Spinner } from "@themesberg/react-bootstrap";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate, useParams } from "react-router-dom";
import { editDomainBlockSchema } from "../schemas.js";
import useEditBlockedDomain from "../hooks/useEditBlockedDomain.js";

const EditBlockedDomain = () => {
  const navigate = useNavigate();
  const { domainId } = useParams();
  const { domainNameDetail, handleEditDomainNameSubmit, isInitialValues, updateLoading } = useEditBlockedDomain(domainId);
  

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Blocked Domain</h3>
        </Col>
      </Row>

      <Formik
        enableReinitialize={isInitialValues}
        initialValues={{
          domainName: domainNameDetail?.domainName || '',
          domainId: domainNameDetail?.domainId || '',
        }}
        validationSchema={editDomainBlockSchema}
        onSubmit={handleEditDomainNameSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur
        }) => (
          <Form>
            <Row>
              <Col>
                <BForm.Label>Domain Name
                  <span className="text-danger"> *</span>
                </BForm.Label>
               
                <BForm.Control
                  type="text"
                  name="domainName"
                  placeholder="Enter Domain Name"
                  value={values.domainName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ErrorMessage
                  component="div"
                  name="domainName"
                  className="text-danger"
                />
              </Col>
            </Row>

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button
                variant="warning"
                onClick={() => navigate(AdminRoutes.DomainBlock)}
              >
                Cancel
              </Button>

              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={updateLoading}
              >
                Submit
                {updateLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditBlockedDomain;
