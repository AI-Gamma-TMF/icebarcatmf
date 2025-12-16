import React from "react";
import { Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { Form } from "formik";
import PackageDetailsForm from "./PackageDetailsForm";
import WelcomePurchaseBonusSection from "./WelcomePurchaseBonusSection";
import PackageAmountSection from "./PackageAmountSection";
import PackageFormToggles from "./PackageFormToggles";
import LadderPackageFormSection from "./LadderPackageFormSection";
import SubPackageDetailsForm from "./SubPackageDetailsForm";
import SubPackageListTable from "./SubPackageListTable";
import PackageFooterActions from "./PackageFooterActions";
import PackageCSVUserTable from "./PackageCSVUserTable";

const PackageFormContent = ({
  values,
  handleChange,
  handleBlur,
  handleSelect,
  isEdit,
  isEditPage,
  selectedOption,
  setFieldValue,
  packageData,
  errors,
  ladderPackageList,
  setLadderPackageList,
  showAddSubPackages,
  setShowAddSubPackages,
  editRowId,
  editValues,
  handleEditSubpackage,
  handleCancelEdit,
  handleEditClick,
  handleSubpackageSubmit,
  handleImportChange,
  handleSubmit,
  loading,
  navigate,
  csvPlayerData,
  uploadCSVLoading,
  selectedScratchCardOption,
  handleSelectScratchCard,
  selectedFreeSpinOption,
         handleSelectFreeSpin,
        
}) => {
  const { t } = useTranslation(["packages"]);

  return (
    <Form className="border rounded p-2">
      <div className="container-fluid">
        <PackageDetailsForm
          values={values}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSelect={handleSelect}
          t={t}
          isEdit={isEdit}
          isEditPage={isEditPage}
          selectedOption={selectedOption}
          selectedScratchCardOption={selectedScratchCardOption}
          handleSelectScratchCard={handleSelectScratchCard}
          selectedFreeSpinOption={selectedFreeSpinOption}
          handleSelectFreeSpin={handleSelectFreeSpin}
          
        />
      </div>

      <div className="container-fluid">
        {values?.welcomePurchaseBonusApplicable && (
          <WelcomePurchaseBonusSection
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            t={t}
          />
        )}
      </div>
      {!values?.isLadderPackage && (
        <div className="container-fluid">
          <PackageAmountSection
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            t={t}
            isEdit={isEdit}
          />
        </div>
      )}

      <PackageFormToggles
        values={values}
        handleChange={handleChange}
        handleBlur={handleBlur}
        setFieldValue={setFieldValue}
        t={t}
        isEdit={isEdit}
        packageData={packageData}
        errors={errors}
      />

      {values?.isLadderPackage && (
        <LadderPackageFormSection
          values={values}
          t={t}
          handleChange={handleChange}
          handleBlur={handleBlur}
          isEdit={isEdit}
          ladderPackageList={ladderPackageList}
          setLadderPackageList={setLadderPackageList}
          setFieldValue={setFieldValue}
        />
      )}

      {!values?.isLadderPackage && !values?.welcomePurchaseBonusApplicable && (
        <>
          <Button
            className="mt-4 ms-2"
            onClick={() => setShowAddSubPackages(!showAddSubPackages)}
            disabled={
              values?.amount === "" ||
              values?.amount <= 0 ||
              values?.gcCoin === "" ||
              values?.scCoin === ""
            }
            hidden={showAddSubPackages}
          >
            Add SubPackages
          </Button>
          {showAddSubPackages && (
            <SubPackageDetailsForm
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              setShowAddSubPackages={setShowAddSubPackages}
              showAddSubPackages={showAddSubPackages}
            />
          )}
        </>
      )}

      {values?.intervalsConfig && values?.intervalsConfig?.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-baseline">
            <h5 className="mt-4">Sub Package Lists</h5>
            <p className="text-danger">
              Note:- Please &apos;Save&apos; before submitting if you have made any
              edits to the subpackages.
            </p>
          </div>

          <SubPackageListTable
            values={values}
            editRowId={editRowId}
            editValues={editValues}
            handleEditSubpackage={handleEditSubpackage}
            handleCancelEdit={handleCancelEdit}
            setFieldValue={setFieldValue}
            handleEditClick={handleEditClick}
            handleSubpackageSubmit={handleSubpackageSubmit}
          />
        </>
      )}

      <PackageFooterActions
        values={values}
        handleImportChange={handleImportChange}
        packageData={packageData}
        handleSubmit={handleSubmit}
        loading={loading}
        t={t}
        navigate={navigate}
      />

      {csvPlayerData && csvPlayerData?.length > 0 && (
        <PackageCSVUserTable
          uploadCSVLoading={uploadCSVLoading}
          csvPlayerData={csvPlayerData}
        />
      )}
    </Form>
  );
};

export default PackageFormContent;
