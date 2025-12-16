import React from "react";
import { Row, Col } from "@themesberg/react-bootstrap";
import PackageDateRangePicker from "./PackageDateRangePicker";
import PackageSpecialScheduledToggle from "./PackageSpecialScheduledToggle";
import PackageActiveToggle from "./PackageActiveToggle";
import PackageImagePreview from "../PackageImages/PackageImagePreview";

const PackageFormToggles = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  t,
  isEdit,
  packageData,
  errors,
}) => {
  return (
    <>
      <div className="container-fluid">
        <Row className="mt-3 justify-content-between">
          <Col>
            {!values?.welcomePurchaseBonusApplicable &&
              !values?.isLadderPackage && (
                <PackageSpecialScheduledToggle
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  t={t}
                  setFieldValue={setFieldValue}
                  packageData={packageData}
                />
              )}

            {!values.isScheduledPackage && (
              <PackageActiveToggle
                values={values}
                handleChange={handleChange}
                handleBlur={handleBlur}
                t={t}
                isEdit={isEdit}
              />
            )}
          </Col>
          <Col>
            <PackageImagePreview
              values={values}
              setFieldValue={setFieldValue}
              packageData={packageData}
              t={t}
              errors={errors}
            />
          </Col>
        </Row>
        <div>
          {!values?.welcomePurchaseBonusApplicable &&
            values?.isScheduledPackage && (
              <PackageDateRangePicker
                values={values}
                packageData={packageData}
                setFieldValue={setFieldValue}
                t={t}
              />
            )}
        </div>
      </div>
    </>
  );
};

export default PackageFormToggles;
