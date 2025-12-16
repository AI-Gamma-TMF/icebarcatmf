import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Table,
  Spinner,
  InputGroup,
  Accordion,
} from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  faCheckSquare,
  faEdit,
  faWindowClose,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminRoutes } from "../../routes";
import useMaintenanceModetlist from "./hooks/useMaintenanceModeList";
import Trigger from "../../components/OverlayTrigger";
import { getDateTime } from "../../utils/dateFormatter";
import { convertToTimeZone } from "../../utils/helper";
import PaginationComponent from "../../components/Pagination";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import { useMaintenanceModeAlertTime } from "../../reactQuery/hooks/customMutationHook";
import { toast } from "../../components/Toast";
import useCheckPermission from "../../utils/checkPermission";
import { InlineLoader } from "../../components/Preloader";
const MaintenanceMode = () => {
  const navigate = useNavigate();
  const {
    MaintenanceModeList,
    loading,
    // createMaintenanceMode,
    // createloading,
    // deleteMaintenanceMode,
    // setMaintenanceId,
    deleteLoading,
    timezoneOffset,
    limit,
    setLimit,
    page,
    setPage,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    totalPages,
    handleShow,
    handleYes,
    setShow,
    show,
    active,
    updateloading,
    deleteRibbonMode,
    deleteRibbonLoading,
    createRibbonMode,
    // createRibbonloading,
    ribbonfetch,
    ribbondata,
    ribbonloading,
  } = useMaintenanceModetlist();
  const { isHidden } = useCheckPermission();
  // const [isEditable, setIsEditable] = useState(false);
  // const [maintenanceModeTime, setMaintenanceModeTime] = useState(
  //   Number(MaintenanceModeList?.maintenanceAlertStartTime)
  // );
  // const [errorMessage, setErrorMessage] = useState("");
  const { mutate: _updateMaintenanceModeTime } = useMaintenanceModeAlertTime({
    onSuccess: (res) => {
      toast(res?.data?.message, "success");
    },
  });

  // const handleEditClick = () => {
  //   setIsEditable(true);
  // };
  // const handleUpdateClick = async () => {
  //   setErrorMessage("");

  //   const maintenanceMode = Number(maintenanceModeTime);
  //   if (!maintenanceMode) {
  //     setErrorMessage("Bonus Time should be greater than 0.");
  //     return;
  //   }

  //   // Validate the bonus time
  //   if (isNaN(maintenanceMode)) {
  //     setErrorMessage("Please enter a valid number.");
  //     return;
  //   }

  //   if (maintenanceMode <= 0) {
  //     setErrorMessage("Bonus Time should be greater than 0.");
  //     return;
  //   }
  //   try {
  //     const payload = {
  //       maintenanceAlertStartTime: maintenanceMode,
  //     };
  //     await updateMaintenanceModeTime(payload);
  //     setIsEditable(false);
  //   } catch (error) {
  //     console.error("Error updating bonus time:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (MaintenanceModeList?.maintenanceAlertStartTime !== undefined) {
  //     setMaintenanceModeTime(MaintenanceModeList?.maintenanceAlertStartTime);
  //   }
  // }, [MaintenanceModeList]);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleAccordionToggle = () => {
    setIsAccordionOpen((prev) => !prev);
    if (!isAccordionOpen) {
      ribbonfetch(); // Fetch data only when opening
    }
  };
  const [formValues, setFormValues] = useState({
    startMessage: "",
    time: "0",
    endMessage: "",
    isCancelActive: false,
  });
  useEffect(() => {
    setFormValues({
      startMessage: ribbondata ? ribbondata.startMessage : "",
      endMessage: ribbondata ? ribbondata.endMessage : "",
      time: ribbondata ? ribbondata.remainingTime : "0",
      isCancelActive: ribbondata ? ribbondata.isCancelActive : false,
    });
  }, [ribbondata]);

  const handleSubmit = (values) => {
    createRibbonMode(values);
  };
  const handleRemoveRibbon = () => {
    deleteRibbonMode({ isRibbon: false });
  };
  return (
    <>
      <Row>
        <Col className="col-10">
          <h3>Maintenance Mode</h3>
        </Col>
        <Col className="col-2 text-end ">
          <Button
            variant="success"
            className="f-right"
            size="sm"
            style={{ height: "40px", width: "100px" }}
            onClick={() => navigate(AdminRoutes.CreateMaintenanceMode)}
            hidden={isHidden({
              module: { key: "MaintenanceMode", value: "C" },
            })}
          >
            Create
          </Button>
        </Col>
      </Row>
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <Accordion.Header onClick={handleAccordionToggle}>
            Add Ribbon
          </Accordion.Header>
          {isAccordionOpen && (
            <Accordion.Body>
              {ribbonloading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Formik
                  enableReinitialize
                  initialValues={formValues}
                  // validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    handleChange,
                    setFieldValue,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <Form>
                      <div>
                        <Row>
                          <Col>
                            <BForm.Label>Start Message</BForm.Label>
                            <BForm.Control
                              type="text"
                              name="startMessage"
                              placeholder="Enter Start Message"
                              value={values.startMessage}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="startMessage"
                              component="small"
                              className="text-danger"
                            />
                          </Col>

                          <Col>
                            <BForm.Label>Timer(Minutes)</BForm.Label>
                            <InputGroup>
                              <BForm.Control
                                type="number"
                                name="time"
                                autoComplete="off"
                                value={values.time}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-", "."].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                              />
                            </InputGroup>
                            <ErrorMessage
                              name="time"
                              component="small"
                              className="text-danger"
                            />
                          </Col>

                          <Col>
                            <BForm.Label>End Message</BForm.Label>
                            <BForm.Control
                              type="text"
                              name="endMessage"
                              placeholder="Enter End Message"
                              value={values.endMessage}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="endMessage"
                              component="small"
                              className="text-danger"
                            />
                          </Col>
                        </Row>

                        <Row className="mt-2">
                          <Col>
                            <div className="col-12 col-lg-12">
                              <div
                                className="d-flex align-items-center rounded p-2 justify-content-between"
                                style={{ border: "0.0625rem solid #d1d7e0" }}
                              >
                                <p className="mb-0">Show Cancel Button</p>
                                <BForm.Check
                                  name="isCancelActive"
                                  checked={values.isCancelActive}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "isCancelActive",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </Col>
                          <Col></Col>
                          <Col className="d-flex justify-content-end gap-2">
                            <Button
                              variant="warning"
                              style={{ height: "40px", width: "100px" }}
                              onClick={handleRemoveRibbon}
                              disabled={
                                deleteRibbonLoading || ribbondata === null
                              } // Prevent multiple clicks
                              hidden={isHidden({
                                module: { key: "MaintenanceMode", value: "D" },
                              })}
                            >
                              {deleteRibbonLoading ? "Removing..." : "Remove"}
                            </Button>

                            <Button
                              variant="success"
                              onClick={handleSubmit}
                              disabled={
                                !(values?.startMessage || values?.endMessage) ||
                                ribbondata
                              }
                              style={{ height: "40px", width: "120px" }}
                              hidden={isHidden({
                                module: { key: "MaintenanceMode", value: "C" },
                              })}
                            >
                              Add Ribbon
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mt-4 d-flex justify-content-start">
                          <Col>
                            <h5>Ribbon Preview:</h5>
                          </Col>
                        </Row>

                        <pre
                          style={{
                            backgroundColor: "#f4f4f4",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "monospace",
                              fontSize: "16px",
                              color: "#333",
                              margin: 0,
                            }}
                          >
                            {values.startMessage?.trim() ||
                            values.time > 0 ||
                            values.endMessage?.trim() ? (
                              <>
                                {values.startMessage?.trim()}{" "}
                                {values.time > 0 ? `${values.time} ` : ""}
                                {values.endMessage?.trim()}
                              </>
                            ) : (
                              "No ribbon data available"
                            )}
                          </p>
                        </pre>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </Accordion.Body>
          )}
        </Accordion.Item>
      </Accordion>

      {
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
            <tr>
              <th> ID</th>
              <th>Start Time</th>

              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {MaintenanceModeList?.count > 0 ? (
                MaintenanceModeList?.rows?.map((data) => {
                  const { maintenanceModeId, startTime, endTime, isActive } =
                    data;
                  return (
                    <tr key={maintenanceModeId}>
                      <td>{maintenanceModeId}</td>

                      <td>
                        {getDateTime(
                          convertToTimeZone(startTime, timezoneOffset)
                        )}
                      </td>
                      <td>
                        {getDateTime(
                          convertToTimeZone(endTime, timezoneOffset)
                        )}
                      </td>
                      <td>
                        {isActive ? (
                          <span className="text-success">Active</span>
                        ) : (
                          <span className="text-danger">In-Active</span>
                        )}
                      </td>
                      <td>
                        <Trigger
                          message="Edit"
                          id={`${maintenanceModeId}_Edit`}
                        />
                        <Button
                          id={`${maintenanceModeId}_Edit`}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.EditMaintenanceMode.split(
                                ":"
                              ).shift()}${maintenanceModeId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "MaintenanceMode", value: "U" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>

                        <Trigger
                          message={"Delete"}
                          id={maintenanceModeId + "delete"}
                        />
                        <Button
                          id={maintenanceModeId + "delete"}
                          className="m-1"
                          disabled={isActive}
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteModal(maintenanceModeId)}
                          hidden={isHidden({
                            module: { key: "MaintenanceMode", value: "D" },
                          })}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>

                        {!isActive ? (
                          <>
                            <Trigger
                              message="Set Status Active"
                              id={maintenanceModeId + "active"}
                            />
                            <Button
                              id={maintenanceModeId + "active"}
                              className="m-1"
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleShow(maintenanceModeId, isActive)
                              }
                              hidden={isHidden({
                                module: { key: "MaintenanceMode", value: "T" },
                              })}
                            >
                              <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Trigger
                              message="Set Status In-Active"
                              id={maintenanceModeId + "inactive"}
                            />
                            <Button
                              id={maintenanceModeId + "inactive"}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleShow(maintenanceModeId, isActive)
                              }
                              hidden={isHidden({
                                module: { key: "MaintenanceMode", value: "T" },
                              })}
                            >
                              <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-danger text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      }

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateloading}
        />
      )}
      {MaintenanceModeList?.count !== 0 && (
        <PaginationComponent
          page={MaintenanceModeList?.count < page ? 1 : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default MaintenanceMode;
