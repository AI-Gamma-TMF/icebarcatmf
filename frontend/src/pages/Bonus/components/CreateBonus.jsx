import {
  Col,
  Row,
  Button,
  Spinner,
  Form as BForm,
} from '@themesberg/react-bootstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import React, { useState, useEffect } from 'react';
import { AdminRoutes } from '../../../routes';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateMDY } from '../../../utils/dateFormatter';
import { createBonusSchema } from '../schema';
import useOutsideClick from '../../../utils/useOutsideClick';
import '../../../components/DateRangePicker/DateRangePicker.scss';
import useCreateBonus from '../hooks/useCreateBonus';
import Datetime from 'react-datetime'
import useBonusListing from '../hooks/useBonusListing';
import '../bonus.scss'
import BannerViewer from '../../BannerManagement/BannerViewer.jsx';
import SpinWheel from '../../SpinWheel/index.jsx';
import ReferralBonusListing from '../../ReferralBonus/index.jsx';
import useReferralBonus from '../../ReferralBonus/hooks/useReferralBonus.js';
import DailyBonusStreakListing from '../../DailyBonusStreak/index.jsx';
import useDailyBonusStreak from '../../DailyBonusStreak/hooks/useDailyBonusStreak.js';

const CreateBonus = ({ bonusData, details }) => {
  const { createReferralBonus } = useReferralBonus()
  const { createDailyBonusStreak ,dailyBonusStreakData} = useDailyBonusStreak()
  const { bonusData: myBonusData } = useBonusListing()
  // const [dataBonus, setDataBonus] = useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const [preview, setPreview] = useState(null);
  const bonuses = ['daily bonus']
  const [bonusType, _setBonusType] = useState(bonusData?.bonusType ? bonusData?.bonusType : bonuses?.filter(val => !location.state?.includes(val))?.[0])
  const { _ref } = useOutsideClick(false);

  const [showRows, setShowRows] = useState(false);
  const [showDailyBonusRows, setShowDailyBonusRows] = useState(false);
  const handleButtonClick = () => {
    setShowRows(!showRows);
  };
  const handleDailyBonusButtonClick = (setFieldValue) => {
    setFieldValue("bonusAmountGc", 0);
    setFieldValue("bonusAmountSc", 0);
    setFieldValue("day", "");
    setFieldValue("dailyBonusImg", "");
    setShowDailyBonusRows(!showDailyBonusRows);
  };
  const handleCancel = () => {
    showRows ? setShowRows(!showRows) : navigate(AdminRoutes.BonusListing);
  };
  useEffect(() => {
    const set = new Set()
    myBonusData?.rows?.map((bonus) => { set.add(bonus?.bonusType) })
    // setDataBonus(Array.from(set))
  }, [myBonusData])

  // const bonusTypeHandler = (setValues, values, e) => {
  //   setBonusType(e.target.value)
  //   setValues({
  //     ...values, bonusTypeDWM:
  //       [
  //         { day: 1, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //         { day: 2, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //         { day: 3, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //         { day: 4, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //         { day: 5, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //         { day: 6, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //         { day: 7, bonusTypeCoin: [{ type: 'gc', amount: 0 }] },
  //       ]
  //   })

  // }

  // const handleAddClick = (i, index, values, setValues) => {
  //   const tempValues = [...values.bonusTypeDWM];
  //   tempValues[i].bonusTypeCoin.splice(index + 1, 0, { type: `${tempValues[i].bonusTypeCoin[0]?.type === 'gc' ? 'sc' : 'gc'}`, amount: 0 });
  //   setValues({ ...values, bonusTypeDWM: tempValues });
  // };

  // const handleRemoveClick = (i, index, values, setValues) => {
  //   const tempValues = [...values.bonusTypeDWM];
  //   tempValues[i].bonusTypeCoin.splice(index, 1);
  //   setValues({ ...values, bonusTypeDWM: tempValues });
  // };

  const { t, loading, createBonus, updateBonus } = useCreateBonus();
  // const [image, setImage] = useState(null);
  // const [bonusImageDimension, setBonusImageDimension] = useState(false);
  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.target.files[0];
    // setImage(file);

    // Validate file dimensions
    validateFileDimensions(file, field);

    // Optionally, you can update form field value
    setFieldValue(field, file);
  };
  const validateFileDimensions = (file, _field) => {
    const img = new Image();
    img.onload = function () {
      if (img.width > 342 || img.height > 140) {
        // setBonusImageDimension(true)
        // alert('Image dimensions must be less than or equal to 100x100 pixels.');
        // Clear the file input
        // setImage(null);
      }
      else {
        // setBonusImageDimension(false)
      }
    };
    img.src = URL.createObjectURL(file);
  };

  // const { mutate: createReferralBonus, isLoading: createLoading } =
  // useCreateReferralBonusMutation({
  //   onSuccess: (res) => {
  //     refetchReferralData()
  //     toast("Referral Bonus Created Successfully", "success");
  //     // navigate(AdminRoutes.BonusListing);
  //   },
  //   onError: (error) => {
  //     toast(error.response.data.errors[0].description, "error");
  //     errorHandler(error);
  //   },
  // });
  return (
    <>
      <Row>
        <Col sm={12}>
          <h3>
            {bonusData
              ? details
                ? t("viewTitle")
                : t("editTitle")
              : t("createTitle")}
          </h3>
        </Col>
      </Row>
      <Formik
        initialValues={{
          bonusName: bonusData ? bonusData?.bonusName : "",
          bonusAmountGc: bonusData ? bonusData?.gcAmount : 0,
          bonusAmountSc: bonusData ? bonusData?.scAmount : 0,
          isActive: bonusData ? bonusData?.isActive : false,
          description:
            bonusData?.description &&
            typeof bonusData.description === "object" &&
            Object.keys(bonusData.description).length === 0
              ? ""
              : bonusData?.description ?? "",
          startDate: bonusData ? new Date(bonusData?.validFrom) : new Date(),
          bonusImg: bonusData ? bonusData?.bonusImg : "",
          btnText: bonusData ? bonusData?.btnText : "",
          termCondition: bonusData ? bonusData?.termCondition?.EN : "",
          minimumPurchase: bonusData ? bonusData?.minimumPurchase : 0,
          day: bonusData ? bonusData?.day : "",
          dailyBonusImg: bonusData ? bonusData?.dailyBonusImg : "",
          // postalCodeIntervalInMinutes: bonusData? bonusData?.postalCodeIntervalInMinutes:0,
          // postalCodeValidityInDays:bonusData? bonusData?.postalCodeValidityInDays : 0,
          bonusTypeDWM: [
            { day: 1, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
            { day: 2, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
            { day: 3, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
            { day: 4, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
            { day: 5, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
            { day: 6, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
            { day: 7, bonusTypeCoin: [{ type: "gc", amount: 0 }] },
          ],
        }}
        validationSchema={() => createBonusSchema(t)}
        onSubmit={(formValues) => {
          const values = formValues.bonusTypeDWM.map((_item, _i) => {
            return {
              bonusName: formValues.bonusName,
              // day: item.day,
              startDate: formatDateMDY(formValues.startDate),
              endDate: "",
              description: formValues.description,
              gcAmount: formValues?.bonusAmountGc,
              scAmount: formValues?.bonusAmountSc,
              isActive: formValues?.isActive,
              bonusImg: formValues?.bonusImg,
              btnText: formValues?.btnText,
              termCondition: formValues?.termCondition,
              minimumPurchase: formValues?.minimumPurchase,
              day: formValues.day,
              dailyBonusImg: formValues.dailyBonusImg,
              // postalCodeIntervalInMinutes: formValues?.postalCodeIntervalInMinutes,
              // postalCodeValidityInDays: formValues?.postalCodeValidityInDays,
            };
          });

          const createDailyBonusImages = {
            day_1: formValues.thumbnail && formValues.thumbnail[0],
            day_2: formValues.thumbnail && formValues.thumbnail[1],
            day_3: formValues.thumbnail && formValues.thumbnail[2],
            day_4: formValues.thumbnail && formValues.thumbnail[3],
            day_5: formValues.thumbnail && formValues.thumbnail[4],
            day_6: formValues.thumbnail && formValues.thumbnail[5],
            day_7: formValues.thumbnail && formValues.thumbnail[6],
          };

          const welcomeVal = {
            bonusName: formValues.bonusName,
            startDate: formatDateMDY(formValues.startDate),
            endDate: "",
            description: formValues.description,
            gcAmount: formValues.bonusAmountGc,
            scAmount: formValues.bonusAmountSc,
            fsAmount: 0,
            isActive: formValues.isActive,
            bonusImg: formValues.bonusImg,
            btnText: formValues.btnText,
            termCondition: formValues.termCondition,
          };

          const updateValues = {
            bonusId: bonusData?.bonusId,
            bonusName: bonusData?.bonusName,
            bonusType: bonusType,
            startDate: formatDateMDY(formValues.startDate),
            endDate: "",
            gcAmount: formValues.bonusAmountGc,
            scAmount: formValues.bonusAmountSc,
            fsAmount: 0,
            description: formValues.description,
            isActive: formValues.isActive,
            bonusImg: formValues.bonusImg,
            btnText: formValues.btnText,
            termCondition: formValues.termCondition,
            minimumPurchase: formValues.minimumPurchase,
            day: formValues.day ? +formValues.day : "",
            dailyBonusImg: formValues.dailyBonusImg,
            // postalCodeIntervalInMinutes: formValues?.postalCodeIntervalInMinutes,
            // postalCodeValidityInDays: formValues?.postalCodeValidityInDays
          }
          const updateImage = {}

          // if (bonusData?.bonusType != 'welcome bonus') {
          //   updateValues.day = bonusData?.day
          // }

          !bonusData
            ? createBonus({
                bonusData:
                  bonusType === "welcome bonus"
                    ? { bonusType: bonusType, bonuses: [welcomeVal] }
                    : {
                        bonusType: bonusType,
                        bonuses: JSON.stringify(values.flat()),
                        ...createDailyBonusImages,
                      },
              })
            : bonusType === "referral-bonus" && showRows
            ? (createReferralBonus(updateValues), setShowRows(false))
            : bonusType === "daily-bonus" && showDailyBonusRows
            ? (createDailyBonusStreak({ ...updateValues, ...updateImage }),
              setShowDailyBonusRows(false))
            : bonusType === "daily-bonus" && formValues.day === ""
            ? updateBonus({ updateValues })
            : updateBonus({
                bonusData:
                  bonusType === "daily bonus"
                    ? { ...updateValues, ...updateImage }
                    : updateValues,
              });
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Row className="mt-3">
              <Col className="col-12 col-sm-6 col-lg-3">
                <BForm.Label>
                  {t("form.bonusName")}
                  <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Control
                  type="text"
                  name="bonusName"
                  disabled={bonusData || details || showRows}
                  placeholder={t("form.bonusNamePlace")}
                  value={values.bonusName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="bonusName"
                  className="text-danger"
                />
              </Col>
              <Col className="col-12 col-sm-6 col-lg-3">
                <BForm.Label>
                  {t("form.dateRange")} <span className="text-danger">*</span>
                </BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: t("form.dateRangePlace"),
                    disabled: details || showRows,
                    readOnly: true,
                  }}
                  dateFormat="MM/DD/YYYY"
                  onChange={(e) => {
                    setFieldValue("startDate", formatDateMDY(e._d));
                  }}
                  value={values.startDate}
                  isValidDate={(e) => {
                    return (
                      e._d > new Date() ||
                      formatDateMDY(e._d) === formatDateMDY(new Date())
                    );
                  }}
                  timeFormat={false}
                />
                <ErrorMessage
                  component="div"
                  name="startDate"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>
                  {t("form.active")}
                  <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Check
                  type="switch"
                  name="isActive"
                  checked={values.isActive}
                  disabled={details || showRows}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
            </Row>
            {bonusType !== "daily-bonus" && (
              <Row className="mt-3">
                <Col className="col-12 col-sm-6 col-lg-3">
                  <BForm.Label>Button Text</BForm.Label>
                  <BForm.Control
                    type="text"
                    name="btnText"
                    value={values.btnText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col className="col-12 col-sm-6 col-lg-3">
                  <BForm.Label>Bonus Image </BForm.Label>
                  <BForm.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg"
                    name="bonusImg"
                    disabled={details || showRows}
                    onChange={(event) =>
                      handleFileChange(event, setFieldValue, "bonusImg")
                    }
                    onBlur={handleBlur}
                  />
                </Col>
                <Col className="col-12 col-sm-6 col-lg-2">
                  <BForm.Label>Bonus Image Preview</BForm.Label>
                  <div>
                    <BannerViewer thumbnailUrl={bonusData?.imageUrl} />
                  </div>
                </Col>
                <Col>
                  <BForm.Label>Terms and Condition</BForm.Label>
                  <BForm.Control
                    type="text"
                    name="termCondition"
                    disabled={details || showRows}
                    value={values.termCondition}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>
              </Row>
            )}
            {/* {bonusType === 'postal-code-bonus' && (
              <Row className="mt-3">
                <Col className="col-12 col-sm-6">
                  <BForm.Label>Postal Code Regenrate Interval for Player (in minutes)</BForm.Label>
                  <BForm.Control
                    type="number"
                    min="0"
                    placeholder="Enter validity in minutes"
                    name="postalCodeIntervalInMinutes"
                    value={values.postalCodeIntervalInMinutes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={details || showRows}
                  />
                  <ErrorMessage
                    component="div"
                    name="postalCodeIntervalInMinutes"
                    className="text-danger"
                  />
                </Col>
                <Col className="col-12 col-sm-6">
                  <BForm.Label>Postal Code Validity (in days)</BForm.Label>
                  <BForm.Control
                    type="number"
                    min="0"
                    placeholder="Enter validity in days"
                    name="postalCodeValidityInDays"
                    value={values.postalCodeValidityInDays}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={details || showRows}
                  />
                  <ErrorMessage
                    component="div"
                    name="postalCodeValidityInDays"
                    className="text-danger"
                  />
                </Col>
              </Row>

            )} */}

            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  {t("form.description")}
                  <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Control
                  type="text"
                  as="textarea"
                  rows="3"
                  name="description"
                  disabled={details || showRows}
                  placeholder={t("form.descriptionPlace")}
                  value={values?.description ? values?.description : ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="description"
                  className="text-danger"
                />
              </Col>
            </Row>
            {(bonusData || bonusType === "welcome bonus") && (
              <Row className="mt-3">
                <div className="flex-basis-50 mb-3">
                  <div>
                    {bonusType === "promotion-bonus" ||
                    bonusType === "affiliate-bonus" ||
                    bonusType === "wheel-spin-bonus" ? (
                      <></>
                    ) : bonusType === "referral-bonus" ? (
                      <>
                        <Button
                          variant="outline-secondary"
                          className="f-right"
                          onClick={handleButtonClick}
                          hidden={details || showRows}
                        >
                          {t("createBtn")}
                        </Button>
                        {showRows && (
                          <>
                            <BForm.Label>
                              Note: Edit the below fields to create a new
                              referral bonus.
                            </BForm.Label>
                            <Row className="mt-2">
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Coin Type</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"bonusTypeGc"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    GC
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  name={"bonusAmountGc"}
                                  disabled={details}
                                  value={values.bonusAmountGc}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="bonusAmountGc"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Coin Type</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"bonusTypeSc"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    SC
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  disabled={details}
                                  name={"bonusAmountSc"}
                                  value={values.bonusAmountSc}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="bonusAmountSc"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Minimum Purchase</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"minimumPurchase"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    Minimum Purchase
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Minimum Purchase Amount"
                                  disabled={details}
                                  name={"minimumPurchase"}
                                  value={values.minimumPurchase}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="minimumPurchase"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                          </>
                        )}
                      </>
                    ) : bonusType === "daily-bonus" ? (
                      <>
                        {dailyBonusStreakData?.count < 7 ? (
                          <Button
                            variant="outline-secondary"
                            className="f-right"
                            onClick={() => {
                              handleDailyBonusButtonClick(setFieldValue);
                            }}
                            hidden={details || showDailyBonusRows}
                          >
                            {t("createBtn")}
                          </Button>
                        ) : (
                          <></>
                        )}

                        {showDailyBonusRows && (
                          <>
                            <BForm.Label>
                              Note: Edit the below fields to create a new daily
                              bonus.
                            </BForm.Label>
                            <Row className="mt-2">
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Coin Type</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"bonusTypeGc"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    GC
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  name={"bonusAmountGc"}
                                  disabled={details}
                                  value={values.bonusAmountGc}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="bonusAmountGc"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Coin Type</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"bonusTypeSc"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    SC
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  disabled={details}
                                  name={"bonusAmountSc"}
                                  value={values.bonusAmountSc}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="bonusAmountSc"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Day</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  name={"day"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"0"} value={""}>
                                    Select Day
                                  </option>
                                  <option key={"1"} value={"1"}>
                                    1
                                  </option>
                                  <option key={"2"} value={"2"}>
                                    2
                                  </option>
                                  <option key={"3"} value={"3"}>
                                    3
                                  </option>
                                  <option key={"4"} value={"4"}>
                                    4
                                  </option>
                                  <option key={"5"} value={"5"}>
                                    5
                                  </option>
                                  <option key={"6"} value={"6"}>
                                    6
                                  </option>
                                  <option key={"7"} value={"7"}>
                                    7
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Thumbnail</BForm.Label>
                                <BForm.Control
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue("dailyBonusImg", file);
                                    setPreview(URL.createObjectURL(file));
                                  }}
                                />
                                {preview && (
                                  <div className="mt-3">
                                    <img
                                      src={preview}
                                      alt="Preview"
                                      width="200"
                                    />
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {bonusType === "gc-bonus" ? null : (
                          <>
                            <Row className="mt-2">
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Coin Type</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"bonusTypeGc"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    GC
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  name={"bonusAmountGc"}
                                  disabled={details}
                                  value={values.bonusAmountGc}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="bonusAmountGc"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Coin Type</BForm.Label>
                                <BForm.Select
                                  type="text"
                                  disabled
                                  name={"bonusTypeSc"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option key={"gc"} value={"gc"}>
                                    SC
                                  </option>
                                </BForm.Select>
                              </Col>
                              <Col className="col-12 col-sm-6">
                                <BForm.Label>Amount</BForm.Label>
                                <BForm.Control
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  disabled={details}
                                  name={"bonusAmountSc"}
                                  value={values.bonusAmountSc}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="bonusAmountSc"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Row>
            )}

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button variant="warning" onClick={handleCancel}>
                {t("form.cancel")}
              </Button>

              <Button
                variant="success"
                hidden={details}
                onClick={() => {
                  handleSubmit();
                }}
                className="ml-2"
                disabled={loading}
              >
                {t("form.submit")}
                {loading && (
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
      <Row className="mt-4">
        {bonusType === "wheel-spin-bonus" && <SpinWheel />}
        {bonusType === "referral-bonus" && <ReferralBonusListing />}
        {bonusType === "daily-bonus" && <DailyBonusStreakListing />}
      </Row>
    </>
  );
};

export default CreateBonus;
