import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Row, Form as BForm, Button, Card } from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import Datetime from "react-datetime";
import { AdminRoutes } from "../../../routes";
import useMaintenanceModetlist from "../hooks/useMaintenanceModeList";
import { getDateTime, getDateTimeByYMD } from "../../../utils/dateFormatter";
import "../maintenanceModeForm.scss";

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
          <div className="maintenance-mode-form dashboard-typography">
            <Row className="align-items-center mb-2">
              <Col xs={12}>
                <h3 className="maintenance-mode-form__title">Scheduled Maintenance Mode</h3>
                <div className="maintenance-mode-form__subtitle">
                  Set a start and end time for scheduled maintenance.
                </div>
              </Col>
            </Row>

            <Card className="maintenance-mode-form__card p-3">
              <Row className="g-3">
                <Col md={6} sm={12}>
                  <BForm.Label>Maintenance Start Time</BForm.Label>
                  <Datetime
                    inputProps={{ placeholder: "MM-DD-YYYY HH:MM", readOnly: true }}
                    dateFormat="MM-DD-YYYY"
                    timeFormat={true}
                    onChange={(e) => setFieldValue("startTime", e)}
                    value={values?.startTime ? getDateTime(values?.startTime) : values?.startTime}
                    isValidDate={(e) =>
                      e._d > yesterday || getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                    }
                  />
                  <ErrorMessage component="div" name="startTime" className="text-danger" />
                </Col>

                <Col md={6} sm={12}>
                  <BForm.Label>Maintenance End Time</BForm.Label>
                  <Datetime
                    inputProps={{ placeholder: "MM-DD-YYYY HH:MM", readOnly: true }}
                    dateFormat="MM-DD-YYYY"
                    timeFormat={true}
                    onChange={(e) => setFieldValue("endTime", e)}
                    value={values?.endTime ? getDateTime(values?.endTime) : values?.endTime}
                    isValidDate={(e) =>
                      e._d > yesterday || getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                    }
                  />
                  <ErrorMessage component="div" name="endTime" className="text-danger" />
                </Col>
              </Row>

              <div className="maintenance-mode-form__actions mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate(AdminRoutes.MaintenanceMode)}
                  className="maintenance-mode-form__btn"
                >
                  Cancel
                </Button>

                <Button
                  variant="success"
                  type="submit"
                  className="maintenance-mode-form__btn maintenance-mode-form__btn--primary"
                  disabled={createloading || updateMaintenanceLoading || !(values?.endTime && values?.startTime)}
                >
                  Submit
                </Button>
              </div>
            </Card>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateMaintenanceMode;
