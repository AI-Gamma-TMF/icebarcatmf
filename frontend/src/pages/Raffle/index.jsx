import React, { useState } from "react";
import { Button, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
import { AdminRoutes } from "../../routes";
import useRaffleListing from "./hooks/useRaffleListing";
import { tableHeaders } from "./constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faCheckSquare,
  faEdit,
  faEye,
  faPlayCircle,
  faWindowClose,
} from "@fortawesome/free-regular-svg-icons";
import Trigger from "../../components/OverlayTrigger";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { InlineLoader } from "../../components/Preloader";
import PaginationComponent from "../../components/Pagination";
import { formatDateMDY } from "../../utils/dateFormatter";
import useCheckPermission from "../../utils/checkPermission";
import { getItem } from "../../utils/storageUtils";
import { timeZones } from "../Dashboard/constants";
import {
  convertToTimeZone,
  getFormattedTimeZoneOffset,
} from "../../utils/helper";
import RaffleFilters from "./component/RaffleFilters";
import "./raffleListing.scss";

const Raffle = () => {
  const {
    // t,
    limit,
    page,
    loading,
    raffleList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    active,
    navigate,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    setType,
    dataLoading,
    searchByTitle,
    setSearchByTitle,
    status,
    setStatus,
    isActive,
    setIsActive,
    wgrBaseAmt,
    setWgrBaseAmt,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useRaffleListing();

  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");
  const { isHidden } = useCheckPermission();
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date && date.isAfter(endDate)) {
      setErrorStart("Start date cannot be greater than end date.");
    } else {
      setErrorEnd("");
      setErrorStart("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date && date.isBefore(startDate)) {
      setErrorEnd("End date must be greater than the start date.");
    } else {
      setErrorStart("");
      setErrorEnd("");
    }
  };

  return (
    <>
      <div className="dashboard-typography raffle-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="raffle-page__title">Giveaways</h3>
            <p className="raffle-page__subtitle">Manage raffles, status, and payouts</p>
          </div>

          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              className="raffle-page__create-btn"
              hidden={isHidden({ module: { key: "Raffles", value: "C" } })}
              size="sm"
              onClick={() => {
                setType("Create");
                navigate(AdminRoutes.RaffleCreate);
              }}
            >
              Create
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters mb-4 raffle-filters">
          <Card.Body>
            <RaffleFilters
              searchByTitle={searchByTitle}
              setSearchByTitle={setSearchByTitle}
              status={status}
              setStatus={setStatus}
              isActive={isActive}
              setIsActive={setIsActive}
              wgrBaseAmt={wgrBaseAmt}
              setWgrBaseAmt={setWgrBaseAmt}
              setPage={setPage}
              setLimit={setLimit}
            />
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="raffle-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders?.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && setOrderBy(h.value)}
                      style={{ cursor: h.value !== "" ? "pointer" : "default" }}
                      className={selected(h) ? "sortable active" : "sortable"}
                    >
                      {h.labelKey}{" "}
                      {selected(h) &&
                        (sort === "ASC" ? (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowAltCircleUp}
                            onClick={() => setSort("DESC")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowAltCircleDown}
                            onClick={() => setSort("ASC")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ))}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : raffleList?.count > 0 ? (
                  raffleList?.rows?.map(
                    ({
                      raffleId,
                      title,
                      startDate,
                      endDate,
                      imageUrl,
                      wagerBaseAmt,
                      wagerBaseAmtType,
                      isActive,
                      status,
                    }) => {
                      const statusLabel =
                        status === "ongoing"
                          ? "On Going"
                          : status === "upcoming"
                          ? "Up Coming"
                          : "Completed";

                      const statusClass =
                        status === "ongoing"
                          ? "raffle-pill raffle-pill--ongoing"
                          : status === "upcoming"
                          ? "raffle-pill raffle-pill--upcoming"
                          : "raffle-pill raffle-pill--completed";

                      const activeClass = isActive
                        ? "raffle-pill raffle-pill--active"
                        : "raffle-pill raffle-pill--inactive";

                      const canActions =
                        !isHidden({ module: { key: "Raffles", value: "U" } }) ||
                        !isHidden({ module: { key: "Raffles", value: "T" } });

                      return (
                        <tr key={raffleId}>
                          <td>{raffleId}</td>
                          <td>{title}</td>
                          <td>{formatDateMDY(convertToTimeZone(startDate, timezoneOffset))}</td>
                          <td>{formatDateMDY(convertToTimeZone(endDate, timezoneOffset))}</td>
                          <td>
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt="raffle"
                                width={56}
                                height={56}
                                className="img-thumbnail"
                                style={{ cursor: "pointer" }}
                                onClick={() => window.open(imageUrl)}
                              />
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {wagerBaseAmt} {wagerBaseAmtType}
                          </td>
                          <td>
                            <span className={statusClass}>{statusLabel}</span>
                          </td>
                          <td>
                            <span className={activeClass}>{isActive ? "Active" : "In-Active"}</span>
                          </td>
                          <td>
                            {canActions ? (
                              <div className="raffle-actions">
                                <Trigger message={"View"} id={raffleId + "view"} />
                                <Button
                                  id={raffleId + "view"}
                                  className="raffle-icon-btn"
                                  size="sm"
                                  variant="info"
                                  onClick={() =>
                                    navigate(`${AdminRoutes.RaffleView.split(":").shift()}${raffleId}`)
                                  }
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>

                                {isActive && (
                                  <>
                                    {!isHidden({ module: { key: "Raffles", value: "R" } }) && (
                                      <>
                                        <Trigger message="Payout" id={raffleId + "payout"} />
                                        <Button
                                          id={raffleId + "payout"}
                                          className="raffle-icon-btn"
                                          size="sm"
                                          variant="warning"
                                          hidden={isHidden({
                                            module: { key: "RafflePayout", value: "R" },
                                          })}
                                          onClick={() =>
                                            navigate(`${AdminRoutes.RafflePayout.split(":").shift()}${raffleId}`)
                                          }
                                        >
                                          <FontAwesomeIcon icon={faPlayCircle} />
                                        </Button>
                                      </>
                                    )}

                                    <Trigger message="Edit" id={raffleId + "edit"} />
                                    <Button
                                      id={raffleId + "edit"}
                                      hidden={isHidden({ module: { key: "Raffles", value: "U" } })}
                                      className="raffle-icon-btn"
                                      size="sm"
                                      variant="warning"
                                      disabled={status === "completed"}
                                      onClick={() =>
                                        navigate(`${AdminRoutes.RaffleEdit.split(":").shift()}${raffleId}`)
                                      }
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                  </>
                                )}

                                {!isActive ? (
                                  <>
                                    <Trigger message="Set Status Active" id={raffleId + "active"} />
                                    <Button
                                      id={raffleId + "active"}
                                      hidden={isHidden({ module: { key: "Raffles", value: "U" } })}
                                      className="raffle-icon-btn"
                                      size="sm"
                                      variant="success"
                                      onClick={() => handleShow(raffleId, isActive)}
                                    >
                                      <FontAwesomeIcon icon={faCheckSquare} />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Trigger message="Set Status In-Active" id={raffleId + "inactive"} />
                                    <Button
                                      id={raffleId + "inactive"}
                                      hidden={isHidden({ module: { key: "Raffles", value: "U" } })}
                                      className="raffle-icon-btn"
                                      size="sm"
                                      variant="danger"
                                      onClick={() => handleShow(raffleId, isActive)}
                                    >
                                      <FontAwesomeIcon icon={faWindowClose} />
                                    </Button>
                                  </>
                                )}
                              </div>
                            ) : (
                              "NA"
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 raffle-empty">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {raffleList?.count !== 0 && (
          <PaginationComponent
            page={raffleList?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={dataLoading}
        />
      )}

      {/* {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
          />)} */}
    </>
  );
};

export default Raffle;
