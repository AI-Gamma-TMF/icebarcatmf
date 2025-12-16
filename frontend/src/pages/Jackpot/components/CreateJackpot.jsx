import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row, Form as BForm, Button, Spinner } from "@themesberg/react-bootstrap";
import { toast } from "../../../components/Toast/index.jsx";
import { errorHandler, useCreateJackpotMutation } from "../../../reactQuery/hooks/customMutationHook/index.js";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import { creatJackpotSchema } from "../schema.js";


const CreateJackpot = () => {
  const navigate = useNavigate();

  const { mutate: createJackpot, isLoading: createLoading } = useCreateJackpotMutation({
    onSuccess: () => {
      toast("Jackpot Created Successfully", "success");
      navigate(AdminRoutes.Jackpot);
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const handleCreateJackpotSubmit = (formValues) => {
    const body = {
      jackpotName: formValues.jackpotName,
      maxTicketSize: formValues.maxTicketSize,
      seedAmount: formValues.seedAmount,
      entryAmount: formValues.entryAmount,
      adminShare: formValues.adminShare,
      poolShare: formValues.poolShare,
    };
    createJackpot(body);
  };


  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create Jackpot</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          jackpotName: "",
          maxTicketSize: 0,
          seedAmount: 0,
          entryAmount: 0,
          adminShare: 0,
          poolShare: 0,
        }}
        validationSchema={creatJackpotSchema}
        onSubmit={handleCreateJackpotSubmit}
      >
        {({ values, handleChange, handleSubmit, handleBlur }) => (
          <Form>
            <Row className="mt-3">
              <Col>
                <BForm.Label>Jackpot Name <span className="text-danger">*</span></BForm.Label>
                <BForm.Control
                  type="text"
                  name="jackpotName"
                  placeholder="Enter Jackpot Name"
                  value={values.jackpotName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="jackpotName" component="div" className="text-danger" />
              </Col>
              <Col>
                <BForm.Label>Max Ticket Size <span className="text-danger">*</span></BForm.Label>
                <BForm.Control
                  type="number"
                  name="maxTicketSize"
                  placeholder="Enter Max Ticket Size"
                  value={values.maxTicketSize}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                />
                <ErrorMessage name="maxTicketSize" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <BForm.Label>Seed Amount <span className="text-danger">*</span></BForm.Label>
                <BForm.Control
                  type="number"
                  name="seedAmount"
                  placeholder="Enter Seed Amount"
                  value={values.seedAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                />
                <ErrorMessage name="seedAmount" component="div" className="text-danger" />
              </Col>
              <Col>
                <BForm.Label>Entry Amount <span className="text-danger">*</span></BForm.Label>
                <BForm.Control
                  type="number"
                  name="entryAmount"
                  placeholder="Enter Entry Amount"
                  value={values.entryAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                />
                <ErrorMessage name="entryAmount" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <BForm.Label>Admin Share (%) <span className="text-danger">*</span></BForm.Label>
                <BForm.Control
                  type="number"
                  name="adminShare"
                  placeholder="Enter Admin Share in %"
                  value={values.adminShare}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                  max="100"
                />
                <ErrorMessage name="adminShare" component="div" className="text-danger" />
              </Col>
              <Col>
                <BForm.Label>Pool Share (%) <span className="text-danger">*</span></BForm.Label>
                <BForm.Control
                  type="number"
                  name="poolShare"
                  placeholder="Enter Pool Share in %"
                  value={values.poolShare}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                  max="100"
                />
                <ErrorMessage name="poolShare" component="div" className="text-danger" />
              </Col>
            </Row>


            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button variant="warning" onClick={() => navigate(AdminRoutes.Jackpot)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleSubmit} disabled={createLoading}>
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

export default CreateJackpot;
