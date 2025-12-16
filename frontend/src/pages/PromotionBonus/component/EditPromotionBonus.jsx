import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row, Form as BForm, Button, Spinner } from "@themesberg/react-bootstrap";
import {
  convertToUTC,
  getDateTime,
  getDateTimeByYMD,
} from "../../../utils/dateFormatter.js";
import Datetime from "react-datetime";
import { toast } from "../../../components/Toast/index.jsx";
import { errorHandler, useGetRandomPromoCodeMutation, useUpdatePromotionMutation } from "../../../reactQuery/hooks/customMutationHook/index.js";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { getPromotionBonusDetail } from "../../../utils/apiCalls.js";
import { useQuery } from "@tanstack/react-query";
import { editPromotionSchema } from "../schemas.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-regular-svg-icons";

const EditPromotionBonus = ({ _data }) => {
  const navigate = useNavigate();
  const { promocodeId } = useParams();
  const yesterday = new Date();
  const [randomCode,setRandomCode] = useState('')
  const { data: promotionBonusDetail } = useQuery({
    queryFn: () => {
      return getPromotionBonusDetail(promocodeId);
    },
    select: (res) => res?.data?.promoCodeDetails?.promoDetail,
    refetchOnWindowFocus: false,
  });

  const { mutate: updatePromotionBonus, isLoading: createLoading } =
  useUpdatePromotionMutation({
      onSuccess: () => {
        toast("Promotion Bonus Updated Successfully", "success");
        navigate(AdminRoutes.PromotionBonus);
      },
      onError: (error) => {
        toast(error.response.data.errors[0].description, "error");
        errorHandler(error);
      },
    });

  const handleEditPromotionBonusSubmit = (formValues) => {
    const body = {
      ...formValues,
      promocodeId: promotionBonusDetail?.promocodeId,
      promocode: formValues.promocode,
      maxUses: formValues.maxUses,
      affiliateId: formValues.affiliateId,
      bonusSc: formValues.bonusSc,
      bonusGc: formValues.bonusGc,
      validTill: formValues.isValidUntil
        ? convertToUTC(formValues.validTill)
        : null,
    };
    updatePromotionBonus(body);
  };
  const { mutate: getRandomPromocode } =
  useGetRandomPromoCodeMutation({
    onSuccess: (res) => {
      setRandomCode(res?.data?.promoCode)
      toast("PromoCode Generated", "success");
    },
    onError: (error) => {
      toast(error.response.data.errors[0].description, "error");
      errorHandler(error);
    },
  });
  const handleRandomCode = () =>{
    getRandomPromocode()
  }
  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Affiliate Promo Codes </h3>
        </Col>
      </Row>

      {promotionBonusDetail ? (
        <Formik
          initialValues={{
            promocode: randomCode || promotionBonusDetail?.promocode,
            maxUses:
              promotionBonusDetail?.maxUses != ""
                ? promotionBonusDetail?.maxUses
                : null,
            affiliateId: promotionBonusDetail?.affiliateId,
            bonusSc: promotionBonusDetail?.bonusSc,
            bonusGc: promotionBonusDetail?.bonusGc,
            isValidUntil: promotionBonusDetail?.validTill ? true : false,
            validTill: promotionBonusDetail?.validTill
              ? getDateTime(promotionBonusDetail.validTill)
              : new Date(Date.now() + 86400000),
          }}
          validationSchema={editPromotionSchema}
          enableReinitialize
          onSubmit={handleEditPromotionBonusSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <Row>
                <Col>
                  <BForm.Label>Promocode</BForm.Label>
                  <Row>
                    <Col md={10}>
                      <BForm.Control
                        type="text"
                        name="promocode"
                        min="0"
                        value={values.promocode}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={2}>
                      <Trigger
                        message="Generate Random Promo Code."
                        id="promocode"
                      />
                      <Button id="promocode" onClick={handleRandomCode}>
                        {" "}
                        <FontAwesomeIcon icon={faCircleRight} />
                      </Button>
                    </Col>
                  </Row>
                  <ErrorMessage
                    component="div"
                    name="promocode"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>Max Uses</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="maxUses"
                    min="0"
                    value={values.maxUses}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {/* <ErrorMessage
                  component="div"
                  name="maxUses"
                  className="text-danger"
                /> */}
                </Col>
                <Col>
                  <BForm.Label>Affiliate Id</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="affiliateId"
                    min="0"
                    value={values.affiliateId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component="div"
                    name="affiliateId"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <BForm.Label>Bonus Sc</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="bonusSc"
                    min="0"
                    value={values.bonusSc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />

                  <ErrorMessage
                    component="div"
                    name="bonusSc"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>Bonus Gc</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="bonusGc"
                    min="0"
                    value={values.bonusGc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />

                  <ErrorMessage
                    component="div"
                    name="bonusGc"
                    className="text-danger"
                  />
                </Col>
                <Col md={2}>
                  <BForm.Label>Valid Until</BForm.Label>

                  <BForm.Check
                    type="switch"
                    name="isValidUntil"
                    checked={values.isValidUntil}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component="div"
                    name="isValidUntil"
                    className="text-danger"
                  />
                </Col>
                {values.isValidUntil === true && (
                  <Col>
                    <BForm.Label>
                      Valid Till
                      <span className="text-danger"> *</span>
                    </BForm.Label>
                    <Datetime
                      inputProps={{
                        placeholder: "MM-DD-YYYY HH:MM",
                        readOnly: true,
                      }}
                      dateFormat="MM-DD-YYYY"
                      onChange={(e) => {
                        setFieldValue("validTill", e);
                      }}
                      value={
                        values.validTill
                          ? getDateTime(values.validTill)
                          : values.validTill
                      }
                      isValidDate={(e) => {
                        return (
                          e._d > yesterday ||
                          getDateTimeByYMD(e._d) ===
                            getDateTimeByYMD(new Date())
                        );
                      }}
                      timeFormat={true}
                    />
                    {/* <ErrorMessage
                  component="div"
                  name="validTill"
                  className="text-danger"
                /> */}
                  </Col>
                )}
              </Row>

              <div className="mt-4 d-flex justify-content-between align-items-center">
                <Button
                  variant="warning"
                  onClick={() => navigate(AdminRoutes.PromotionBonus)}
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

export default EditPromotionBonus;
