import {
  Col,
  InputGroup,
  Row,
  Form as BForm,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { siteConfigSchema } from "../schema";

const SiteConfiguration = ({
  details,
  setEditable,
  editable,
  updateData,
  loading,
}) => {
  const { t } = useTranslation(["profile"]);
  const [desktopDimension, setDesktopDimension] = useState(false);
  const [mobileDimension, setMobileDimension] = useState(false);
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    validateFileDimensions(file, "siteLogo");
    setFieldValue("siteLogo", file);
  };
  const handleFileChangeMobileImage = (event, setFieldValue) => {
    const file = event.target.files[0];
    validateMobileFileDimensions(file, "mobileImage");
    setFieldValue("mobileImage", file);
  };

  const validateMobileFileDimensions = (file, field) => {
    if (file && field === "mobileImage") {
      const img = new Image();
      // img.onload = function () {
      //   if (img.width === 50 && img.height === 37) {
      //     setMobileDimension(false)
      //   }
      //   else {
      //     setMobileDimension(true)
      //   }
      // };
      img.src = URL.createObjectURL(file);
    }
  };
  const validateFileDimensions = (file, field) => {
    if (file && field === "siteLogo") {
      const img = new Image();
      // img.onload = function () {
      //   if (img.width === 170 && img.height === 100) {
      //     setDesktopDimension(false)
      //   }
      //   else {
      //     setDesktopDimension(true)
      //   }
      // };
      img.src = URL.createObjectURL(file);
    }
  };
  return (
    <Row className="my-n2 pt-3">
      <Col sm={12} className="my-2">
        <div className="text-right m-n1">
          <button
            type="button"
            className="m-1 btn btn-warning"
            onClick={() => {
              setEditable(true);
            }}
          >
            {t("editButton")}
          </button>
        </div>
      </Col>
      {details && (
        <Formik
          enableReinitialize
          initialValues={{
            siteName:
              details?.siteConfig?.find((obj) => obj.key === "SITE_NAME")
                ?.value || "",
            siteUrl:
              details?.siteConfig?.find((obj) => obj.key === "ORIGIN")?.value ||
              "",
            supportEmailAddress:
              details?.siteConfig?.find(
                (obj) => obj.key === "SUPPORT_EMAIL_ADDRESS"
              )?.value || "",
            minRedeemableCoins:
              details?.siteConfig?.find(
                (obj) => obj.key === "MINIMUM_REDEEMABLE_COINS"
              )?.value || "",
            maxRedeemableCoins:
              details?.siteConfig?.find(
                (obj) => obj.key === "MAXIMUM_REDEEMABLE_COINS"
              )?.value || "",
            scToGcRate:
              details?.siteConfig?.find((obj) => obj.key === "SC_TO_GC_RATE")
                ?.value || "",
            xpScToGcRate:
              details?.siteConfig?.find((obj) => obj.key === "XP_SC_TO_GC_RATE")
                ?.value || "",
            siteLogo:
              details?.siteConfig?.find((obj) => obj.key === "LOGO_URL")
                ?.value || null,
            mobileImage:
              details?.siteConfig?.find(
                (obj) => obj.key === "MOBILE_SITE_LOGO_URL"
              )?.value || null,
            minScSpinLimit:
              details?.siteConfig?.find(
                (obj) => obj.key === "MINIMUM_SC_SPIN_LIMIT"
              )?.value || "",
            minGcSpinLimit:
              details?.siteConfig?.find(
                (obj) => obj.key === "MINIMUM_GC_SPIN_LIMIT"
              )?.value || "",
            gcVaultPercentage:
              details?.siteConfig?.find((obj) => obj.key === "MAX_GC_VAULT_PER")
                ?.value || "",
            scVaultPercentage:
              details?.siteConfig?.find((obj) => obj.key === "MAX_SC_VAULT_PER")
                ?.value || "",
            kycDepositAmount:
              details?.siteConfig?.find(
                (obj) => obj.key === "KYC_DEPOSIT_AMOUNT"
              )?.value || "",
            kycRedeemAmount:
              details?.siteConfig?.find(
                (obj) => obj.key === "KYC_REDEEM_AMOUNT"
              )?.value || "",
            cardPurchaseAmount:
              details?.siteConfig?.find(
                (obj) => obj.key === "CARD_PURCHASE_AMOUNT"
              )?.value || "",
            amoeBonusAmount:
              details?.siteConfig?.find((obj) => obj.key === "AMOE_BONUS_TIME")
                ?.value || "",
            vipMinQuestionnaireBonus:
              details?.siteConfig?.find(
                (obj) => obj.key === "VIP_QUESTIONNAIRE_MIN_BONUS"
              )?.value || "",
            vipMaxQuestionnaireBonus:
              details?.siteConfig?.find(
                (obj) => obj.key === "VIP_QUESTIONNAIRE_MAX_BONUS"
              )?.value || "",
            vipNgrQuestionnaireMultiplier:
              details?.siteConfig?.find(
                (obj) => obj.key === "VIP_QUESTIONNAIRE_NGR_MULTIPLIER"
              )?.value || ""
          }}
          validationSchema={siteConfigSchema(t)}
          onSubmit={(formValues) => {
            updateData({ data: formValues });
          }}
        >
          {({
            errors,
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
          }) => {
            return (
              <Form>
                <Row lg={2} md={2} sm={2}>
                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.minRedeemableCoins.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"minRedeemableCoins"}
                            disabled={!editable}
                            value={values?.minRedeemableCoins}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"minRedeemableCoins"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>
                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.maxRedeemableCoins.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"maxRedeemableCoins"}
                            disabled={!editable}
                            value={values?.maxRedeemableCoins}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"maxRedeemableCoins"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.xpScToGcRate.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"xpScToGcRate"}
                            disabled={!editable}
                            value={values?.xpScToGcRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"xpScToGcRate"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.scToGcRate.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"scToGcRate"}
                            disabled={!editable}
                            value={values?.scToGcRate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"scToGcRate"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.minScSpinLimit.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type="number"
                            autoComplete="off"
                            min={0}
                            name="minScSpinLimit"
                            disabled={!editable}
                            value={values?.minScSpinLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"minScSpinLimit"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.minGcSpinLimit.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type="number"
                            autoComplete="off"
                            min={0}
                            name="minGcSpinLimit"
                            disabled={!editable}
                            value={values?.minGcSpinLimit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"minGcSpinLimit"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.gcVaultPercentage.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type="number"
                            autoComplete="off"
                            min={0}
                            name="gcVaultPercentage"
                            disabled={!editable}
                            value={values?.gcVaultPercentage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"gcVaultPercentage"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.scVaultPercentage.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type="number"
                            autoComplete="off"
                            min={0}
                            name="scVaultPercentage"
                            disabled={!editable}
                            value={values?.scVaultPercentage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"scVaultPercentage"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.kycDepositAmount.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"kycDepositAmount"}
                            disabled={!editable}
                            value={values?.kycDepositAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"kycDepositAmount"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.kycRedeemAmount.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"kycRedeemAmount"}
                            disabled={!editable}
                            value={values?.kycRedeemAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"kycRedeemAmount"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.cardPurchaseAmount.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"cardPurchaseAmount"}
                            disabled={!editable}
                            value={values?.cardPurchaseAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"cardPurchaseAmount"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.amoeBonusAmount.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"amoeBonusAmount"}
                            disabled={!editable}
                            value={values?.amoeBonusAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"amoeBonusAmount"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>


                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">Website Logo</label>
                      <Col>
                        <div className="custom-file-upload-wrap">
                          {!errors?.siteLogo && values?.siteLogo && (
                            <Row className="text-center">
                              <div
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                <img
                                  alt="Website Logo"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    marginLeft: "0",
                                  }}
                                  src={
                                    typeof values.siteLogo === "string"
                                      ? values.siteLogo
                                      : values.siteLogo &&
                                      URL.createObjectURL(values.siteLogo)
                                  }
                                />
                              </div>
                            </Row>
                          )}
                          {editable && (
                            <div className="custom-file-upload-button">
                              <BForm.Control
                                type="file"
                                name="siteLogo"
                                disabled={!editable}
                                accept="image/jpeg, image/png, image/svg+xml, image/webp"
                                onChange={(event) =>
                                  handleFileChange(
                                    event,
                                    setFieldValue,
                                    "siteLogo"
                                  )
                                }
                                onBlur={handleBlur}
                              />
                              <Button>File Upload</Button>
                            </div>
                          )}
                        </div>
                        {desktopDimension ? (
                          <small style={{ color: "red" }}>
                            Image dimensions must be equal to 170*100 pixels.
                          </small>
                        ) : (
                          <>
                            {" "}
                            <ErrorMessage
                              component="div"
                              name="siteLogo"
                              className="text-danger"
                            />
                          </>
                        )}
                      </Col>
                    </div>
                  </Col>
                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">Mobile Site Logo</label>
                      <Col>
                        <div className="custom-file-upload-wrap">
                          {!errors?.mobileImage && values?.mobileImage && (
                            <Row className="text-center">
                              <div
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                <img
                                  alt="Mobile Site Logo"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    marginLeft: "0",
                                  }}
                                  src={
                                    typeof values.mobileImage === "string"
                                      ? values.mobileImage
                                      : values.mobileImage &&
                                      URL.createObjectURL(values.mobileImage)
                                  }
                                />
                              </div>
                            </Row>
                          )}
                          {editable && (
                            <div className="custom-file-upload-button">
                              <BForm.Control
                                type="file"
                                name="mobileImage"
                                disabled={!editable}
                                accept="image/jpeg, image/png, image/svg+xml, image/webp"
                                onChange={(event) =>
                                  handleFileChangeMobileImage(
                                    event,
                                    setFieldValue,
                                    "mobileImage"
                                  )
                                }
                                onBlur={handleBlur}
                              />
                              <Button>File Upload</Button>
                            </div>
                          )}
                        </div>
                      </Col>
                    </div>
                    {mobileDimension ? (
                      <small style={{ color: "red" }}>
                        Image dimensions must be equal to 50*37 pixels.
                      </small>
                    ) : (
                      <>
                        {" "}
                        <ErrorMessage
                          component="div"
                          name="mobileImage"
                          className="text-danger"
                        />
                      </>
                    )}
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.vipMinQuestionnaireBonus.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"vipMinQuestionnaireBonus"}
                            disabled={!editable}
                            value={values?.vipMinQuestionnaireBonus}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"vipMinQuestionnaireBonus"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>
                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.vipMaxQuestionnaireBonus.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"vipMaxQuestionnaireBonus"}
                            disabled={!editable}
                            value={values?.vipMaxQuestionnaireBonus}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"vipMaxQuestionnaireBonus"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                  <Col className="mb-3 col-lg-6 col-6">
                    <div className="mb-3 bg-light py-2 px-3 rounded">
                      <label className="fw-bold">
                        {t("inputFields.vipNgrQuestionnaireMultiplier.label")}
                      </label>
                      <span className="mb-0">
                        <InputGroup>
                          <BForm.Control
                            type={"number"}
                            autoComplete="off"
                            name={"vipNgrQuestionnaireMultiplier"}
                            disabled={!editable}
                            value={values?.vipNgrQuestionnaireMultiplier}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>

                        <ErrorMessage
                          component="div"
                          name={"vipNgrQuestionnaireMultiplier"}
                          className="text-danger"
                        />
                      </span>
                    </div>
                  </Col>

                </Row>
                <div className="mt-0 mb-3">
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    className="ml-2"
                    hidden={!editable}
                    disabled={loading || desktopDimension || mobileDimension}
                  >
                    {t("submitButton")}
                    {loading && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginLeft: "3px" }}
                      />
                    )}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </Row>
  );
};

export default SiteConfiguration;
