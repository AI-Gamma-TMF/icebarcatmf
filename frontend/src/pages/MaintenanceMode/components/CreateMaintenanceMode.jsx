import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Row, Form as BForm, Button } from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import Datetime from "react-datetime";
import { AdminRoutes } from "../../../routes";
import useMaintenanceModetlist from "../hooks/useMaintenanceModeList";
import { getDateTime, getDateTimeByYMD } from "../../../utils/dateFormatter";

const CreateMaintenanceMode = (tempData) => {
  const navigate = useNavigate();
  const editdata = tempData?.tempData;
  const {
    createMaintenanceMode,
    createloading,
    updateMaintenanceMode,
    updateMaintenanceLoading,
  } = useMaintenanceModetlist();

  const yesterday = new Date(Date.now() - 86400000);
  const validationSchema = Yup.object().shape({
    startTime: Yup.date()
      .min(new Date(), "Start time cannot be in the past")
      .required("Start time is required"),
    endTime: Yup.date()
      .required("End time is required")
      .min(Yup.ref("startTime"), "End time must be after start time"),
  });

  return (
    <Formik
      initialValues={{
        startTime: editdata ? editdata.startTime : "",
        endTime: editdata ? editdata.endTime : "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const utcValues = {
          startTime: values.startTime
            ? new Date(values.startTime).toISOString()
            : "",
          endTime: values.endTime ? new Date(values.endTime).toISOString() : "",
          maintenanceModeId: editdata?.maintenanceModeId || null,
        };

        if (editdata) {
          updateMaintenanceMode(utcValues);
        } else {
          createMaintenanceMode(utcValues);
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <h1>Scheduled Maintenance Mode</h1>

          <Row>
            <Col md={6} sm={12} className="mt-3">
              <BForm.Label>Maintenance Start Time</BForm.Label>
              <Datetime
                inputProps={{ placeholder: "MM-DD-YYYY HH:MM", readOnly: true }}
                dateFormat="MM-DD-YYYY"
                timeFormat={true}
                onChange={(e) => setFieldValue("startTime", e)}
                value={
                  values?.startTime
                    ? getDateTime(values?.startTime)
                    : values?.startTime
                }
                isValidDate={(e) => {
                  return (
                    e._d > yesterday ||
                    getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                  );
                }}
              />
              <ErrorMessage
                component="div"
                name="startTime"
                className="text-danger"
              />
            </Col>

            <Col md={6} sm={12} className="mt-3">
              <BForm.Label>Maintenance End Time</BForm.Label>
              <Datetime
                inputProps={{ placeholder: "MM-DD-YYYY HH:MM", readOnly: true }}
                dateFormat="MM-DD-YYYY"
                timeFormat={true}
                onChange={(e) => setFieldValue("endTime", e)}
                value={
                  values?.endTime
                    ? getDateTime(values?.endTime)
                    : values?.endTime
                }
                isValidDate={(e) => {
                  return (
                    e._d > yesterday ||
                    getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                  );
                }}
              />
              <ErrorMessage
                component="div"
                name="endTime"
                className="text-danger"
              />
            </Col>
          </Row>

          <div className="mt-4 d-flex justify-content-between align-items-center">
            <Button
              variant="warning"
              onClick={() => navigate(AdminRoutes.MaintenanceMode)}
              style={{ height: "40px", width: "100px" }}
            >
              Cancel
            </Button>

            <Button
              variant="success"
              type="submit"
              style={{ height: "40px", width: "100px" }}
              disabled={
                createloading ||
                updateMaintenanceLoading ||
                !(values?.endTime && values?.startTime)
              }
            >
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateMaintenanceMode;
