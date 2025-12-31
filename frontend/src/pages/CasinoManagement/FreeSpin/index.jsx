import React from "react";
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
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import PaginationComponent from "../../../components/Pagination";
import "./freespin.scss";
import { InlineLoader } from "../../../components/Preloader";
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

  const summaryTiles = [
    { label: "Total Win SC", value: displayValue(dashboardData?.totalWinSc, true, 2), icon: "/spin-total-win-sc.png" },
    { label: "Total Win GC", value: displayValue(dashboardData?.totalWinGc, true, 2), icon: "/spin-total-win-gc.png" },
    { label: "Total Users", value: displayValue(dashboardData?.totalUsers, true, 0), icon: "/spin-total-users.png" },
    { label: "Total Pending", value: displayValue(dashboardData?.totalPending, true, 0), icon: "/spin-total-pending.png" },
    { label: "Total Expired", value: displayValue(dashboardData?.totalExpired, true, 0), icon: "/spin-total-expired.png" },
    {
      label: "Total Given GC",
      value: displayValue(dashboardData?.totalAmountGivenByAdminGC, true, 2),
      icon: "/spin-total-given-gc.png",
    },
    {
      label: "Total Given SC",
      value: displayValue(dashboardData?.totalAmountGivenByAdminSC, true, 2),
      icon: "/spin-total-given-sc.png",
    },
    {
      label: "Total Attached Grant",
      value: displayValue(dashboardData?.totalAttachedGrant, true, 2),
      icon: "/spin-total-attached-grant.png",
    },
    { label: "Total Cancelled", value: displayValue(dashboardData?.totalCancelled, true, 0), icon: "/spin-total-cancelled.png" },
    { label: "Total Claimed", value: displayValue(dashboardData?.totalClaimed, true, 0), icon: "/spin-total-claimed.png" },
    { label: "Total Direct Grant", value: displayValue(dashboardData?.totalDirectGrant, true, 2), icon: "/spin-total-direct-grant.png" },
  ];

  return (
    <div className="free-spin-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col>
          <h3 className="free-spin-page__title">Games Free Spin</h3>
        </Col>

        <Col xs="auto">
          <Button
            className="free-spin-page__action-btn"
            variant="success"
            size="sm"
            onClick={() => navigate(AdminRoutes.FreeSpinGames)}
            hidden={isHidden({
              module: { key: "CasinoManagement", value: "C" },
            })}
          >
            Create Free Spin
          </Button>
        </Col>
      </Row>

      <div className="free-spin-summary dashboard-boxes-container">
        {summaryTiles.map((tile) => (
          <div key={tile.label} className="dashboard-box">
            <div className="ticker-label">
              <img src={tile.icon} alt={tile.label} />
              <label>{tile.label}</label>
            </div>
            <div className="value-wrap">
              <div className="live-report-data">{tile.value}</div>
              <div className="new-icon">
                <img src={tile.icon} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="p-2 mb-2 free-spin-page__card">
        <Row className="dashboard-filters free-spin-filters g-3 align-items-end">
          <Col xs={12} md={3}>
            <Form.Label className="form-label">Search by Title</Form.Label>
            <Form.Control
              type="search"
              value={search}
              placeholder="Search"
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
              }}
            />
          </Col>

          <Col xs={12} md={3}>
            <Form.Label className="form-label">Search by Provider</Form.Label>
            <Form.Control
              type="search"
              value={providerSearch}
              placeholder="Search"
              onChange={(event) => {
                setPage(1);
                setProviderSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
              }}
            />
          </Col>

          <Col xs={12} md={2}>
            <Form.Label className="form-label">Search by Freespin Id</Form.Label>
            <Form.Control
              type="number"
              value={searchId}
              placeholder="Search"
              onPaste={(e) => e.preventDefault()}
              onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              onChange={(event) => {
                setPage(1);
                setSearchId(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
              }}
            />
          </Col>

          <Col xs={12} md={2}>
            <Form.Label className="form-label">Search by Round</Form.Label>
            <Form.Control
              type="number"
              value={searchRound}
              placeholder="Search"
              onPaste={(e) => e.preventDefault()}
              onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              onChange={(event) => {
                setPage(1);
                setSearchRound(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
              }}
            />
          </Col>

          <Col xs={12} md={2}>
            <Form.Label className="form-label">Status</Form.Label>
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

          <Col xs={12} md="auto" className="ms-auto d-flex gap-2">
            <Trigger message="Reset Filters" id={"freeSpinReset"} />
            <Button
              id={"freeSpinReset"}
              variant="secondary"
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
              Reset
            </Button>
          </Col>
        </Row>

        <div className="dashboard-section-divider" />

        <div className="dashboard-section-heading">
          <div className="dashboard-section-heading__row">
            <h5 className="mb-0">Free spin report</h5>
          </div>
        </div>

        <div className="free-spin-table-wrap table-responsive">
          <Table bordered striped responsive hover size="sm" className="dashboard-data-table free-spin-table text-center mt-3">
            <thead className="thead-dark">
              <tr>
                {tableHeaders.map((h) => (
                  <th
                    key={h.value}
                    onClick={() => h.value !== "" && setOrderBy(h.value)}
                    style={{ cursor: "pointer" }}
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
              <tbody>
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <InlineLoader />
                  </td>
                </tr>
              </tbody>
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
                          {startDate ? getDateTime(convertToTimeZone(startDate, timezoneOffset)) : "-"}
                        </td>
                        <td>
                          {endDate ? getDateTime(convertToTimeZone(endDate, timezoneOffset)) : "-"}
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
                              navigate(`${AdminRoutes.viewFreeSpin.split(":").shift()}${freeSpinId}`)
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
                              navigate(`${AdminRoutes.EditFreeSpin.split(":").shift()}${freeSpinId}`)
                            }
                            disabled={status == 2 || status == 3}
                            hidden={isHidden({
                              module: { key: "CasinoManagement", value: "U" },
                            })}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          <Trigger message={"Cancel Free Spin"} id={freeSpinId + "delete"} />
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
                    <td colSpan={tableHeaders.length} className="text-danger text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </Table>
        </div>

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
    </div>
  );
};

export default FreeSpinGames;
