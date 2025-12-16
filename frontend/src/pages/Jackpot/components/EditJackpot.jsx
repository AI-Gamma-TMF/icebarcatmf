import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { editJackpotSchema } from "../schema";
import useEditJackpot from "../hooks/useEditJackpot";
import { AdminRoutes } from "../../../routes";
import CurrentJackpotSummary from "./CurrentJackpotSummary";
import { formatNumber } from "../../../utils/helper";
import { getDateTimeinSeconds } from "../../../utils/dateFormatter";
import { InlineLoader } from "../../../components/Preloader";
import { isEqual } from "lodash";
import useCheckPermission from "../../../utils/checkPermission";

const EditJackpot = ({ jackpotStatus, jackpotDetail, runningJackpoTabs }) => {
  const navigate = useNavigate();
  const { jackpotId } = useParams();
  const { isHidden } = useCheckPermission()
  const {
    jackpotDetails,
    // updateJackpot,
    // loading,
    isInitialValues,
    updateLoading,
    handleEditJackpotSubmit,
    handleGenerateRNG,
    rngValues,
    rngLoading,
  } = useEditJackpot(jackpotDetail?.jackpotId || jackpotId, jackpotStatus);

  const normalizedDetail = {
    jackpotName: jackpotDetail?.jackpotName ?? "",
    maxTicketSize: Number(jackpotDetail?.maxTicketSize ?? 0),
    seedAmount: Number(jackpotDetail?.seedAmount ?? 0),
    entryAmount: Number(jackpotDetail?.entryAmount ?? 0),
    adminShare:
      jackpotDetail?.adminShare != null ? jackpotDetail.adminShare * 100 : 0,
    poolShare:
      jackpotDetail?.poolShare != null ? jackpotDetail.poolShare * 100 : 0,
    jackpotEstPool: Number(jackpotDetail?.jackpotEstPool ?? 0),
    jackpotEstRevenue: Number(jackpotDetail?.jackpotEstRevenue ?? 0),
    winningTicket: Number(jackpotDetail?.winningTicket ?? 0),
  };

  return (
    <>
      {!jackpotDetail && !rngValues && !jackpotDetails ? (
        <InlineLoader />
      ) : (
        <>
          <Row>
            <Col sm={12} lg={12} xl={3}>
              <h5>{jackpotStatus ? jackpotStatus : "Edit"} Jackpot </h5>
            </Col>
          </Row>
          <div
            className="running-jackpot-detail"
            style={{ background: "#fff" }}
          >
            {jackpotStatus && (
              <>
                <div
                  className="w-100  px-2"
                  style={{ borderRight: "1px solid #000" }}
                >
                  <h5
                    className="text-primary"
                    style={{ fontSize: "16px", margin: "0" }}
                  >
                    <span>
                      Jackpot Est. Pool :{" "}
                      <span style={{ color: "#00A30B" }}>
                        {formatNumber(
                          rngValues?.jackpotEstPool ??
                          jackpotDetail?.jackpotEstPool ??
                          jackpotDetails?.jackpotEstPool ??
                          0
                        )}
                      </span>
                    </span>
                  </h5>
                </div>
                <div
                  className="w-100 px-2 "
                  style={{ borderRight: "1px solid #000" }}
                >
                  <h5
                    className="text-primary text-start text-lg-center"
                    style={{
                      fontSize: "16px",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {" "}
                    <span>
                      Jackpot Est. Revenue :{" "}
                      <span style={{ color: "#00A30B" }}>
                        {" "}
                        {formatNumber(
                          rngValues?.jackpotEstRevenue ??
                          jackpotDetail?.jackpotEstRevenue ??
                          jackpotDetails?.jackpotEstRevenue ??
                          0
                        )}
                      </span>
                    </span>{" "}
                  </h5>
                </div>
              </>
            )}
            {jackpotStatus && (
              <div
                className="w-100 px-2"
                style={{ borderRight: "1px solid #000" }}
              >
                <h5
                  className="text-primary text-start text-lg-center"
                  style={{
                    fontSize: "16px",
                    margin: "0",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>
                    Winning Ticket Id:{" "}
                    <span style={{ color: "#00A30B" }}>
                      {formatNumber(
                        rngValues?.winningTicket ?? jackpotDetail?.winningTicket
                      )}
                    </span>
                  </span>
                </h5>
              </div>
            )}

            {jackpotStatus === "Running" && runningJackpoTabs && (
              <div className="w-100 px-2">
                <h5 className="text-start text-lg-end"
                  style={{
                    fontSize: "16px",
                    margin: "0",
                    whiteSpace: "nowrap",
                  }}>
                  <span>
                    Start Date:{" "}
                    <span style={{ color: "#00A30B" }}>
                      {getDateTimeinSeconds(jackpotDetail?.startDate)}
                    </span>
                  </span>
                </h5>
              </div>
            )}
          </div>
          <Row>
            {jackpotStatus === "Running" && runningJackpoTabs && (
              <Col>
                <CurrentJackpotSummary runningJackpoTabs={runningJackpoTabs} />
              </Col>
            )}
          </Row>
          <Row>
            <Formik
              enableReinitialize={isInitialValues}
              initialValues={{
                jackpotName:
                  jackpotDetail?.jackpotName ??
                  jackpotDetails?.jackpotName ??
                  "",

                maxTicketSize: Number(
                  rngValues?.maxTicketSize ??
                  jackpotDetail?.maxTicketSize ??
                  jackpotDetails?.maxTicketSize ??
                  0
                ),

                seedAmount: Number(
                  rngValues?.seedAmount ??
                  jackpotDetail?.seedAmount ??
                  jackpotDetails?.seedAmount ??
                  0
                ),

                entryAmount: Number(
                  rngValues?.entryAmount ??
                  jackpotDetail?.entryAmount ??
                  jackpotDetails?.entryAmount ??
                  0
                ),

                adminShare:
                  rngValues?.adminShare != null
                    ? Number(rngValues.adminShare)
                    : jackpotDetail?.adminShare != null
                      ? jackpotDetail.adminShare * 100
                      : jackpotDetails?.adminShare != null
                        ? jackpotDetails.adminShare * 100
                        : 0,

                poolShare:
                  rngValues?.poolShare != null
                    ? Number(rngValues.poolShare)
                    : jackpotDetail?.poolShare != null
                      ? jackpotDetail.poolShare * 100
                      : jackpotDetails?.poolShare != null
                        ? jackpotDetails.poolShare * 100
                        : 0,

                jackpotEstPool:
                  rngValues?.jackpotEstPool ??
                  jackpotDetail?.jackpotEstPool ??
                  jackpotDetails?.jackpotEstPool ??
                  0,

                jackpotEstRevenue:
                  rngValues?.jackpotEstRevenue ??
                  jackpotDetail?.jackpotEstRevenue ??
                  jackpotDetails?.jackpotEstRevenue ??
                  0,
                winningTicket:
                  rngValues?.winningTicket ?? jackpotDetail?.winningTicket,
              }}
              validationSchema={editJackpotSchema}
              onSubmit={(values) => {
                handleGenerateRNG(values)
                handleEditJackpotSubmit(values)
           }   }
            >
              {({
                values,
                handleChange,
                handleSubmit,
                handleBlur,
              }) => (
                <Form>
                  <Row className="mt-3">
                    <Col lg={3} sm={6} className="mt-1">
                      <BForm.Label>
                        Jackpot Name <span className="text-danger">*</span>
                      </BForm.Label>
                      <BForm.Control
                        type="text"
                        name="jackpotName"
                        value={values.jackpotName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={
                          jackpotDetail?.status === 1 ||
                          jackpotDetails?.status === 1||
                          isHidden({ module: { key: 'Jackpot', value: 'U' } })
                        }
                        placeholder="Enter Jackpot Name"
                      />
                      <ErrorMessage
                        name="jackpotName"
                        component="div"
                        className="text-danger"
                      />
                    </Col>
                    <Col lg={3} sm={6} className="mt-1">
                      <BForm.Label>
                        Max Ticket Size <span className="text-danger">*</span>
                      </BForm.Label>
                      <BForm.Control
                        type="number"
                        name="maxTicketSize"
                        placeholder="Enter Max Ticket Size"
                        value={values.maxTicketSize}
                        // onChange={handleChange}
                        onChange={(e) => {
                          handleChange(e);
                          const updatedValues = {
                            ...values,
                            [e.target.name]: e.target.value,
                          };
                          handleGenerateRNG(updatedValues);
                        }}
                        onBlur={handleBlur}
                        disabled={
                          jackpotDetail?.status === 1 ||
                          jackpotDetails?.status === 1||
                          isHidden({ module: { key: 'Jackpot', value: 'U' } })
                        }
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                      />
                      <ErrorMessage
                        name="maxTicketSize"
                        component="div"
                        className="text-danger"
                      />
                    </Col>
                    <Col lg={3} sm={6} className="mt-1">
                      <BForm.Label>
                        Seed Amount <span className="text-danger">*</span>
                      </BForm.Label>
                      <BForm.Control
                        type="number"
                        name="seedAmount"
                        placeholder="Enter Seed Amount"
                        value={values.seedAmount}
                        // onChange={handleChange}
                        onChange={(e) => {
                          handleChange(e);
                          const updatedValues = {
                            ...values,
                            [e.target.name]: e.target.value,
                          };
                          handleGenerateRNG(updatedValues);
                        }}
                        onBlur={handleBlur}
                        disabled={
                          jackpotDetail?.status === 1 ||
                          jackpotDetails?.status === 1||
                          isHidden({ module: { key: 'Jackpot', value: 'U' } })
                        }
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                      />
                      <ErrorMessage
                        name="seedAmount"
                        component="div"
                        className="text-danger"
                      />
                    </Col>
                    <Col lg={3} sm={6} className="mt-1">
                      <BForm.Label>
                        Entry Amount <span className="text-danger">*</span>
                      </BForm.Label>
                      <BForm.Control
                        type="number"
                        name="entryAmount"
                        placeholder="Enter Entry Amount"
                        value={values.entryAmount}
                        // onChange={handleChange}
                        onChange={(e) => {
                          handleChange(e);
                          const updatedValues = {
                            ...values,
                            [e.target.name]: e.target.value,
                          };
                          handleGenerateRNG(updatedValues);
                        }}
                        disabled={
                          jackpotDetail?.status === 1 ||
                          jackpotDetails?.status === 1||
                          isHidden({ module: { key: 'Jackpot', value: 'U' } })
                        }
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="entryAmount"
                        component="div"
                        className="text-danger"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={3} sm={6} className="mt-1">
                      <BForm.Label>
                        Admin Share (%) <span className="text-danger">*</span>
                      </BForm.Label>
                      <BForm.Control
                        type="number"
                        name="adminShare"
                        placeholder="Enter Admin Share in %"
                        value={values.adminShare}
                        onChange={handleChange}
                        
                        onBlur={handleBlur}
                        disabled={
                          jackpotDetail?.status === 1 ||
                          jackpotDetails?.status === 1||
                          isHidden({ module: { key: 'Jackpot', value: 'U' } })
                        }
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        max="100"
                      />
                      <ErrorMessage
                        name="adminShare"
                        component="div"
                        className="text-danger"
                      />
                    </Col>
                    <Col lg={3} sm={6} className="mt-1">
                      <BForm.Label>
                        Pool Share (%) <span className="text-danger">*</span>
                      </BForm.Label>
                      <BForm.Control
                        type="number"
                        name="poolShare"
                        placeholder="Enter Pool Share in %"
                        value={values.poolShare}
                        onChange={handleChange}
                       
                        disabled={
                          jackpotDetail?.status === 1 ||
                          jackpotDetails?.status === 1 ||   
                          isHidden({ module: { key: 'Jackpot', value: 'U' } })
                        }
                        onBlur={handleBlur}
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        max="100"
                      />
                      <ErrorMessage
                        name="poolShare"
                        component="div"
                        className="text-danger"
                      />
                    </Col>
                  </Row>
                  <div
                    className={`${!jackpotStatus
                        ? "justify-content-between"
                        : "justify-content-end"
                      } mt-4 d-flex  align-items-center`}
                  >
                    {!jackpotStatus && (
                      <Button
                        variant="warning"
                        onClick={() => navigate(AdminRoutes.Jackpot)}
                      >
                        Cancel
                      </Button>
                    )}

                    <div>
                      {jackpotStatus === "Upcoming" && (
                        <Button
                          className="me-1"
                          onClick={() => handleGenerateRNG(values)}
                          disabled={
                            !values?.maxTicketSize ||
                            !values?.seedAmount ||
                            !values?.entryAmount ||
                            !values?.adminShare ||
                            !values?.poolShare ||
                            rngLoading
                          }
                          hidden={isHidden({ module: { key: 'Jackpot', value: 'U' } })}
                        >
                          Generate RNG
                          {rngLoading && (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      )}

                      {!(
                        jackpotDetail?.status === 1 ||
                        jackpotDetails?.status === 1
                      ) && (
                          <Button
                            onClick={handleSubmit}
                            disabled={
                              updateLoading || isEqual(values, normalizedDetail)
                            }
                            hidden={isHidden({ module: { key: 'Jackpot', value: 'U' } })}
                          >
                            Save
                            {updateLoading && (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            )}
                          </Button>
                        )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Row>
        </>
      )}
    </>
  );
};

export default EditJackpot;
