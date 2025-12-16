import {
  Col,
  Row,
  Button,
  Spinner,
  Form as BForm,
} from '@themesberg/react-bootstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import React, { useState, useEffect } from 'react';
import { AdminRoutes } from '../../../routes.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDateMDY } from '../../../utils/dateFormatter.js';
import { createBonusSchema } from '../schema.js';
import useOutsideClick from '../../../utils/useOutsideClick.js';
import '../../../components/DateRangePicker/DateRangePicker.scss';
import useCreateBonus from '../hooks/useCreateBonus.js';
import Datetime from 'react-datetime'
// import useBonusListing from '../hooks/useBonusListing';
import '../bonus.scss'
import SpinWheel from '../../SpinWheel/index.jsx';
import useReferralBonus from '../hooks/useReferralBonus.js';
import { errorHandler, useCreateReferralBonusMutation } from '../../../reactQuery/hooks/customMutationHook/index.js';
import { toast } from '../../../components/Toast/index.jsx';

const CreateReferralBonus = ({ bonusData, details }) => {
 
  const { bonusData: myBonusData } = useReferralBonus()
  // const [dataBonus, setDataBonus] = useState([])
  const navigate = useNavigate();
  const location = useLocation();

  const bonuses = ['daily bonus']
  const [bonusType, _setBonusType] = useState(bonusData?.bonusType ? bonusData?.bonusType : bonuses?.filter(val => !location.state?.includes(val))?.[0])
  const { _ref } = useOutsideClick(false);

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

  const { t, updateBonus } = useCreateBonus();
  // const [image, setImage] = useState(null);
  // const [bonusImageDimension, setBonusImageDimension] = useState(false);
  // const handleFileChange = (event, setFieldValue, field) => {
  //   const file = event.target.files[0];
  //   setImage(file);

  //   // Validate file dimensions
  //   validateFileDimensions(file, field);

  //   // Optionally, you can update form field value
  //   setFieldValue(field, file);
  // };
  // const validateFileDimensions = (file, field) => {
  //   const img = new Image();
  //   img.onload = function () {
  //     if (img.width > 342 || img.height > 140) {
  //       setBonusImageDimension(true)
  //       // alert('Image dimensions must be less than or equal to 100x100 pixels.');
  //       // Clear the file input
  //       setImage(null);
  //     }
  //     else {
  //       setBonusImageDimension(false)
  //     }
  //   };
  //   img.src = URL.createObjectURL(file);

  // }

  const { mutate: createReferralBonus, isLoading: createLoading } =
  useCreateReferralBonusMutation({
    onSuccess: () => {
      toast("Referral Bonus Created Successfully", "success");
      navigate(AdminRoutes.ReferralBonusListing);
    },
    onError: (error) => {
      toast(error.response.data.errors[0].description, "error");
      errorHandler(error);
    },
  });

  const handleCreatePromotionBonusSubmit = (formValues) => {
    const body = {
      ...formValues,
      bonusName: formValues.bonusName,
      startDate: formatDateMDY(formValues.startDate),
      description: formValues.description,
      gcAmount: formValues?.gcAmount,
      scAmount: formValues?.scAmount,
      isActive: formValues.isActive,
      btnText: formValues.btnText,
      termCondition: formValues.termCondition,
      minimumPurchase: formValues.minimumPurchase,
    };

    const updateValues = {
      bonusId: bonusData?.bonusId,
      bonusName: formValues.bonusName,
      startDate: formatDateMDY(formValues.startDate),
      gcAmount: formValues.gcAmount,
      scAmount: formValues.scAmount,
      description: formValues.description,
      isActive: formValues.isActive,
      btnText: formValues.btnText,
      termCondition: formValues.termCondition,
      minimumPurchase: formValues.minimumPurchase,
    };

    !bonusData ? createReferralBonus(body) : updateBonus(updateValues);
  };
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
          scAmount: bonusData ? bonusData?.gcAmount : 0,
          gcAmount: bonusData ? bonusData?.scAmount : 0,
          isActive: bonusData ? bonusData?.isActive : false,
          description:
            bonusData?.description &&
            typeof bonusData.description === "object" &&
            Object.keys(bonusData.description).length === 0
              ? ""
              : bonusData?.description ?? "",
          startDate: bonusData ? new Date(bonusData?.validFrom) : new Date(),
          btnText: bonusData ? bonusData?.btnText : "",
          termCondition: bonusData ? bonusData?.termCondition?.EN : "",
          minimumPurchase: bonusData ? bonusData?.minimumPurchase : 0,
        }}
        validationSchema={() => createBonusSchema(t)}
        onSubmit={handleCreatePromotionBonusSubmit}
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
                  disabled={details}
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
                    disabled: details,
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
                <BForm.Label>Bonus Sc</BForm.Label>

                <BForm.Control
                  type="number"
                  name="scAmount"
                  min="0"
                  disabled={details}
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
                  disabled={details}
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
            </Row>
            <Row className="mt-3">
              <Col className="col-12 col-sm-6 col-lg-3">
                <BForm.Label>Button Text</BForm.Label>
                <BForm.Control
                  type="text"
                  name="btnText"
                  disabled={details}
                  value={values.btnText}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>

              <Col className="col-12 col-sm-6 col-lg-3">
                <BForm.Label>Terms and Condition</BForm.Label>
                <BForm.Control
                  type="text"
                  name="termCondition"
                  disabled={details}
                  value={values.termCondition}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col>
                <BForm.Label>Minimum Purchase</BForm.Label>

                <BForm.Control
                  type="number"
                  name="minimumPurchase"
                  min="0"
                  disabled={details}
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
              <Col>
                <BForm.Label>
                  {t("form.active")}
                  <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Check
                  type="switch"
                  name="isActive"
                  checked={values.isActive}
                  disabled={details}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
            </Row>
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
                  disabled={details}
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

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button
                variant="warning"
                onClick={() =>
                  navigate(`${AdminRoutes.BonusEdit.split(":").shift()}${3}`)
                }
              >
                {t("form.cancel")}
              </Button>

              <Button
                variant="success"
                hidden={details}
                onClick={() => {
                  handleSubmit();
                }}
                className="ml-2"
                disabled={createLoading}
              >
                {t("form.submit")}
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
      <Row className="mt-4">
        {bonusType === "wheel-spin-bonus" && <SpinWheel />}
      </Row>
    </>
  );
};

export default CreateReferralBonus;
