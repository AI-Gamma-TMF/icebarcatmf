import React, { useEffect, useState } from "react";
import { Button, Row, Col } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { Form } from "formik";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../../components/ConfirmationModal";
import useEditPackage from "../hooks/useEditPackage";
import { add, divide, multiply, subtract } from "lodash";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useUploadCsvPackageMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { useQueryClient } from "@tanstack/react-query";
import PackageActionModals from "./PackageDetails/PackageActionModals";
import PackageFormContent from "./PackageDetails/PackageFormContent";

const PackageCreateForm = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  loading,
  navigate,
  setFieldValue,
  packageData,
  isEdit = false,
  // typeOptions,
  // typeValue,
  // setTypeValue,
  // isSelectLoading,
  // handleCreateOption,
  // selectedUserIds,
  // handleDeleteModal,
  // handleShow,
  setSelectedUserIds,
  handleDeleteYes,
  deleteModalShow,
  setDeleteModalShow,
  handleYes,
  show,
  setShow,
  active,
  isEditPage,
  errors,
}) => {
  const { t } = useTranslation(["packages"]);

  const [ladderPackageList, setLadderPackageList] = useState([]);
  const queryClient = useQueryClient();
  const [importedFile, setImportedFile] = useState(null);
  const [importModalShow, setImportModalShow] = useState(false);
  const [csvPlayerData, setCsvPlayerData] = useState(null);
  const [showAddSubPackages, setShowAddSubPackages] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const { deleteftploading, statusFtploading } = useEditPackage();
  const [selectedOption, setSelectedOption] = useState("Basic Package");
  const [selectedScratchCardOption, setSelectedScratchCardOption] =
    useState("");
  const [selectedFreeSpinOption, setSelectFreeSpinOption] = useState("");
  useEffect(() => {
    if (values.amount) {
      const roundedScCoin = Math.ceil(values.amount);
      const roundedGcCoin = Math.ceil(values.amount) * 1000;

      setFieldValue("scCoin", roundedScCoin);
      setFieldValue("gcCoin", roundedGcCoin);
    } else {
      // Reset the values when amount is cleared
      setFieldValue("scCoin", "");
      setFieldValue("gcCoin", "");
    }
  }, [values.amount, setFieldValue]);

  useEffect(() => {
    if (values.gcCoin || values.scCoin) {
      setFieldValue("scCoin", values.scCoin);
      setFieldValue("gcCoin", values.gcCoin);
    } else {
      setFieldValue("scCoin", "");
      setFieldValue("gcCoin", "");
    }
  }, [values.gcCoin, setFieldValue]);

  useEffect(() => {
    if (values.bonusSc) {
      const roundedBonusGc = Math.ceil(values.bonusSc) * 1000;
      setFieldValue("bonusGc", roundedBonusGc);
    } else {
      setFieldValue("bonusGc", 0);
    }
  }, [values.bonusSc, setFieldValue]);

  useEffect(() => {
    if (values.bonusGc || values.bonusSc) {
      setFieldValue("bonusSc", values.bonusSc);
      setFieldValue("bonusGc", values.bonusGc);
    } else {
      setFieldValue("bonusSc", 0);
      setFieldValue("bonusGc", 0);
    }
  }, [values.bonusGc, setFieldValue]);

  useEffect(() => {
    if (packageData) {
      setFieldValue("filterType", packageData?.moreDetails?.filterType || "");
      setFieldValue(
        "filterOperator",
        packageData?.moreDetails?.filterOperator || "="
      );
      setFieldValue("filterValue", packageData?.moreDetails?.filterValue || 0);
      setSelectedUserIds(packageData?.playerId || []);
      setCsvPlayerData(packageData?.userDetails);
    }
  }, [packageData, setFieldValue]);

  useEffect(() => {
    if (values?.firstPurchaseApplicable) {
      setSelectedOption("Basic package");
    } else if (values?.welcomePurchaseBonusApplicable) {
      setSelectedOption("Welcome Purchase Packages");
      setFieldValue("intervalsConfig", null);
    } else if (values?.isLadderPackage) {
      setSelectedOption("Ladder Packages");
      setFieldValue("intervalsConfig", null);
    } else {
      setSelectedOption("Basic Package");
    }
  }, [values]);

  useEffect(() => {
    if (values?.scratchCardId) {
      setSelectedScratchCardOption(values?.scratchCardId);
    } else {
      setSelectedScratchCardOption("");
    }
  }, [values]);
  useEffect(() => {
    if (values?.freeSpinId) {
      setSelectFreeSpinOption(values?.freeSpinId);
    } else {
      setSelectFreeSpinOption("");
    }
  }, [values]);

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
    handleEvent(eventKey);
  };
  const handleSelectScratchCard = (event) => {
    setSelectedScratchCardOption(event);
    setFieldValue("scratchCardId", event);
  };
  const handleSelectFreeSpin = (event) => {
    setSelectedScratchCardOption(event);
    setFieldValue("freeSpinId", event);
  };
  const handleEvent = (option) => {
    switch (option) {
      case "Welcome Purchase Packages":
        setFieldValue("welcomePurchaseBonusApplicable", true);
        setFieldValue("isSpecialPackage", false);
        setFieldValue("firstPurchaseApplicable", false);
        // setFieldValue('isValidFrom', false);
        // setFieldValue('isValidUntil', false);
        setFieldValue("validTill", null);
        setFieldValue("validFrom", null);
        setFieldValue("ispurchaseNo", false);
        setFieldValue("purchaseNo", 0);
        setFieldValue("isLadderPackage", false);

        break;

      case "Special Purchase Package":
        setFieldValue("isSpecialPackage", true);
        setFieldValue("welcomePurchaseBonusApplicable", false);
        setFieldValue("firstPurchaseApplicable", false);
        break;
      case "Basic Package":
        setFieldValue("firstPurchaseApplicable", false);
        setFieldValue("welcomePurchaseBonusApplicable", false);
        setFieldValue("isLadderPackage", false);

        break;
      case "Ladder Packages":
        setFieldValue("isLadderPackage", true);
        setFieldValue("firstPurchaseApplicable", false);
        setFieldValue("welcomePurchaseBonusApplicable", false);

        break;
      default:
        break;
    }
  };

  const handleSubpackageSubmit = () => {
    const existingPackages = values?.intervalsConfig || [];
    const alreadyExists = existingPackages.some(
      (pkg) =>
        +pkg.intervalDays === +editValues.intervalDays &&
        pkg.intervalDays !== editRowId
    );

    if (alreadyExists) {
      toast(
        `Package with the same interval already exists in the list`,
        "error"
      );
      return;
    }

    setFieldValue(
      "intervalsConfig",
      existingPackages.map((pkg) =>
        pkg.intervalDays === editRowId ? { ...pkg, ...editValues } : pkg
      )
    );

    setEditRowId(null);
  };

  const handleEditClick = (row) => {
    setEditRowId(row.intervalDays);
    setEditValues({
      intervalDays: row?.intervalDays,
      discountedAmount: row?.discountedAmount,
      subpackageGcCoin: row?.subpackageGcCoin,
      subpackageScCoin: row?.subpackageScCoin,
      subpackageGcBonus: row?.subpackageGcBonus,
      subpackageScBonus: row?.subpackageScBonus,
      subpackageBonusPercentage: row?.subpackageBonusPercentage,
      subpackageNoOfPurchase: row?.subpackageNoOfPurchase || null,
      subpackagePurchaseDate: row?.subpackagePurchaseDate,
      subpackageIsActive: row?.subpackageIsActive,
    });
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditValues({});
  };

  const handleEditSubpackage = (e) => {
    const { name, value, type, checked } = e.target;

    setEditValues((prev) => {
      const updatedValues = {
        ...prev,
        [name]: type === "checkbox" ? checked : value === "" ? null : value,
      };
      if (name === "discountedAmount") {
        updatedValues.subpackageScCoin = Math.ceil(+value);
        updatedValues.subpackageGcCoin = updatedValues.subpackageScCoin * 1000;
      }
      if (
        ["discountedAmount", "subpackageScCoin", "subpackageScBonus"].includes(
          name
        )
      ) {
        const { discountedAmount, subpackageScCoin, subpackageScBonus } =
          updatedValues;
        updatedValues.subpackageBonusPercentage = Math.floor(
          +multiply(
            +divide(
              +subtract(
                +add(+subpackageScCoin, +subpackageScBonus),
                +discountedAmount
              ),
              +discountedAmount
            ),
            100
          )
        );
      }
      return updatedValues;
    });
  };

  const handleImportChange = (e) => {
    const file = e.target.files[0];
    setImportedFile(e.target.files[0]);
    if (file) {
      setImportModalShow(true);
    }
    e.target.value = null;
  };

  const { mutate: uploadPackageCSV, isLoading: uploadCSVLoading } =
    useUploadCsvPackageMutation({
      onSuccess: ({ data }) => {
        setCsvPlayerData(data?.data?.rows ?? []);
        toast(data.message, "success");
        queryClient.invalidateQueries({
          queryKey: ["packageAppliedPlayerList"],
        });
        setImportModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
        setImportModalShow(false);
      },
    });

  useEffect(() => {
    const allUserId = csvPlayerData?.map((user) => user.userId);
    setSelectedUserIds(allUserId);
  }, [csvPlayerData]);

  const handleCSVSumbit = () => {
    let formData = new FormData();
    formData.append("file", importedFile);
    uploadPackageCSV(formData);
    setImportModalShow(false);
  };

  return (
    <>
      <PackageFormContent
        values={values}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSelect={handleSelect}
        isEdit={isEdit}
        isEditPage={isEditPage}
        selectedOption={selectedOption}
        setFieldValue={setFieldValue}
        packageData={packageData}
        errors={errors}
        ladderPackageList={ladderPackageList}
        setLadderPackageList={setLadderPackageList}
        showAddSubPackages={showAddSubPackages}
        setShowAddSubPackages={setShowAddSubPackages}
        editRowId={editRowId}
        editValues={editValues}
        handleEditSubpackage={handleEditSubpackage}
        handleCancelEdit={handleCancelEdit}
        handleEditClick={handleEditClick}
        handleSubpackageSubmit={handleSubpackageSubmit}
        handleImportChange={handleImportChange}
        handleSubmit={handleSubmit}
        loading={loading}
        navigate={navigate}
        csvPlayerData={csvPlayerData}
        uploadCSVLoading={uploadCSVLoading}
        selectedScratchCardOption={selectedScratchCardOption}
        handleSelectScratchCard={handleSelectScratchCard}
        selectedFreeSpinOption={selectedFreeSpinOption}
        handleSelectFreeSpin={handleSelectFreeSpin}
      />

      <PackageActionModals
        deleteModalShow={deleteModalShow}
        setDeleteModalShow={setDeleteModalShow}
        handleDeleteYes={handleDeleteYes}
        deleteftploading={deleteftploading}
        show={show}
        setShow={setShow}
        handleYes={handleYes}
        active={active}
        statusFtploading={statusFtploading}
        importModalShow={importModalShow}
        setImportModalShow={setImportModalShow}
        uploadCSVLoading={uploadCSVLoading}
        handleCSVSumbit={handleCSVSumbit}
        importedFile={importedFile}
      />
    </>
  );
};

export default PackageCreateForm;
