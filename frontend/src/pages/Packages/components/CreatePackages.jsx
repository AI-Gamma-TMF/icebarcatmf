import React, { useState } from "react";
import { Row, Col, Modal, Button } from "@themesberg/react-bootstrap";
import { Formik } from "formik";
import { createPackageSchema } from "../schemas";
import { useNavigate } from "react-router-dom";
import PackageCreateForm from "./PackageCreateForm";
import usCreatePackage from "../hooks/useCreatePackage";
import {
  useCreateLadderPackageMutation,
  useCreatePackageMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { AdminRoutes } from "../../../routes";
import { toast } from "../../../components/Toast";
import { useTranslation } from "react-i18next";
import { serialize } from "object-to-formdata";
import { convertToUTC, formatDateMDY } from "../../../utils/dateFormatter";
import PackageOverwritePrompt from "./PackageOverwritePrompt";

const CreatePackages = () => {
  const {
    typeOptions,
    typeValue,
    setTypeValue,
    isSelectLoading,
    handleCreateOption,
  } = usCreatePackage();
  const { t } = useTranslation(["packages"]);
  const navigate = useNavigate();
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [overwriteFormValues, setOverwriteFormValues] = useState(null);
  const [existingPackageData, setExistingPackageData] = useState();

  const onSuccess = (res) => {
    if (res?.data?.success) {
      toast(res?.data?.message, "success", "packageCreate");
      navigate(AdminRoutes.Packages);
    } else {
      setExistingPackageData(res?.data);
      setShowOverwriteModal(true);
    }
  };
  const onError = (error) => {
    toast(error.response.data.errors[0].description, "error", "packageCreate");
  };
  const { mutate: createPackage, isLoading } = useCreatePackageMutation({
    onSuccess,
    onError,
  });

  const { mutate: createLadderPackage, isLoading: isLadderPackageLoading } =
    useCreateLadderPackageMutation({
      onSuccess,
      onError,
    });

  const handleCreatePackageSubmit = (formValues) => {
    const packageTypeInfo = typeOptions.find(
      (item) => item.value === formValues.packageType
    );
    const {
      ladderPackageData,
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
      ...submitValues
    } = formValues;

    const body = {
      ...submitValues,
      amount: formValues.amount.toString(),
      packageName: formValues.packageName,
      isActive: formValues.isActive,
      packageType: formValues.packageType,
      currency: "USD",
      isVisibleInStore: formValues.isVisibleInStore,
      image: formValues?.image,
      imageUrl: formValues?.imageUrl,
      validTill: convertToUTC(formValues.validTill),
      newPackageType: false,
      showPackageType: formValues.showPackageType,
      playerIds: selectedUserIds,
      validFrom: convertToUTC(formValues.validFrom),
      filterType: selectedUserIds?.length > 0 ? formValues?.filterType : null,
      filterOperator:
        selectedUserIds?.length > 0 ? formValues?.filterOperator : null,
      filterValue:
        selectedUserIds?.length > 0 ? Number(formValues?.filterValue) : null,
      isSpecialPackage: formValues.isSpecialPackage,
      isSubscriberOnly: formValues.isSubscriberOnly,
      isScheduledPackage: formValues.isScheduledPackage,
      ftpBonuses: formValues.ftpBonuses ? formValues.ftpBonuses : [],
      purchaseNo: formValues?.ispurchaseNo
        ? formValues?.purchaseNo
          ? formValues?.purchaseNo
          : 0
        : 0,
      isLadderPackage: formValues?.isLadderPackage,
      amountArray: ladderPackageData?.map((pkg) => pkg.amount),
      gcCoinArray: ladderPackageData?.map((pkg) => pkg.gcCoin),
      scCoinArray: ladderPackageData?.map((pkg) => pkg.scCoin),
      bonusGcArray: ladderPackageData?.map((pkg) => pkg.scBonus),
      bonusScArray: ladderPackageData?.map((pkg) => pkg.gcBonus),
      packageNameArray: ladderPackageData?.map((pkg) => pkg.packageName),
      isSpecialPackageArray: ladderPackageData?.map(
        (pkg) => pkg.isSpecialPackage
      ),
      ladderPackageCount: ladderPackageData?.length,
      intervalsConfig: formValues?.intervalsConfig
        ? JSON.stringify(formValues?.intervalsConfig)
        : null,
      packageTag: formValues?.packageTag,
    };

    if (!formValues?.isScheduledPackage) {
      body.validTill = "";
      body.validFrom = "";
    }

    if (!body.imageUrl) {
      delete body.imageUrl;
    }

    if (!body.image) {
      delete body?.image;
    }

    if (packageTypeInfo?.newOptions) {
      body.newPackageType = true;
    }

    setOverwriteFormValues(body);

    if (body?.isLadderPackage) createLadderPackage(serialize(body));
    else createPackage(serialize(body));
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>{t("createPackage.title")}</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          packageName: "",
          amount: "",
          gcCoin: "",
          scCoin: "",
          isActive: false,
          isValidUntil: false,
          packageType: null,
          isVisibleInStore: false,
          image: "",
          imageUrl: "",
          validTill: null,
          textColor: "",
          showPackageType: true,
          backgroundColor: "",
          previousAmount: "",
          firstPurchaseApplicable: false,
          firstPurchaseScBonus: 0,
          firstPurchaseGcBonus: 0,
          ftpBonuses: [],
          welcomePurchaseBonusApplicable: false,
          welcomePurchaseBonusApplicableMinutes: "",
          purchaseLimitPerUser: null,
          welcomePurchasePercentage: 0,
          // isValidFrom: false,
          validFrom: null,
          bonusSc: 0,
          bonusGc: 0,
          filterType: selectedUserIds?.length > 0 || null,
          filterOperator: selectedUserIds?.length > 0 || null,
          filterValue: selectedUserIds?.length > 0 || null,
          isSpecialPackage: false,
          isSubscriberOnly: false,
          isScheduledPackage: false,
          purchaseNo: 0,
          ispurchaseNo: false,
          userNameSearch: "",
          emailSearch: "",
          idSearch: "",
          isLadderPackage: false,
          amountArray: [],
          gcCoinArray: [],
          scCoinArray: [],
          bonusGcArray: [],
          bonusScArray: [],
          packageNameArray: [],
          ladderPackageData: [],
          ladderPackageCount: 0,
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
          scratchCardId: null,
          freeSpinid: null,
          packageTag: "",
        }}
        validationSchema={createPackageSchema}
        onSubmit={handleCreatePackageSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
          errors,
        }) => {
          return (
            <PackageCreateForm
              values={values}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              loading={isLoading}
              navigate={navigate}
              typeOptions={typeOptions}
              typeValue={typeValue}
              setTypeValue={setTypeValue}
              isSelectLoading={isSelectLoading}
              handleCreateOption={handleCreateOption}
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
              errors={errors}
            />
          );
        }}
      </Formik>

      <PackageOverwritePrompt
        show={showOverwriteModal}
        onClose={() => setShowOverwriteModal(false)}
        existingPackageData={existingPackageData}
        overwriteFormValues={overwriteFormValues}
        setOverwriteFormValues={setOverwriteFormValues}
        createPackage={createPackage}
        createLadderPackage={createLadderPackage}
      />
    </div>
  );
};

export default CreatePackages;
