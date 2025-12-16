import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Table,
  Card,
  Form,
} from "@themesberg/react-bootstrap";
import { AdminRoutes } from "../../../routes";
import useFreeSpinListing from "./hooks/useFreeSpinListing";
import useCheckPermission from "../../../utils/checkPermission";
import { getDateTime } from "../../../utils/dateFormatter";
import { convertToTimeZone, formatNumber } from "../../../utils/helper";
import Trigger from "../../../components/OverlayTrigger";
import {
  faEdit,
  faEye,
  faTrash,
  faRedoAlt,
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import PaginationComponent from "../../../components/Pagination";
import "./freespin.scss";
import { InlineLoader } from "../../../components/Preloader";
import { useQuery } from "@tanstack/react-query";
import { getFreeSpinDashboard } from "../../../utils/apiCalls";
import { tableHeaders } from "./constant";

const FreeSpinGames = () => {
  const navigate = useNavigate();
  const { isHidden } = useCheckPermission();
  const {
    FreeSpingList,
    listLoading,
    timezoneOffset,
    SpinRefetch,
    totalPages,
    setPage,
    setLimit,
    limit,
    page,
    search,
    setSearch,
    statusSearch,
    setStatusSearch,
    searchRound,
    setSearchRound,
    searchId,
    setSearchId,
    dashboardData,
    statusShow,
    setStatusShow,
    itemToUpdate,
    setItemToUpdate,
    handleOnSubmit,
    cancelLoading,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    selected,
    providerSearch,
    setProviderSearch,
  } = useFreeSpinListing();

  const displayValue = (value, isDecimal = false, decimalPlaces = null) => {
    if (value === null || value === undefined)
      return decimalPlaces ? `0.${"0".repeat(decimalPlaces)}` : "0";
    return formatNumber(value, { isDecimal, decimalPlaces });
  };

  const handleActionClick = (freeSpinId) => {
    setItemToUpdate(freeSpinId);
    setStatusShow(true);
  };
  return (
    <>
      <Row className="align-items-center justify-content-between mb-3">
        <Col>
          <h3>Games Free Spin</h3>
        </Col>

        <Col xs="auto">
          <Button
            variant="success"
            size="md"
            className="px-3 py-2"
            onClick={() => {
              navigate(AdminRoutes.FreeSpinGames);
            }}
            hidden={isHidden({
              module: { key: "CasinoManagement", value: "C" },
            })}
          >
            Create Free Spin
          </Button>
        </Col>
      </Row>
      <Card className="p-3">
        <Row className="g-3">
          <Col xs={4} md={2}>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalWinSc, true, 2)}
                </h5>
                <p>Total Win SC</p>
              </div>
              <img src="/spin-total-win-sc.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
          <Col xs={4} md={2}>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalWinGc, true, 2)}
                </h5>
                <p>Total Win GC</p>
              </div>
              <img src="/spin-total-win-gc.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
          <Col xs={4} md={2}>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalUsers, true, 2)}
                </h5>
                <p>Total Users</p>
              </div>
              <img src="/spin-total-users.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
          <Col xs={4} md={2}>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalPending, true, 2)}
                </h5>
                <p>Total Pending</p>
              </div>
              <img src="/spin-total-pending.png" alt="Free Spin Amount" />
            </Card>
          </Col>
          <Col xs={4} md={2}>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalExpired, true, 2)}
                </h5>
                <p>Total Expired</p>
              </div>
              <img src="/spin-total-expired.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
          <Col xs={4} md={2}>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(
                    dashboardData?.totalAmountGivenByAdminGC,
                    true,
                    2
                  )}
                </h5>
                <p>Total Given GC</p>
              </div>
              <img src="/spin-total-given-gc.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
        </Row>
        <Row className="g-3 mt-2">
          <Col>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(
                    dashboardData?.totalAmountGivenByAdminSC,
                    true,
                    2
                  )}
                </h5>
                <p>Total Given SC</p>
              </div>
              <img src="/spin-total-given-sc.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
          <Col>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalAttachedGrant, true, 2)}
                </h5>
                <p>Total Attached Grant</p>
              </div>
              <img
                src="/spin-total-attached-grant.png"
                alt="Free Spin Amount"
              />
            </Card>
          </Col>{" "}
          <Col>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalCancelled, true, 2)}
                </h5>
                <p>Total Cancelled</p>
              </div>
              <img src="/spin-total-cancelled.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
          <Col>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalClaimed, true, 2)}
                </h5>
                <p>Total Claimed</p>
              </div>
              <img src="/spin-total-claimed.png" alt="Free Spin Amount" />
            </Card>
          </Col>
          <Col>
            <Card className="spin-card">
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(dashboardData?.totalDirectGrant, true, 2)}
                </h5>
                <p>Total Direct Grant</p>
              </div>
              <img src="/spin-total-direct-grant.png" alt="Free Spin Amount" />
            </Card>
          </Col>{" "}
        </Row>
      </Card>

      <Row className="align-items-center mt-4 mb-4">
        <Col lg={2} className="mb-0">
          <Form.Label>Search by Title</Form.Label>
          <Form.Control
            type="search"
            value={search}
            placeholder="Search"
            onChange={(event) => {
              setPage(1);
              setSearch(
                event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
              );
            }}
          />
        </Col>

        <Col lg={2} className="mb-0">
          <Form.Label>Search by Provider</Form.Label>
          <Form.Control
            type="search"
            value={providerSearch}
            placeholder="Search"
            onChange={(event) => {
              setPage(1);
              setProviderSearch(
                event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
              );
            }}
          />
        </Col>

        <Col lg={2} className="mb-0">
          <Form.Label>Search by Freespin Id</Form.Label>
          <Form.Control
            type="number"
            value={searchId}
            placeholder="Search"
            onPaste={(e) => e.preventDefault()} // Disable paste
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onChange={(event) => {
              setPage(1);
              setSearchId(
                event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
              );
            }}
          />
        </Col>

        <Col lg={2} className="mb-0">
          <Form.Label>Search by Freespin Round</Form.Label>
          <Form.Control
            type="number"
            value={searchRound}
            placeholder="Search"
            onPaste={(e) => e.preventDefault()} // Disable paste
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onChange={(event) => {
              setPage(1);
              setSearchRound(
                event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
              );
            }}
          />
        </Col>

        <Col lg={2} className="mb-0">
          <Form.Label>Status</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setStatusSearch(e.target.value);
            }}
            value={statusSearch}
          >
            <option hidden>Select Status</option>
            <option value="0">Upcoming</option>
            <option value="1">Ongoing</option>
            <option value="2">Completed</option>
            <option value="3">Cancelled</option>
          </Form.Select>
        </Col>

        <Col lg={2} className="d-flex align-items-center gap-2 mt-3 mb-0 pt-3">
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            onClick={() => {
              setProviderSearch("");
              setSearch("");
              setSearchId("");
              setSearchRound("");
              setLimit(15);
              setPage(1);
              setStatusSearch("");
            }}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>
        </Col>
      </Row>

      <Card className="p-2">
        <h5 className="mb-0 pt-2">Free spin report</h5>
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
                {tableHeaders.map((h) => (
                  <th
                    key={h.value}
                    onClick={() => h.value !== "" && setOrderBy(h.value)}
                    style={{
                      cursor: "pointer",
                    }}
                    className={selected(h) ? "border-3 border border-blue" : ""}
                  >
                    {h.labelKey}{" "}
                    {selected(h) &&
                      (sort === "asc" ? (
                        <FontAwesomeIcon
                          style={over ? { color: "red" } : {}}
                          icon={faArrowCircleUp}
                          onClick={() => setSort("desc")}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          style={over ? { color: "red" } : {}}
                          icon={faArrowCircleDown}
                          onClick={() => setSort("asc")}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ))}
                  </th>
                ))}
              </tr>
            </thead>

            {listLoading ? (
              <tr>
                <td colSpan={10} className="text-center">
                  {/* <InlineLoader /> */}
                </td>
              </tr>
            ) : (
              <tbody>
                {FreeSpingList?.count > 0 ? (
                  FreeSpingList?.rows?.map((data) => {
                    const {
                      freeSpinId,
                      startDate,
                      endDate,
                      status,
                      masterCasinoProviderName,
                      masterCasinoGameName,
                      freeSpinAmount,
                      freeSpinRound,
                      coinType,
                      freeSpinType,
                      title,
                    } = data;
                    return (
                      <tr key={freeSpinId}>
                        <td>{freeSpinId}</td>
                        <td>{title}</td>
                        <td>{masterCasinoProviderName}</td>
                        <td>{masterCasinoGameName}</td>
                        <td>{displayValue(freeSpinAmount, true, 2)}</td>
                        <td>{freeSpinRound}</td>
                        <td>{coinType}</td>
                        <td>{freeSpinType}</td>
                        <td>
                          {startDate
                            ? getDateTime(
                                convertToTimeZone(startDate, timezoneOffset)
                              )
                            : "-"}
                        </td>
                        <td>
                          {endDate
                            ? getDateTime(
                                convertToTimeZone(endDate, timezoneOffset)
                              )
                            : "-"}
                        </td>

                        <td>
                          {status == "0" ? (
                            <span className="text-warning">Upcoming</span>
                          ) : status == "1" ? (
                            <span className="text-success">Ongoing</span>
                          ) : status == "2" ? (
                            <span className="text-muted">Completed</span>
                          ) : status == "3" ? (
                            <span className="text-danger">Cancelled</span>
                          ) : (
                            <span>----</span>
                          )}
                        </td>
                        <td>
                          <Trigger message={"View"} id={freeSpinId + "view"} />
                          <Button
                            id={freeSpinId + "view"}
                            className="m-1"
                            size="sm"
                            variant="info"
                            onClick={() =>
                              navigate(
                                `${AdminRoutes.viewFreeSpin
                                  .split(":")
                                  .shift()}${freeSpinId}`
                              )
                            }
                            hidden={isHidden({
                              module: { key: "CasinoManagement", value: "R" },
                            })}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Trigger message="Edit" id={`${freeSpinId}_Edit`} />

                          <Button
                            id={`${freeSpinId}_Edit`}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              navigate(
                                `${AdminRoutes.EditFreeSpin.split(
                                  ":"
                                ).shift()}${freeSpinId}`
                              )
                            }
                            disabled={status == 2 || status == 3}
                            hidden={isHidden({
                              module: { key: "CasinoManagement", value: "U" },
                            })}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          <Trigger
                            message={"Cancel Free Spin"}
                            id={freeSpinId + "delete"}
                          />
                          <Button
                            id={freeSpinId + "delete"}
                            className="m-1"
                            size="sm"
                            variant="danger"
                            onClick={() => handleActionClick(freeSpinId)}
                            disabled={status == 2 || status == 3}
                            hidden={isHidden({
                              module: { key: "CasinoManagement", value: "D" },
                            })}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="text-danger text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </Table>
        }
        {listLoading && <InlineLoader />}

        {/* {show && (
              <ConfirmationModal
                setShow={setShow}
                show={show}
                handleYes={handleYes}
                active={active}
                loading={updateloading}
              />
            )} */}

        {FreeSpingList?.count !== 0 && (
          <PaginationComponent
            page={FreeSpingList?.count < page ? 1 : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}

        <ConfirmationModal
          setShow={setStatusShow}
          show={statusShow}
          handleYes={handleOnSubmit}
          loading={cancelLoading}
          message={`Are you sure you want to cancel this Free Spin?`}
        />
      </Card>
    </>
  );
};

export default FreeSpinGames;
