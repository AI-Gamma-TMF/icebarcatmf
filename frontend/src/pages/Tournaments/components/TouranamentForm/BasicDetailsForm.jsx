// BasicDetailsForm.js
import React from "react";
import { Col, Row, Form as BForm, Button } from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import { ErrorMessage } from "formik";

const BasicDetailsForm = ({
  t,
  values,
  setFieldValue,
  handleBlur,
  handleFileChange,
  handleCancelImage,
  imageDimensionError,
  tournamentData,
  details,
  fileInputRef,
  yesterday,
  getDateTime,
  getDateTimeByYMD,
  TOURNAMENT_STATUS,
  setFieldTouched,
  isDuplicate,
}) => {
  return (
    <Row className="mt-0">
      <Col md={12} sm={12} className="mt-3">
        {/* Category Name Form */}
        <div className="">
          <BForm.Label>
            {t("tournaments.inputField.categoryName.label")}
            <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Control
            type="text"
            name="title"
            placeholder={t("tournaments.inputField.categoryName.placeholder")}
            value={values?.title}
            onChange={(e) => {
              const val = e?.target?.value?.trim() ? e.target.value : "";
              setFieldValue("title", val);
            }}
            onBlur={(e) => {
              handleBlur(e);
              setFieldTouched("title", true);
            }} // Ensure field is touched
            autoComplete="off"
            disabled={details}
          />
          <ErrorMessage component="div" name="title" className="text-danger" />
        </div>

        {/* Description Form */}
        <div className="mt-4">
          <BForm.Label>
            {t("tournaments.inputField.description.label")}
            <span className="text-danger"> *</span>
          </BForm.Label>
          <BForm.Control
            type="text"
            as="textarea"
            rows="3"
            name="description"
            placeholder={t("tournaments.inputField.description.placeholder")}
            value={values?.description || ""}
            onChange={(e) => {
              const val = e?.target?.value?.trim() ? e.target.value : "";
              setFieldValue("description", val);
            }}
            onBlur={handleBlur}
            disabled={details}
          />
          <ErrorMessage
            component="div"
            name="description"
            className="text-danger"
          />
        </div>

        {/* Thumbnail Form */}
        <div className="">
          <BForm.Label>Thumbnail</BForm.Label>
          <BForm.Control
            ref={fileInputRef}
            accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/webp"
            type="file"
            name="tournamentImg"
            onChange={(event) =>
              handleFileChange(event, setFieldValue, "tournamentImg")
            }
            disabled={details}
          />
          {values?.tournamentImg && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(values?.tournamentImg)}
                alt="Not found"
                style={{
                  width: "200px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
              <Button
                onClick={() => {
                  handleCancelImage(setFieldValue);
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {!values?.tournamentImg && tournamentData?.imageUrl && (
            <img
              alt="not found"
              style={{
                width: "200px",
                height: "100px",
                objectFit: "cover",
              }}
              src={tournamentData?.imageUrl}
            />
          )}

          {imageDimensionError ? (
            <small style={{ color: "red" }}>
              Image dimensions must be equal to 582*314 pixels.
            </small>
          ) : (
            <ErrorMessage
              component="div"
              name="tournamentImg"
              className="text-danger"
            />
          )}
        </div>
      </Col>

      <Col md={6} sm={12} className="mt-3">
        <BForm.Label>
          {t("tournaments.inputField.startDate")}{" "}
          <span className="text-danger">*</span>
        </BForm.Label>
        <Datetime
          inputProps={{
            placeholder: "MM-DD-YYYY HH:MM",
            disabled:
              !isDuplicate &&
              (details ||
                String(tournamentData?.status) ===
                  String(TOURNAMENT_STATUS.ON_GOING)),
            readOnly: true,
          }}
          dateFormat="MM-DD-YYYY"
          onChange={(e) => {
            setFieldValue("startDate", e);
          }}
          value={
            values?.startDate
              ? getDateTime(values?.startDate)
              : values?.startDate
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
          name="startDate"
          className="text-danger"
        />
      </Col>

      <Col md={6} sm={12} className="mt-3">
        <BForm.Label>
          {t("tournaments.inputField.endDate")}{" "}
          <span className="text-danger">*</span>
        </BForm.Label>
        <Datetime
          inputProps={{
            placeholder: "MM-DD-YYYY HH:MM",
            disabled: details,
            readOnly: true,
          }}
          dateFormat="MM-DD-YYYY"
          onChange={(e) => {
            setFieldValue("endDate", e);
          }}
          value={
            values?.endDate ? getDateTime(values?.endDate) : values?.endDate
          }
          isValidDate={(e) => {
            return (
              e._d > yesterday ||
              getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
            );
          }}
          timeFormat={true}
        />
        <ErrorMessage component="div" name="endDate" className="text-danger" />
      </Col>
    </Row>
  );
};

export default BasicDetailsForm;
