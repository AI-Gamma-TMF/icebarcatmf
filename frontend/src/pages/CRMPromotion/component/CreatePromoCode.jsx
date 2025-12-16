import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";

import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useCreateCRMPromotionMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import { createCRMPromoSchema } from "../schemas.js";


const CreateCRMPromoBonus = ({ _data }) => {
  const navigate = useNavigate();
  const [randomCode, _setRandomCode] = useState("");  
  const { mutate: createPromotionBonus, isLoading: createLoading } =
    useCreateCRMPromotionMutation({
      onSuccess: () => {
        toast("Promotion Bonus Created Successfully", "success");
        navigate(AdminRoutes.CRMPromoBonus);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleCreatePromotionBonusSubmit = (formValues) => {
    const body = {
      ...formValues,
      promocode: formValues.promocode,
      name: formValues.name,
      claimBonus: true,
      promotionType: formValues.promotionType,
      scAmount: formValues.scAmount,
      gcAmount: formValues.gcAmount
      // isActive: formValues.isActive,
    };
    createPromotionBonus(body);
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create CRM Promo Bonus</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          promocode: randomCode,
          name: '',
          claimBonus: true,
          promotionType: 'scheduled-campaign',
          scAmount: '0',
          gcAmount: '0',
          // isActive: false,
        }}
        enableReinitialize
        validationSchema={createCRMPromoSchema}
        onSubmit={handleCreatePromotionBonusSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue // This will allow us to manually set values for Formik fields
        }) => {

          return (
            <Form>
              <Row>
                <Col>
                  <BForm.Label>Promocode
                    <span className="text-danger">*</span>
                  </BForm.Label>
                  <Row>
                    <Col>
                      <BForm.Control
                        type="text"
                        name="promocode"
                        min="0"
                        value={values.promocode}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <ErrorMessage
                    component="div"
                    name="promocode"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>Name
                    <span className="text-danger">*</span>
                  </BForm.Label>
                  <BForm.Control
                    type="text"
                    name="name"
                    min="0"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    component="div"
                    name="name"
                    className="text-danger"
                  />
                </Col>

                <Col>
                  <BForm.Label>
                    Promotion Type
                    <span className="text-danger"> *</span>
                  </BForm.Label>
                  <BForm.Select
                    type="text"
                    name={"promotionType"}
                    value={values.promotionType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option key={"scheduled"} value={"scheduled-campaign"}>
                      Scheduled
                    </option>
                    <option key={"triggered"} value={"triggered-campaign"}>
                      Triggered
                    </option>
                  </BForm.Select>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <BForm.Label>Bonus Sc</BForm.Label>
                  <BForm.Control
                    type="number"
                    name="scAmount"
                    min="0"
                    value={values.scAmount}
                    // onChange={handleChange}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue("scAmount", value);
                      const updatedGc = Math.ceil(value) * 1000;
                      setFieldValue("gcAmount", isNaN(updatedGc) ? 0 : updatedGc);
                    }}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    component="div"
                    name="scAmount"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>Bonus Gc</BForm.Label>
                  <BForm.Control
                    type="number"
                    name="gcAmount"
                    min="0"
                    value={values.gcAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    component="div"
                    name="gcAmount"
                    className="text-danger"
                  />
                </Col>
                {/* <Col className="mt-3">
                  <BForm.Label>Is Active</BForm.Label>
                  <BForm.Check
                    type="switch"
                    name="isActive"
                    checked={values.isActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    component="div"
                    name="claimBonus"
                    className="text-danger"
                  />
                </Col> */}
              </Row>

              <div className="mt-4 d-flex justify-content-between align-items-center">
                <Button
                  variant="warning"
                  onClick={() => navigate(AdminRoutes.CRMPromoBonus)}
                >
                  Cancel
                </Button>

                <Button
                  variant="success"
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="ml-2"
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
          )
        }}
      </Formik>
    </div>
  );
};

export default CreateCRMPromoBonus;
