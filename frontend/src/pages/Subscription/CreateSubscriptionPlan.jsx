import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "@themesberg/react-bootstrap";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import SubscriptionPlanForm from "./SubscriptionPlanForm";
import { AdminRoutes } from "../../routes";
import subscriptionSchema from "./schema";
import useCreateSubscriptionPlan from "./hooks/useCreateSubscriptionPlan";
import { toast } from "../../components/Toast";
import { InlineLoader } from "../../components/Preloader";
import { rangeValidations } from "./constants";

const CreateSubscriptionPlan = ({ subscriptionData, type, refetchSubscription, loading }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageDimensionError, setImageDimensionError] = useState(null);
  const [imageTypeError, setImageTypeError] = useState(false);

  const [formData, setFormData] = useState({
    name: subscriptionData ? subscriptionData?.name : "",
    description: subscriptionData ? subscriptionData?.description : "",
    monthlyAmount: subscriptionData ? subscriptionData?.monthlyAmount : "",
    yearlyAmount: subscriptionData ? subscriptionData?.yearlyAmount : "",
    weeklyPurchaseCount: subscriptionData ? subscriptionData.weeklyPurchaseCount : "",
    scCoin: subscriptionData ? subscriptionData?.scCoin : "",
    gcCoin: subscriptionData ? subscriptionData?.gcCoin : "",
    platform: subscriptionData ? subscriptionData?.platform : "all",
    isActive: !!subscriptionData?.isActive,
    specialPlan: !!subscriptionData?.specialPlan,
    thumbnail: subscriptionData ? subscriptionData?.thumbnail : "",
    features: subscriptionData ? subscriptionData?.features || [] : [],
  });

  useEffect(() => {
    if (subscriptionData) {
      const formattedFeatures = (subscriptionData?.features || []).map((item) => ({
        label: item.featureDetail?.name || "",
        value: item.featureDetail?.subscriptionFeatureId,
        key: item.featureDetail?.key || "",
        valueType: item.featureDetail?.valueType,
        defaultValue: item.featureValue?.toString() || "",
      }));

      const formattedData = {
        name: subscriptionData.name || "",
        description: subscriptionData.description || "",
        monthlyAmount: subscriptionData.monthlyAmount || "",
        yearlyAmount: subscriptionData.yearlyAmount || "",
        weeklyPurchaseCount: subscriptionData.weeklyPurchaseCount || "",
        scCoin: subscriptionData.scCoin || "",
        gcCoin: subscriptionData.gcCoin || "",
        platform: subscriptionData.platform || "all",
        isActive: !!subscriptionData.isActive,
        specialPlan: !!subscriptionData.specialPlan,
        thumbnail: subscriptionData.thumbnail || "",
        features: formattedFeatures,
      };

      setFormData(formattedData);
    }
  }, [subscriptionData]);

  const { createSubscriptionMutation, createLoading, updateSubscriptionMutation, updateLoading } = useCreateSubscriptionPlan();

  // Thumbnail Image
  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setImageTypeError(true); // this will show error
      setFieldValue(field, ''); // clear the form field
      setImage(null); // clear preview image if any
      return;
    }

    setImageTypeError(false); // clear error
    setImage(file);
    setFieldValue(field, file);

    validateFileDimensions(file, field);

    setFieldValue(field, file);
  };

  const validateFileDimensions = (file, field) => {
    if (file) {
      const img = new Image();
      img.onload = function () {
        if (img.width === 64 && img.height === 64) {
          setImageDimensionError(false);
          setImage(null);
        } else {
          setImageDimensionError(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleFormSubmit = async (values, isEdit = false, changedValues = {}) => {
    const formData = new FormData();

    const dataToUse = isEdit ? changedValues : values;

    // Always required fields
    if (dataToUse.name) formData.append("name", dataToUse.name);
    if (dataToUse.description) formData.append("description", dataToUse.description);
    if (dataToUse.monthlyAmount !== undefined) formData.append("monthlyAmount", dataToUse.monthlyAmount);
    if (dataToUse.yearlyAmount !== undefined) formData.append("yearlyAmount", dataToUse.yearlyAmount);

    if ('weeklyPurchaseCount' in dataToUse) {
      const value = dataToUse.weeklyPurchaseCount === "" ? 0 : dataToUse.weeklyPurchaseCount;
      formData.append("weeklyPurchaseCount", value);
    }

    if ('scCoin' in dataToUse) {
      const value = dataToUse.scCoin === "" ? 0 : dataToUse.scCoin;
      formData.append("scCoin", value);
    }

    if ('gcCoin' in dataToUse) {
      const value = dataToUse.gcCoin === "" ? 0 : dataToUse.gcCoin;
      formData.append("gcCoin", value);
    }

    if (dataToUse.platform) formData.append("platform", dataToUse.platform);
    if ("isActive" in dataToUse) formData.append("isActive", dataToUse.isActive);
    if ("specialPlan" in dataToUse) formData.append("specialPlan", dataToUse.specialPlan);

    if (dataToUse?.thumbnail instanceof File) {
      formData.append("thumbnail", dataToUse?.thumbnail);
    }


    if (dataToUse?.features) {
      for (const feature of dataToUse.features) {
        const { key, defaultValue } = feature;
        const range = rangeValidations[key];
        const valueNum = Number(defaultValue);

        if (range) {
          if (isNaN(valueNum) || valueNum < range.min || valueNum > range.max) {
            toast(`Invalid value for ${key}: must be between ${range.min} and ${range.max}`, 'error');
            return;
          }
        }
      }

      let featuresPayload = {};
      dataToUse.features.forEach((feature) => {
        if (feature.key) {
          let value = feature.defaultValue;

          if (feature.valueType === "float") {
            value = parseFloat(value);
          } else if (feature.valueType === "integer") {
            value = parseInt(value, 10);
          } else if (feature.valueType === "boolean") {
            value = true;
          }

          featuresPayload[feature.key] = value;
        }
      });

      formData.append("features", JSON.stringify(featuresPayload));
    }

    if (isEdit && subscriptionData?.subscriptionId) {
      formData.append("subscriptionId", subscriptionData.subscriptionId);
      updateSubscriptionMutation(formData);
    } else {
      createSubscriptionMutation(formData);
    }
  };


  return (
    <>
      <Row>
        <Col>
          <h3>
            {type === "EDIT"
              ? "Edit Subscription Plan"
              : type === "view"
                ? "View Subscription Plan"
                : "Create Subscription Plan"}
          </h3>
        </Col>
      </Row>
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        onSubmit={(formValues) => {
          if (type === "EDIT") {
            const changedData = {};
            Object.entries(formValues).forEach(([key, value]) => {
              if (JSON.stringify(subscriptionData?.[key]) !== JSON.stringify(value)) {
                changedData[key] = value;
              }
            });

            if (Object.keys(changedData).length) {
              handleFormSubmit(formValues, true, changedData);
            } else {
              toast("No changes available to update.", { type: "error" });
            }
          } else {
            handleFormSubmit(formValues);
          }
        }}

        validationSchema={subscriptionSchema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
          errors,
          dirty
        }) => (
          <>
            <SubscriptionPlanForm
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
              setFieldValue={setFieldValue}
              errors={errors}
              type={type}
              handleFileChange={handleFileChange}
              imageDimensionError={imageDimensionError}
              imageTypeError={imageTypeError}
            />

            <Row className="mt-4 justify-content-end">
              <Col xs="auto">
                <Button variant="secondary" onClick={() => navigate(AdminRoutes.SubscriptionPlan)}>
                  Cancel
                </Button>
              </Col>
              {type !== "view" && (
                <Col xs="auto">
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={(!dirty && type === "EDIT") || createLoading || updateLoading}
                  >
                    {(createLoading || updateLoading) ? (
                      <>
                        <InlineLoader />
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>

                </Col>
              )}
            </Row>
          </>
        )}
      </Formik>
    </>
  );
};

export default CreateSubscriptionPlan;
