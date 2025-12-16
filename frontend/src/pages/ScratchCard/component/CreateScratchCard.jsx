import React, { use, useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Table,
  Card,
} from "@themesberg/react-bootstrap";
import { toast } from "../../../components/Toast/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  errorHandler,
  useCreateBudgetMutuation,
  useCreateScratchCardImageMutation,
  useCreateScratchCardMutation,
  useResetBudegetMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { getScratchCardValidationSchema } from "../schema.js";
import { useQuery } from "@tanstack/react-query";
import {
  getScratchCardBudget,
  getScratchCardDetails,
} from "../../../utils/apiCalls.js";
import LimitLabels from "../../../components/ResponsibleGaming/LimitLabels.jsx";
import { useTranslation } from "react-i18next";
import useCheckPermission from "../../../utils/checkPermission.js";
import BugetLimit from "./BugetLimit.jsx";
import { limitName } from "../../../components/ResponsibleGaming/constants.js";
import { serialize } from "object-to-formdata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faEdit,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../../components/OverlayTrigger/index.jsx";

const CreateScratchCard = () => {
  const { t } = useTranslation(["players"]);
  const { isHidden } = useCheckPermission();
  const navigate = useNavigate();
  const location = useLocation();
  const parentData = location.state?.parentData;
  const [scratchCardRecords, setScratchCardRecords] = useState([]);
  const [showFields, setShowFields] = useState(false);
  const [scratchCardName, setScratchCardName] = useState("");
  const [rewardType, setRewardType] = useState("SC");
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [limitModal, setLimitModal] = useState(false);
  const [limit, setLimit] = useState({});
  const [createImageUrl, setCreateImageUrl] = useState("");

  const initialLimitLabels = [
    {
      label: "Daily Budget Limit",
      limitTypeName: "daily",
      value: null,
      minimum: 0,
      limitType: 1,
      image: "/rsg-image/daily-purchase-limit.svg",
    },
    {
      label: "Weekly Budget Limit",
      limitTypeName: "weekly",
      value: null,
      minimum: null,
      limitType: 2,
      image: "/rsg-image/weekly-purchase-limit.svg",
    },
    {
      label: "Monthly Budget Limit",
      limitTypeName: "monthly",
      value: null,
      minimum: null,
      limitType: 3,
      image: "/rsg-image/monthly-purchase-play.svg",
    },
  ];
  const [limitLabels, setLimitLabels] = useState(initialLimitLabels);
  const {
    data: scratchCardListData,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["scratchCardList", parentData?.scratchCardId],
    queryFn: () => {
      if (!parentData?.scratchCardId)
        return Promise.reject("Missing scratchCardId");
      return getScratchCardDetails({ scratchCardId: parentData.scratchCardId });
    },
    enabled: !!parentData?.scratchCardId, // Prevent query from running if id is not yet available
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (scratchCardListData?.data[0]?.scratchCardBudgets?.length) {
      const updatedLimitLabels = limitLabels.map((label) => {
        const matchingBudget =
          scratchCardListData?.data[0]?.scratchCardBudgets?.find(
            (budget) => budget.budgetType === label.limitTypeName
          );
        return {
          ...label,
          value: matchingBudget?.budgetAmount ?? null,
        };
      });
      setLimitLabels(updatedLimitLabels);
    } else {
      // Reset to initial state
      setLimitLabels(initialLimitLabels);
    }
  }, [scratchCardListData?.data[0]?.scratchCardBudgets]);
  useEffect(() => {
    if (scratchCardListData) {
      setScratchCardRecords(
        scratchCardListData?.data[0]?.scratchCardConfigs || []
      );
      setScratchCardName(scratchCardListData?.data[0]?.scratchCardName);
      setRewardType(
        scratchCardListData?.data[0]?.scratchCardConfigs[0]?.rewardType
      );
      setShowFields(true);
    }
  }, [scratchCardListData]);

  const { mutate: createScratch, isLoading: createLoading } =
    useCreateScratchCardMutation({
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast("Scratch Card Created Successfully", "success");
          navigate(`${AdminRoutes.ScratchCard}?tab=scratch-card-data`);
        } else {
          toast(data?.data?.message, "error");
        }
      },
      onError: (error) => {
        errorHandler(error);
      },
    });
  const { mutate: createImage, isLoading: createLoadingImage } =
    useCreateScratchCardImageMutation({
      onSuccess: (data) => {
        setCreateImageUrl(data?.data?.url);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });
  const handleCreateScratchSubmit = (values, { resetForm, setFieldValue }) => {
    if (values?.image && createImageUrl !== "") {
      const updatedValues = createImageUrl
        ? { ...values, image: createImageUrl }
        : values;
      setScratchCardRecords((prev) => [...prev, updatedValues]);
      setCreateImageUrl("");
    } else {
      setScratchCardRecords((prev) => [...prev, values]);
    }
    setRewardType(values.rewardType);

    // Reset the form
    resetForm({
      values: {
        minReward: 0,
        maxReward: 0,
        percentage: 1,
        playerLimit: null,
        isAllow: true,
        isActive: true,
        image: null,
      },
    });

    setShowFields(false);
  };

  const handleFinalSubmit = () => {
    if (!scratchCardRecords.length || !scratchCardName) return;
    const payload = {
      ...(parentData?.scratchCardId && {
        scratchCardId: parentData.scratchCardId,
      }),
      scratchCardName,
      isActive: true,
      config: scratchCardRecords.map((formValues) => ({
        ...(formValues?.id && { id: formValues.id }),
        minReward: Number(formValues.minReward),
        maxReward: Number(formValues.maxReward),
        rewardType: formValues.rewardType,
        percentage: Number(formValues.percentage),
        playerLimit: formValues.playerLimit ?? null,
        isAllow: formValues.isAllow,
        isActive: formValues.isActive,
        imageUrl: formValues.image !== "" ? formValues.image : null,
      })),
    };
    createScratch(payload);
  };

  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.target.files[0];
    // Validate file dimensions
    validateFileDimensions(file, field);
    // Optionally, you can update form field value
    setFieldValue(field, file);
    //createImage(serialize({image:file}))
    createImage(serialize({ image: file }));
  };
  const validateFileDimensions = (file, field) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
  };
  const { mutate: resetBugetLimit, isLoading: resetLoading } =
    useResetBudegetMutation({
      onSuccess: (data) => {
        refetch();
        if (data.data.message) {
          toast(data.data.message, "success");
        } else {
          toast(data.data.message, "error");
        }
      },
      onError: (error) => {
        if (error?.response?.data?.errors.length > 0) {
          const { errors } = error.response.data;
          errors.map((error) => {
            if (error?.errorCode === 500) {
              toast("Something Went Wrong", "error");
            }
            if (error?.description) {
              toast(error?.description, "error");
            }
          });
        }
      },
    });
  const { mutate: updateBudgetLimit, isLoading: updateLoading } =
    useCreateBudgetMutuation({
      onSuccess: (data) => {
        refetch();
        if (data.data.message) {
          toast(data.data.message, "success");
        } else {
          toast(data.data.message, "error");
        }
      },
      onError: (error) => {
        if (error?.response?.data?.errors.length > 0) {
          const { errors } = error.response.data;
          errors.map((error) => {
            if (error?.errorCode === 500) {
              toast("Something Went Wrong", "error");
            }
            if (error?.description) {
              toast(error?.description, "error");
            }
          });
        }
      },
    });
  const updateLimitForModal = (formValues) => {
    let bugetId = scratchCardListData?.data[0]?.scratchCardBudgets?.find(
      (budget) => {
        return formValues?.label?.toLowerCase().includes(budget.budgetType);
      }
    )?.id;
    if (
      limit.label === limitName.daily_budget_limit ||
      limit.label === limitName.weekly_budget_limit ||
      limit.label === limitName.monthly_budget_limit
    ) {
      if (formValues.keyType === "set") {
        updateBudgetLimit({
          scratchCardId: parentData?.scratchCardId,
          budgetAmount: formValues.formValues.limit,
          budgetType:
            limit.limitType === 1
              ? "daily"
              : limit.limitType === 2
                ? "weekly"
                : "monthly",
          isActive: true,
        });
      } else {
        resetBugetLimit({
          scratchCardId: parentData?.scratchCardId,
          budgetId: bugetId,
          actionType: "update",
          budgetAmount: formValues.formValues.limit,
        });
      }
    }
  };
  const resetLimit = (data) => {
    let bugetId = scratchCardListData?.data[0]?.scratchCardBudgets?.find(
      (budget) => {
        return data?.label?.toLowerCase().includes(budget.budgetType);
      }
    )?.id;
    if (
      limit.label === limitName.daily_budget_limit ||
      limit.label === limitName.weekly_budget_limit ||
      limit.label === limitName.monthly_budget_limit
    ) {
      resetBugetLimit({
        scratchCardId: parentData?.scratchCardId,
        budgetId: bugetId,
        actionType: "reset",
      });
    }
  };
  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>
            {parentData && parentData?.scratchCardName
              ? "Add Scratch Card Configuration"
              : "Create Scratch Card"}
          </h3>
        </Col>
      </Row>

      <Formik
        enableReinitialize={true}
        initialValues={{
          minReward: 0,
          maxReward: 1,
          rewardType: rewardType,
          percentage: 1,
          playerLimit: 0,
          isAllow: true,
          isActive: true,
          image: "",
          imageUrl: "",
          message: "",
        }}
        validationSchema={getScratchCardValidationSchema(scratchCardRecords)}
        onSubmit={handleCreateScratchSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          resetForm,
          setFieldValue,
          setFieldError,
          errors,
        }) => (
          <Form>
            <Row className="mt-3">
              <Col className="col-12 col-md-6">
                <BForm.Label>
                  Scratch Card Name <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="scratchCardName"
                  placeholder="Enter Scratch Card Type"
                  value={scratchCardName}
                  disabled={parentData?.scratchCardName}
                  onChange={(e) => {
                    const rawValue = e.target.value;

                    // Allow the user to type freely, but replace multiple spaces with one
                    const singleSpacedValue = rawValue.replace(/\s{2,}/g, " ");

                    // Set the value immediately for typing responsiveness
                    setScratchCardName(singleSpacedValue);
                  }}
                  onBlur={() => {
                    // On blur (when input loses focus), clean up the input:
                    const finalValue = scratchCardName
                      .replace(/\s+/g, " ")
                      .trim();
                    setScratchCardName(finalValue);
                  }}
                />
              </Col>
              {/* <Col className="col-4">
                <BForm.Label>
                  Reward Type <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Select
                  name="rewardType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.rewardType}
                  disabled={values.rewardType !== ""}
                >
                   <option value="" disabled>
                    Select Reward Type
                  </option> 
                   <option value="GC">GC</option> 
                  <option value="SC" disabled>SC</option>
                </BForm.Select>
              </Col> */}
              <Col className="col-12 col-md-6">
                <Button
                  style={{ marginTop: "2rem" }}
                  variant="primary"
                  onClick={() => setShowFields(true)}
                  disabled={!scratchCardName.trim() || !values.rewardType}
                >
                  Add Details
                </Button>
              </Col>
            </Row>

            {showFields && (
              <>
                <Row className="mt-3">
                  <Col>
                    <BForm.Label>
                      Min Reward <span className="text-danger">*</span>
                    </BForm.Label>
                    <BForm.Control
                      type="number"
                      name="minReward"
                      min="0"
                      placeholder="Enter Min Reward"
                      value={values.minReward}
                      onChange={(event) => {
                        const value = event.target.value;
                        const updatedValue = value.match(/^(\d+(\.\d{0,2})?)?$/)
                          ? value
                          : values?.minReward || "";
                        handleChange({
                          target: {
                            name: event.target.name,
                            value: updatedValue,
                          },
                        });
                      }}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                    <ErrorMessage
                      name="minReward"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col>
                    <BForm.Label>
                      Max Reward <span className="text-danger">*</span>
                    </BForm.Label>
                    <BForm.Control
                      type="number"
                      name="maxReward"
                      placeholder="Enter Max Reward"
                      value={values.maxReward}
                      onChange={(event) => {
                        const value = event.target.value;
                        const updatedValue = value.match(/^(\d+(\.\d{0,2})?)?$/)
                          ? value
                          : values?.maxReward || "";
                        handleChange({
                          target: {
                            name: event.target.name,
                            value: updatedValue,
                          },
                        });
                      }}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                    <ErrorMessage
                      name="maxReward"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col sm={12} md={4}>
                    <BForm.Label>
                      percentage<span className="text-danger">*</span>
                    </BForm.Label>
                    <BForm.Control
                      type="number"
                      name="percentage"
                      min="1"
                      max="100"
                      placeholder="Enter percentage"
                      value={values.percentage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-", "."].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                    <ErrorMessage
                      name="percentage"
                      component="div"
                      className="text-danger"
                    />
                  </Col>

                  <Col sm={12} md={4}>
                    <BForm.Label>Player Limit </BForm.Label>
                    <BForm.Control
                      type="number"
                      min="0"
                      name="playerLimit"
                      placeholder="Enter Player Limit"
                      value={values.playerLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[0-9]+$/.test(value)) {
                          // Valid integer value
                          setFieldValue("playerLimit", value);
                          setFieldError("playerLimit", ""); // clear any previous error
                        } else {
                          // Contains non-integer characters (e.g., decimal)
                          setFieldError("playerLimit", "Only integer values are allowed");
                        }
                      }}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
                      }
                    />
                     <ErrorMessage
                      name="playerLimit"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col sm={12} md={4}>
                    <BForm.Label>
                      is Active <span className="text-danger">*</span>
                    </BForm.Label>
                    <BForm.Check
                      type="switch"
                      name="isAllow"
                      checked={values?.isAllow}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ marginTop: "0.5rem" }}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  {createImageUrl ? (
                    <Col className="col-12 col-md-4">
                      <BForm.Label>Image URL</BForm.Label>
                      <BForm.Control
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={values.imageUrl || createImageUrl}
                        readOnly
                      />
                    </Col>
                  ) : (
                    <Col className="col-12 col-md-4">
                      <Col>
                        <BForm.Label>Scratch Card Image</BForm.Label>
                      </Col>
                      <div>
                        <BForm.Control
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        //value={values.imageUrl || createImageUrl}
                        readOnly
                      />
                        
                      </div>
                    </Col>
                  )}
                  <Col className="col-12 col-md-3 scratch-file-upload-button">
                    {/* Hidden file input */}
                    <BForm.Control
                      id="fileUploadInput"
                      type="file"
                      name="image"
                      style={{ display: "none" }}
                      onChange={(event) =>
                        handleFileChange(event, setFieldValue, "image")
                      }
                      onBlur={handleBlur}
                    />

                    {/* Button that triggers file input */}
                    <label htmlFor="fileUploadInput">
                      <Button as="span" variant="primary" style={{ marginTop: "15px" }}>
                        Upload Image URL
                      </Button>
                    </label>
                  </Col>
                </Row>
                <div className="mt-4 d-flex justify-content-end">
                  <Button variant="info" onClick={handleSubmit}>
                    Add Row
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>

      {scratchCardRecords.length > 0 && (
        <div className="mt-4">
          <h5>Added Scratch Cards</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Min</th>
                <th>Max</th>
                <th>Reward</th>
                <th>Percentage</th>
                <th>Limit</th>
                <th>isActive</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scratchCardRecords.map((item, idx) => (
                <tr key={idx}>
                  {editRowIndex === idx ? (
                    <>
                      <td>
                        <BForm.Control
                          type="number"
                          value={editValues.minReward}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              minReward: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <BForm.Control
                          type="number"
                          value={editValues.maxReward}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              maxReward: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>{item.rewardType}</td>
                      <td>
                        <BForm.Control
                          type="number"
                          value={editValues.percentage}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              percentage: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <BForm.Control
                          type="number"
                          value={editValues.playerLimit}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              playerLimit: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <BForm.Check
                          type="switch"
                          checked={editValues.isActive}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              isActive: e.target.checked,
                            })
                          }
                        />
                      </td>
                      <td>
                        <>
                          <Trigger message={"Save"} id={idx + "save"} />
                          <Button
                            id={idx + "save"}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() => {
                              const updated = [...scratchCardRecords];
                              updated[idx] = editValues;
                              setScratchCardRecords(updated);
                              setEditRowIndex(null);
                              setEditValues({});
                            }}
                            hidden={isHidden({
                              module: {
                                key: "ScratchCardConfiguration",
                                value: "U",
                              },
                            })}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </Button>
                          <Trigger message={"Cancel"} id={idx + "cancel"} />

                          <Button
                            id={idx + "cancel"}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() => {
                              setEditRowIndex(null);
                              setEditValues({});
                            }}
                            hidden={isHidden({
                              module: {
                                key: "ScratchCardConfiguration",
                                value: "U",
                              },
                            })}
                          >
                            <FontAwesomeIcon icon={faCancel} />
                          </Button>
                        </>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.minReward}</td>
                      <td>{item.maxReward}</td>
                      <td>{item.rewardType}</td>
                      <td>{item.percentage}</td>
                      <td>{item.playerLimit}</td>
                      <td>{item.isActive ? "True" : "False"}</td>
                      {console.log(parentData , 'parentData', item,'item')}
                      {(!parentData || item.id === undefined) ? (
                        <td>
                          <>
                            <Trigger message={"Edit"} id={idx + "edit"} />
                            <Button
                              id={idx + "edit"}
                              className="m-1"
                              size="sm"
                              variant="warning"
                              onClick={() => {
                                setEditRowIndex(idx);
                                setEditValues(item);
                              }}
                              hidden={isHidden({
                                module: {
                                  key: "ScratchCardConfiguration",
                                  value: "U",
                                },
                              })}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </>{" "}
                          <>
                            <Trigger message={"Delete"} id={idx + "delete"} />
                            <Button
                              id={idx + "delete"}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                const updated = scratchCardRecords.filter(
                                  (_, i) => i !== idx
                                );
                                setScratchCardRecords(updated);
                              }}
                              hidden={isHidden({
                                module: {
                                  key: "ScratchCardConfiguration",
                                  value: "D",
                                },
                              })}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </>
                        </td>
                      ): <td> {'-'} </td>}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {parentData && parentData?.scratchCardName && (
        <div className="mt-4">
          <Card className="card-overview">
            <h4 className="h4-overview">
              Scratch Card Budget Limits <hr className="h4-hr" />
            </h4>
            <div className="div-overview limit row w-100 m-auto">
              {limitLabels?.map(
                (
                  { label, value, minimum, limitType, selfExclusion },
                  index
                ) => {
                  return (
                    <LimitLabels
                      key={index}
                      label={label}
                      value={value}
                      minimum={minimum}
                      limitType={limitType}
                      limitLabels={limitLabels}
                      selfExclusion={selfExclusion}
                      setLimitModal={setLimitModal}
                      setLimit={setLimit}
                      t={t}
                      isHidden={isHidden}
                    />
                  );
                }
              )}
            </div>
          </Card>
          {limitModal && (
            <BugetLimit
              t={t}
              show={limitModal}
              setShow={setLimitModal}
              limit={limit}
              updateLimit={updateLimitForModal}
              resetLimit={resetLimit}
              scratchCardListData={scratchCardListData}
            />
          )}
        </div>
      )}

      <div className="mt-4 d-flex justify-content-end gap-3  align-items-center">
        <Button
          variant="warning"
          onClick={() =>
            navigate(`${AdminRoutes.ScratchCard}?tab=scratch-card-data`)
          }
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleFinalSubmit}
          disabled={
            createLoading ||
            !scratchCardName.trim() ||
            scratchCardRecords.length === 0
          }
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
    </div>
  );
};

export default CreateScratchCard;
