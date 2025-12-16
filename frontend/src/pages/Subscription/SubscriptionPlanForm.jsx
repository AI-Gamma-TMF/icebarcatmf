import React, { useRef, useState } from "react";
import { Col, Row, Form as BForm, Button, Table, InputGroup } from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { platformNames, rangeValidations } from "./constants";
import useSubscriptionFeature from "./hooks/useSubscriptionFeature";

const SubscriptionPlanForm = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  errors,
  type,
  handleFileChange,
  imageDimensionError,
  imageTypeError
}) => {

  const [editingFeatureKey, setEditingFeatureKey] = useState(null);

  const fileInputRef = useRef();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureValue, setFeatureValue] = useState("");
  const [featureError, setFeatureError] = useState("");

  const handleCancelImage = (setFieldValue) => {
    setFieldValue("thumbnail", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const { subscriptionFeatureData, isLoading } = useSubscriptionFeature();

  const selectData = subscriptionFeatureData
    ?.filter((feature) => feature?.isActive)
    ?.map((feature) => ({
      label: feature.name,
      value: feature.subscriptionFeatureId,
      key: feature.key,
      valueType: feature.valueType,
    }));

  const handleDecimalInput = (e, setFieldValue, field) => {
    let value = e.target.value;

    // Allow only numbers with up to 2 decimals
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFieldValue(field, value);
    }
  };

  return (
    <>
      <Row>
        <Col xs={3} className="mb-3">
          <BForm.Label>Subscription Plan Name</BForm.Label>
          <span className="text-danger"> *</span>
          <BForm.Control
            type="text"
            name="name"
            placeholder="Enter Subscription Plan Name"
            value={values?.name}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
              setFieldValue("name", newValue);
            }}
            onBlur={handleBlur}
            disabled={type === "view"}
          />
          <ErrorMessage component="div" name="name" className="text-danger" />
        </Col>

        <Col xs={3} className="mb-3">
          <BForm.Label>Subscription Plan Description</BForm.Label>
          <span className="text-danger"> *</span>
          <BForm.Control
            type="text"
            name="description"
            placeholder="Enter Subscription Plan Description"
            value={values?.description}
            onChange={(e) => {
              const newValue = e.target.value;

              if (/^\.+$/.test(newValue)) {
                setFieldValue("description", "");
                return;
              }

              const validValue = newValue.replace(/[^a-zA-Z0-9. ]/g, "");
              setFieldValue("description", validValue);
            }} onBlur={handleBlur}
            disabled={type === "view"}
          />
          <ErrorMessage
            component="div"
            name="description"
            className="text-danger"
          />
        </Col>

        <Col xs={3} className="mb-3">
          <BForm.Label>Platform</BForm.Label>
          <BForm.Select
            name="platform"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.platform}
            disabled={type === "view"}
          >
            {platformNames.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.labelKey}
              </option>
            ))}
          </BForm.Select>
        </Col>
        <Col xs={3} className="mb-3">
          <BForm.Label>Weekly Purchase Count</BForm.Label>
          <BForm.Control
            type="text"
            name="weeklyPurchaseCount"
            placeholder="Enter Weekly Purchase Count"
            value={values?.weeklyPurchaseCount}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            disabled={type === "view"}
          />
          <ErrorMessage
            component="div"
            name="weeklyPurchaseCount"
            className="text-danger"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={3} className="mb-3">
          <BForm.Label>Monthly Amount</BForm.Label>
          <span className="text-danger"> *</span>
          <BForm.Control
            type="text"
            name="monthlyAmount"
            placeholder="Enter Monthly Amount"
            value={values?.monthlyAmount}
            onChange={(e) => handleDecimalInput(e, setFieldValue, "monthlyAmount")}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            disabled={type === "view"}
          />
          <ErrorMessage
            component="div"
            name="monthlyAmount"
            className="text-danger"
          />
        </Col>

        <Col xs={3} className="mb-3">
          <BForm.Label>Yearly Amount</BForm.Label>
          <span className="text-danger"> *</span>
          <BForm.Control
            type="text"
            name="yearlyAmount"
            placeholder="Enter Yearly Amount"
            value={values?.yearlyAmount}
            onChange={(e) => handleDecimalInput(e, setFieldValue, "yearlyAmount")}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            disabled={type === "view"}
          />
          <ErrorMessage
            component="div"
            name="yearlyAmount"
            className="text-danger"
          />
        </Col>
        <Col xs={3} className="mb-3">
          <BForm.Label>Bonus SC</BForm.Label>
          <BForm.Control
            type="number"
            name="scCoin"
            placeholder="Enter SC Coin"
            value={values?.scCoin}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            disabled={type === "view"}
          />
          <ErrorMessage component="div" name="scCoin" className="text-danger" />
        </Col>

        <Col xs={3} className="mb-3">
          <BForm.Label>Bonus GC</BForm.Label>
          <BForm.Control
            type="number"
            name="gcCoin"
            placeholder="Enter GC Coin"
            value={values?.gcCoin}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            }}
            onKeyDown={(e) => {
              if (e.key === "." || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            disabled={type === "view"}
          />
          <ErrorMessage component="div" name="gcCoin" className="text-danger" />
        </Col>

      </Row>

      <Row className="mb-3">
        {/* Left Column: Toggles */}
        <Col xs={6} className="mt-4">
          {[
            { label: "Is Active", name: "isActive", value: values.isActive },
            { label: "Special Plan", name: "specialPlan", value: values.specialPlan },
          ].map(({ label, name, value }) => (
            <div key={name} className="mb-3">
              <div
                className="d-flex align-items-center rounded p-2 justify-content-between"
                style={{ border: "0.0625rem solid #d1d7e0" }}
              >
                <p className="mb-0">{label}</p>
                <BForm.Check
                  name={name}
                  className="ml-2"
                  checked={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={type === "view"}
                />
              </div>
              <ErrorMessage
                component="div"
                name={name}
                className="text-danger"
              />
            </div>
          ))}
        </Col>

        <Col xs={6}>
          <div
            className="border rounded p-3 d-flex flex-column justify-content-between"
            style={{ height: "225px", width: "385px", position: "relative" }}
          >
            <BForm.Label className="mb-2">
              Thumbnail <span className="text-danger"> *</span>
            </BForm.Label>


            {/* Hidden File Input */}
            <BForm.Control
              ref={fileInputRef}
              type="file"
              name="thumbnail"
              accept="image/jpg, image/jpeg, image/png, image/webp"
              onChange={(event) =>
                handleFileChange(event, setFieldValue, "thumbnail")
              }
              style={{ display: "none" }}
            />

            {/* Upload Preview */}
            {values?.thumbnail ? (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                  height: "150px",
                }}
              >
                <img
                  src={
                    typeof values.thumbnail === "string"
                      ? values.thumbnail
                      : URL.createObjectURL(values.thumbnail)
                  }
                  alt="Thumbnail Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                  }}
                />
                {type !== "view" && (
                  <Button
                    variant="link"
                    onClick={() => handleCancelImage(setFieldValue)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      padding: "2px 6px",
                      background: "#fff",
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                      fontSize: "0.8rem",
                      lineHeight: "1",
                      color: "#dc3545",
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
              </div>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ flexGrow: 1 }}
              >
                <Button
                  variant="dark"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-7 w-100"
                >
                  <FontAwesomeIcon icon="upload" className="me-2" />
                  Upload Image
                </Button>
              </div>
            )}

            {imageTypeError ? (
              <small className="text-danger mt-2">
                Only JPG, JPEG, PNG, or WEBP image files are allowed.
              </small>
            ) : imageDimensionError ? (
              <small className="text-danger mt-2">
                Image dimensions must be equal to 64*64 pixels.
              </small>
            ) : (
              <ErrorMessage
                component="div"
                name="thumbnail"
                className="text-danger mt-2"
              />
            )}

          </div>
        </Col>

      </Row>

      <Row className="align-items-end mb-3">
        <Col xs={6}>
          {type !== "view" && (
            <>
              <BForm.Label>Features</BForm.Label>
              <span style={{ color: "red" }}>*</span>
              <Select
                name="featureSelect"
                options={selectData
                  ?.filter((opt) =>
                    ["integer", "float", "boolean"].includes(opt.valueType)
                  )
                  ?.filter((opt) =>
                    !(values?.features || []).some((f) => f.key === opt.key)
                  )
                }
                value={selectedFeature}
                onChange={(selected) => {
                  const isBoolean = selected?.valueType === "boolean";

                  if (isBoolean) {
                    const newFeature = {
                      ...selected,
                      defaultValue: true,
                    };
                    setFieldValue("features", [
                      ...(values.features || []),
                      newFeature,
                    ]);
                    setSelectedFeature(null);
                    setFeatureValue("");
                    setFeatureError("");
                  } else {
                    setSelectedFeature(selected);
                    setFeatureValue("");
                    setFeatureError("");
                  }
                }}
              />
              <ErrorMessage
                component="div"
                name="features"
                className="text-danger"
              />
            </>
          )}
        </Col>

        {selectedFeature && selectedFeature.valueType !== "boolean" && (
          <>
            <Col xs={4}>
              <BForm.Label>
                {selectedFeature?.label === "Guaranteed Redemption Approved Time for Subscribers"
                  ? `Value for Guaranteed Redemption Approved Time (in hrs) for Subscribers`
                  : `Value for ${selectedFeature?.label} ${(selectedFeature?.label === "Exclusive Package Discount" ||
                    selectedFeature?.label === "Tournament Joining Fee Discount")
                    ? "(in %)"
                    : ""
                  }`
                }
              </BForm.Label>
              <BForm.Control
                type="text"
                value={featureValue}
                onChange={(e) => {
                  const value = e.target.value;

                  if (selectedFeature?.valueType === "integer") {
                    if (/^\d*$/.test(value)) {
                      setFeatureValue(value);
                    }
                  } else if (selectedFeature?.valueType === "float") {
                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                      setFeatureValue(value);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }

                  if (selectedFeature?.valueType === "integer" && e.key === ".") {
                    e.preventDefault();
                  }
                }}
                inputMode={selectedFeature?.valueType === "integer" ? "numeric" : "decimal"}
              />
              {featureError && (
                <div className="text-danger">{featureError}</div>
              )}
            </Col>

            <Col xs="auto">
              <Button
                className="mt-4"
                onClick={() => {
                  const val = Number(featureValue);
                  const range = rangeValidations[selectedFeature.key];

                  if (
                    !val ||
                    isNaN(val) ||
                    (range && (val < range.min || val > range.max))
                  ) {
                    return setFeatureError(
                      `Value must be between ${range.min} and ${range.max}`
                    );
                  }

                  const newFeature = {
                    ...selectedFeature,
                    defaultValue: val,
                  };

                  let updatedFeatures = [...(values.features || [])];

                  if (editingFeatureKey) {
                    // UPDATE existing feature
                    const indexToUpdate = updatedFeatures.findIndex(
                      (f) => f.key === editingFeatureKey
                    );
                    if (indexToUpdate !== -1) {
                      updatedFeatures[indexToUpdate] = newFeature;
                    }
                  } else {
                    // ADD new feature
                    const alreadyExists = updatedFeatures.some(
                      (f) => f.key === selectedFeature.key
                    );
                    if (alreadyExists) {
                      return setFeatureError("This feature is already added.");
                    }
                    updatedFeatures.push(newFeature);
                  }

                  setFieldValue("features", updatedFeatures);
                  setSelectedFeature(null);
                  setFeatureValue("");
                  setFeatureError("");
                  setEditingFeatureKey(null);
                }}
              >
                {editingFeatureKey ? "Update Feature" : "Add Feature"}
              </Button>

            </Col>
          </>
        )}
      </Row>

      <Row>
        <Col xs={12}>
          {values?.features?.length > 0 && (
            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Value</th>
                  {type !== "view" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {(values.features || []).map((feature, index) => (
                  <tr key={feature.key}>
                    <td>{feature.label}</td>
                    <td>{feature.valueType === "boolean" ? "true" : feature.defaultValue}</td>
                    {type !== "view" && (
                      <td>
                        {feature.valueType !== "boolean" && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => {
                              setSelectedFeature(feature);
                              setFeatureValue(feature.defaultValue);
                              setEditingFeatureKey(feature.key);
                            }}
                          >
                            Edit
                          </Button>
                        )}
                        {" "}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            const updated = [...values.features];
                            const removed = updated.splice(index, 1)[0];

                            setFieldValue("features", updated);

                            if (removed.key === editingFeatureKey) {
                              setSelectedFeature(null);
                              setFeatureValue("");
                              setFeatureError("");
                              setEditingFeatureKey(null);
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>

            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default SubscriptionPlanForm;
