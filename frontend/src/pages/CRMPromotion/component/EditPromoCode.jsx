import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";

import { toast } from "../../../components/Toast/index.jsx";
import {
  errorHandler,
  useUpdateCRMPromotionMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { AdminRoutes } from "../../../routes.js";
import {
  getCRMPromoBonusEditHistory,
} from "../../../utils/apiCalls.js";
import { useQuery } from "@tanstack/react-query";
import { editCrmPromoSchema } from "../schemas.js";

const EditCRMPromoBonus = ({ _data }) => {
  const navigate = useNavigate();
  const { crmPromotionId } = useParams();
  const [randomCode, _setRandomCode] = useState("");
  const { data: promotionBonusDetail} = useQuery({
    queryFn: () => {
      return getCRMPromoBonusEditHistory(crmPromotionId);
    },
    select: (res) => res?.data?.details,
    refetchOnWindowFocus: false,
  });

  const { mutate: updateCRMPromotionBonus, isLoading: createLoading } =
    useUpdateCRMPromotionMutation({
      onSuccess: () => {
        toast("Promotion Bonus Updated Successfully", "success");
        navigate(AdminRoutes.CRMPromoBonus);
      },
      onError: (error) => {
        // toast(error.response.data.errors[0].description, "error");
        errorHandler(error);
      },
    });

  const handleEditPromotionBonusSubmit = (formValues) => {
    const body = {
      ...formValues,
      crmPromotionId,
      claimBonus: true,
      promotionType: formValues.promotionType,
      scAmount: formValues.scAmount,
      gcAmount: formValues.gcAmount,
      // isActive: formValues.isActive,
    };
    updateCRMPromotionBonus(body);
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit CRM Promo Bonus </h3>
        </Col>
      </Row>

      {promotionBonusDetail ? (
        <Formik
          initialValues={{
            promocode: randomCode || promotionBonusDetail?.promocode,
            name: promotionBonusDetail?.name,
            promotionType: promotionBonusDetail?.promotionType,
            scAmount: promotionBonusDetail?.scAmount,
            gcAmount: promotionBonusDetail?.gcAmount,
            // isActive: promotionBonusDetail?.isActive,
          }}
          validationSchema={editCrmPromoSchema}
          enableReinitialize
          onSubmit={handleEditPromotionBonusSubmit}
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
                  <BForm.Label>Promocode</BForm.Label>
                  <Row>
                    <Col >
                      <BForm.Control
                        type="text"
                        name="promocode"
                        min="0"
                        value={values.promocode}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled
                      />
                    </Col>

                  </Row>

                </Col>
                <Col>
                  <BForm.Label>Name</BForm.Label>

                  <BForm.Control
                    type="text"
                    name="name"
                    min="0"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
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
                    {
                      <>
                        <option key={"scheduled"} value={"scheduled-campaign"}>
                          Scheduled
                        </option>
                        <option key={"triggered"} value={"triggered-campaign"}>
                          Triggerred
                        </option>
                      </>
                    }
                  </BForm.Select>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col>
                  <BForm.Label>Bonus Sc</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="scAmount"
                    min="0"
                    value={values.scAmount}
                    onChange={handleChange}
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

                {/* <Col >
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
          )}
        </Formik>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditCRMPromoBonus;
