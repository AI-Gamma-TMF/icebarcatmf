import React from "react";
import {
  Row,
  OverlayTrigger,
  Tooltip,
  Button,
  Col,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import Datetime from "react-datetime";
import {
  addHours,
  getDateTime,
  getDateTimeByYMD,
} from "../../../../../../utils/dateFormatter";

const PackageDateRangePicker = ({ values, packageData, setFieldValue, t }) => {
  const yesterday = new Date(Date.now() - 86400000);

  const handleAddHours = (setFieldValue, validFrom, hoursToAdd) => {
    validFrom =
      validFrom === null || validFrom === undefined
        ? new Date()
        : new Date(validFrom);
    const updatedValidTill = addHours(validFrom, hoursToAdd);
    setFieldValue("validTill", updatedValidTill);
  };

  const shouldDisableDate = (field) => {
    const isPurchaseExists = packageData?.claimedCount > 0;
    const isPackageActiveWithNoPurchase =
      packageData?.claimedCount === 0 && packageData?.isActive;
    const isFieldFrozen = packageData?.[`freeze${field}`];

    return (isPurchaseExists || isPackageActiveWithNoPurchase) && isFieldFrozen;
  };

  return (
    <>
      <Row>
        <Col xs={12} md={4} className="mb-3">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-valid-from">
                {packageData?.freezeValidFrom
                  ? "Validity start date is locked."
                  : "Starts Validity"}
              </Tooltip>
            }
          >
            <div className="d-flex flex-column align-items-start justify-content-start">
              <h5 style={{ fontSize: "18px" }}>
                Valid From
                <span className="text-danger"> *</span>
              </h5>
              <div className="relative flex-grow-1 w-100">
                <div className="">
                  <Datetime
                    inputProps={{
                      placeholder: "MM-DD-YYYY HH:MM",
                      readOnly: true,
                      disabled:
                        packageData?.freezeValidFrom &&
                        shouldDisableDate("ValidFrom"),
                      style: {
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        width: "100%",
                      },
                    }}
                    dateFormat="MM-DD-YYYY"
                    onChange={(e) => {
                      setFieldValue("validFrom", e);
                    }}
                    value={
                      values.validFrom
                        ? getDateTime(values.validFrom)
                        : values.validFrom
                    }
                    isValidDate={(e) => {
                      return (
                        e._d > yesterday ||
                        getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                      );
                    }}
                    timeFormat={true}
                  />
                  <ErrorMessage
                    component="div"
                    name="validFrom"
                    className="text-danger"
                  />
                </div>
              </div>
            </div>
          </OverlayTrigger>
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-valid-until">
                {packageData?.freezeValidTill
                  ? "Validity end date is locked."
                  : "Ends Validity"}
              </Tooltip>
            }
          >
            <div className="d-flex flex-column align-items-start justify-content-start">
              <h5 style={{ fontSize: "18px" }}>
                Valid Until
                <span className="text-danger"> *</span>
              </h5>
              <div className="relative flex-grow-1 w-100">
                <div className="">
                  <Datetime
                    inputProps={{
                      placeholder: "MM-DD-YYYY HH:MM",
                      readOnly: true,
                      disabled:
                        packageData?.freezeValidTill &&
                        shouldDisableDate("ValidTill"),
                      style: {
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        width: "100%",
                      },
                    }}
                    dateFormat="MM-DD-YYYY"
                    onChange={(e) => {
                      setFieldValue("validTill", e);
                    }}
                    value={
                      values.validTill
                        ? getDateTime(values.validTill)
                        : values.validTill
                    }
                    isValidDate={(e) => {
                      return (
                        e._d > yesterday ||
                        getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                      );
                    }}
                    timeFormat={true}
                  />
                  <ErrorMessage
                    component="div"
                    name="validTill"
                    className="text-danger"
                  />
                </div>
              </div>
            </div>
          </OverlayTrigger>
        </Col>
        <Col xs={12} md={2} className="mb-3">
          <Button
            onClick={() => handleAddHours(setFieldValue, values.validFrom, 12)}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 6px",
              border: "none",
              fontWeight: 500,
              display: "flex",
              marginTop: "30px",
              alignItems: "center",
              gap: "4px",
              width: "100%",
              whiteSpace: "noWrap",
              justifyContent: "center",
            }}
          >
            <i className="far fa-clock" />
            {t("createPackage.inputFields.12Hour")}
          </Button>
        </Col>
        <Col xs={12} md={2} className="mb-3">
          <Button
            onClick={() => handleAddHours(setFieldValue, values.validFrom, 24)}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 6px",
              border: "none",
              marginTop: "30px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              width: "100%",
              whiteSpace: "noWrap",
              justifyContent: "center",
            }}
          >
            <i className="far fa-clock" />
            {t("createPackage.inputFields.24Hour")}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PackageDateRangePicker;
