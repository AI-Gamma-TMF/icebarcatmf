import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row, Form as BForm, Button, Spinner } from "@themesberg/react-bootstrap";
import { toast } from "../../../components/Toast/index.jsx";
import { errorHandler, useCreateDomainBlockMutation } from "../../../reactQuery/hooks/customMutationHook/index.js";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import { createDomainBlockSchema } from "../schemas.js";


const CreateBlockDomain = () => {
  const navigate = useNavigate();

  const { mutate: createDomain, isLoading: createLoading } = useCreateDomainBlockMutation({
    onSuccess: (res) => {      
      toast(res?.data?.message, "success");
      navigate(AdminRoutes.DomainBlock);
    },
    onError: (error) => {
      // toast(error.response.data.errors[0].description, "error");
      errorHandler(error);
    },
  });


  const handleCreateDomainSubmit = (formValues) => {
    const body = {
      domainName: formValues.domainName,
    };
    createDomain(body);
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Block Domain</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          domainName: '',
        }}
        validationSchema={createDomainBlockSchema}
        onSubmit={handleCreateDomainSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
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
                  placeholder="Enter domain name"
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
              {/* <Col>
                <BForm.Label>Discount on Amount</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isDiscountOnAmount"
                  checked={values.isDiscountOnAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col>
                <BForm.Label>
                  {values.isDiscountOnAmount ? "Discount Percentage On Amount" : "Bonus Coins percentage"}
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="discountPercentage"
                    placeholder="Enter Percentage"
                    min="0"
                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    max="100"
                    value={values.discountPercentage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="discountPercentage"
                  className="text-danger"
                />
              </Col> */}
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
                disabled={createLoading}
              >
                Submit
                {createLoading && (
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

export default CreateBlockDomain;
