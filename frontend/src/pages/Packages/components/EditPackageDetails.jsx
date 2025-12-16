import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "@themesberg/react-bootstrap";
import { Formik } from "formik";
import { updatePackageSchema } from "../schemas";
import PackageCreateForm from "./PackageCreateForm";
import useEditPackage from "../hooks/useEditPackage";
import { useNavigate } from "react-router-dom";
import { convertToUTC, getDateTime } from "../../../utils/dateFormatter";
import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import { serialize } from "object-to-formdata";
import { isEqual, pickBy } from "lodash";
import moment from "moment";
import PackageOverwritePrompt from "./PackageOverwritePrompt";

const EditPackageDetails = () => {
  const navigate = useNavigate();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [overwriteFormValues, setOverwriteFormValues] = useState(null);
  const [existingPackageData, setExistingPackageData] = useState();

  const isEditPage = true;

  const onSuccess = (res) => {
    if (
      res?.data.success &&
      (res?.data?.message || res?.data?.updatedPackage[0])
    ) {
      navigate(AdminRoutes.Packages);
      toast(res?.data?.message, "success", "packageUpdate");
    } else {
      setExistingPackageData(res?.data);
      setShowOverwriteModal(true);
    }
  };

  const onError = (error) => {
    toast(error.response.data.errors[0].description, "error", "packageCreate");
  };

  const {
    packageData,
    editPackage,
    packageId,
    loading,
    typeOptions,
    typeValue,
    setTypeValue,
    isSelectLoading,
    handleCreateOption,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    handleShow,
    handleYes,
    show,
    setShow,
    active,
  } = useEditPackage(onSuccess, onError);

  const [initialValues, setInitialValues] = useState();

  useEffect(() => {
    if (packageData) {
      setInitialValues({
        packageName: packageData?.packageName,
        packageId: +packageId,
        amount: packageData?.amount ?? "",
        gcCoin: packageData?.gcCoin ?? "",
        scCoin: packageData?.scCoin ?? "",
        isActive: packageData?.isActive,
        isVisibleInStore: packageData?.isVisibleInStore,
        firstPurchaseApplicable: false,
        firstPurchaseScBonus: packageData.firstPurchaseScBonus || 0,
        firstPurchaseGcBonus: packageData.firstPurchaseGcBonus || 0,
        imageUrl: packageData?.imageUrl || "",
        isValidUntil: packageData.validTill ? true : false,
        validTill: packageData.validTill
          ? getDateTime(packageData.validTill)
          : null,
        welcomePurchaseBonusApplicable:
          packageData?.welcomePurchaseBonusApplicable ? true : false,
        welcomePurchaseBonusApplicableMinutes:
          packageData?.welcomePurchaseBonusApplicableMinutes,
        purchaseLimitPerUser: packageData?.purchaseLimitPerUser || 0,
        welcomePurchasePercentage: packageData?.welcomePurchasePercentage || 0,
        isValidFrom: packageData.validFrom ? true : false,
        validFrom: packageData.validFrom
          ? getDateTime(packageData.validFrom)
          : null,
        bonusSc: packageData?.bonusSc || 0,
        bonusGc: packageData?.bonusGc || 0,
        filterType: packageData?.moreDetails?.filterType || null,
        filterOperator: packageData?.moreDetails?.filterOperator || null,
        filterValue: Number(packageData?.moreDetails?.filterValue) || 0,
        isSpecialPackage: packageData?.isSpecialPackage,
        isSubscriberOnly: packageData?.isSubscriberOnly,
        isSubscriberOnly: packageData?.isSubscriberOnly,
        isScheduledPackage: packageData?.isScheduled,
        packageFirstPurchase: packageData?.packageFirstPurchase || [],
        purchaseNo: packageData.purchaseNo ? packageData.purchaseNo : 0,
        ispurchaseNo: packageData.purchaseNo ? true : false,
        intervalDays: "",
        discountedAmount: "",
        subpackageScCoin: "",
        subpackageGcCoin: "",
        subpackageGcBonus: "",
        subpackageScBonus: "",
        subpackageBonusPercentage: "",
        subpackageNoOfPurchase: null,
        subpackagePurchaseDate: false,
        subpackageIsActive: false,
        intervalsConfig: packageData?.nonPurchasePackages,
        scratchCardId: packageData?.scratchCardId || "",
        freeSpinId:
          packageData?.freeSpinBonus?.status === 1 ||
          packageData?.freeSpinBonus?.status === 0
            ? packageData?.freeSpinBonus?.freeSpinId
            : "",
        packageTag: packageData?.packageTag,
      });
    }
  }, [packageData]);

  const handleEditPackageSubmit = (formValues) => {
    const {
      // intervalDays,
      // discountedAmount,
      // subpackageScCoin,
      // subpackageGcCoin,
      // subpackageGcBonus,
      // subpackageScBonus,
      // subpackageBonusPercentage,
      // subpackageNoOfPurchase,
      // subpackagePurchaseDate,
      // subpackageIsActive,
      ...updatedFormValues
    } = formValues;
    const body = {
      ...updatedFormValues,
      amount: formValues.amount.toString(),
      isActive: formValues.isActive,
      packageName: formValues.packageName,
      currency: "USD",
      isVisibleInStore: formValues.isVisibleInStore,
      firstPurchaseApplicable: false,
      firstPurchaseScBonus: formValues.firstPurchaseApplicable
        ? formValues.firstPurchaseScBonus
        : 0,
      firstPurchaseGcBonus: formValues.firstPurchaseApplicable
        ? formValues.firstPurchaseGcBonus
        : 0,
      welcomePurchaseBonusApplicable:
        formValues?.welcomePurchaseBonusApplicable,
      welcomePurchaseBonusApplicableMinutes:
        formValues?.welcomePurchaseBonusApplicable
          ? formValues?.welcomePurchaseBonusApplicableMinutes
          : 0,
      purchaseLimitPerUser: formValues?.purchaseLimitPerUser,
      validTill: convertToUTC(formValues.validTill),
      newPackageType: false,
      textColor: formValues.textColor,
      backgroundColor: formValues.backgroundColor,
      previousAmount:
        formValues?.previousAmount === 0 ? null : formValues?.previousAmount,
      welcomePurchasePercentage: formValues?.welcomePurchasePercentage,
      validFrom: convertToUTC(formValues.validFrom),
      bonusSc: formValues?.bonusSc || 0,
      bonusGc: formValues?.bonusGc || 0,
      playerIds: selectedUserIds,
      filterType: formValues?.filterType,
      filterOperator: formValues?.filterOperator,
      filterValue: Number(formValues?.filterValue),
      isSpecialPackage: formValues.isSpecialPackage,
      isSubscriberOnly: formValues.isSubscriberOnly,
      isScheduledPackage: formValues.isScheduledPackage,
      purpackageFirstPurchase: formValues?.purpackageFirstPurchase || [],
      purchaseNo: formValues?.ispurchaseNo
        ? formValues?.purchaseNo
          ? formValues?.purchaseNo
          : 0
        : 0,
      intervalsConfig: formValues?.intervalsConfig?.length
        ? JSON.stringify(formValues?.intervalsConfig)
        : null,
      scratchCardId: formValues?.scratchCardId || "",
      packageTag: formValues?.packageTag,
    };

    if (formValues?.image) {
      body.image = formValues?.image;
    }

    if (!body.imageUrl) {
      delete body.imageUrl;
    }

    if (!body?.image) {
      delete body?.image;
    }

    if (!formValues?.isScheduledPackage) {
      body.validTill = "";
      body.validFrom = "";
    }

    const changedData = pickBy(body, (value, key) => {
      if (key === "validTill" || key === "validFrom") {
        return !isEqual(
          moment(value).format("YYYY-MM-DD hh:mm:ss"),
          moment(initialValues[key]).format("YYYY-MM-DD hh:mm:ss")
        );
      }
      if (key === "amount") {
        return Number(initialValues.amount) !== Number(body.amount);
      }
      if (key === "currency") {
        return false;
      }
      if (
        key === "filterOperator" ||
        key === "filterType" ||
        key === "newPackageType" ||
        key === "purpackageFirstPurchase"
      ) {
        return false;
      }
      if (key === "intervalsConfig") {
        return (
          JSON.stringify(initialValues?.intervalsConfig) !==
          formValues?.intervalsConfig
        );
      }
      return !isEqual(value, initialValues[key]);
    });

    setOverwriteFormValues({
      ...changedData,
      packageId: packageData?.packageId,
    });

    if (Object.keys(changedData)?.length) {
      editPackage(
        serialize({ ...changedData, packageId: packageData?.packageId })
      );
    } else {
      toast("No changes available to update.", "error");
    }
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Package</h3>
        </Col>
      </Row>

      <Card body>
        {initialValues && (
          <Formik
            initialValues={initialValues}
            validationSchema={updatePackageSchema(packageData)}
            enableReinitialize
            onSubmit={handleEditPackageSubmit}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              setFieldValue,
              resetForm,
              errors,
            }) => {
              return (
                <PackageCreateForm
                  values={values}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  resetForm={resetForm}
                  navigate={navigate}
                  loading={loading}
                  packageData={packageData}
                  isEdit={!!packageData?.PackageUsers?.length}
                  typeOptions={typeOptions}
                  typeValue={typeValue}
                  setTypeValue={setTypeValue}
                  isSelectLoading={isSelectLoading}
                  handleCreateOption={handleCreateOption}
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  handleDeleteModal={handleDeleteModal}
                  handleDeleteYes={handleDeleteYes}
                  deleteModalShow={deleteModalShow}
                  setDeleteModalShow={setDeleteModalShow}
                  show={show}
                  handleYes={handleYes}
                  active={active}
                  handleShow={handleShow}
                  setShow={setShow}
                  isEditPage={isEditPage}
                  errors={errors}
                />
              );
            }}
          </Formik>
        )}
      </Card>

      <PackageOverwritePrompt
        show={showOverwriteModal}
        onClose={() => setShowOverwriteModal(false)}
        existingPackageData={existingPackageData}
        overwriteFormValues={overwriteFormValues}
        setOverwriteFormValues={setOverwriteFormValues}
        isEdit={true}
        editPackage={editPackage}
      />
    </div>
  );
};

export default EditPackageDetails;
