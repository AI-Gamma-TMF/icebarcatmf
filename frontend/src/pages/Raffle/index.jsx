import React, { useState } from "react";
import { Button, Row, Col, Table } from "@themesberg/react-bootstrap";
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
      <>
        <Row className="mb-2">
          <Col>
            <h3>Giveaways</h3>
          </Col>

          <Col>
            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                hidden={isHidden({ module: { key: "Raffles", value: "C" } })}
                size="sm"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setType("Create");
                  navigate(AdminRoutes.RaffleCreate);
                }}
              >
                Create
              </Button>
            </div>
          </Col>
        </Row>

        <RaffleFilters
          searchByTitle={searchByTitle}
          setSearchByTitle={setSearchByTitle}
          status={status}
          setStatus={setStatus}
          isActive={isActive}
          setIsActive={setIsActive}
          wgrBaseAmt={wgrBaseAmt}
          setWgrBaseAmt={setWgrBaseAmt}
          startDate={startDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          endDate={endDate}
          errorStart={errorStart}
          errorEnd={errorEnd}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          setPage={setPage}
          setLimit={setLimit}
        />

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
              {tableHeaders?.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== "" && setOrderBy(h.value)}
                  style={{
                    cursor: (h.value !== "" && "pointer"),
                  }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
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
          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {raffleList?.count > 0 ? (
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
                    return (
                      <tr key={raffleId}>
                        <td>{raffleId}</td>
                        <td>{title}</td>

                        <td>
                          {formatDateMDY(
                            convertToTimeZone(startDate, timezoneOffset)
                          )}
                        </td>
                        <td>
                          {formatDateMDY(
                            convertToTimeZone(endDate, timezoneOffset)
                          )}
                        </td>
                        <td>
                          <img
                            src={imageUrl}
                            alt="..."
                            width={100}
                            height={100}
                            className="img-thumbnail"
                            // onClick={() => window.open(imageUrl)}
                          ></img>
                        </td>

                        <td>
                          {wagerBaseAmt} {wagerBaseAmtType}
                        </td>
                        <td>
                          {status == "ongoing"
                            ? "On Going"
                            : status == "upcoming"
                            ? "Up Coming"
                            : "Completed"}
                        </td>
                        <td>{isActive == true ? "Active" : "In-Active"}</td>
                        {!isHidden({
                          module: { key: "Raffles", value: "U" },
                        }) ||
                        !isHidden({
                          module: { key: "Raffles", value: "T" },
                        }) ? (
                          <td>
                            <Trigger message={"View"} id={raffleId + "view"} />
                            <Button
                              id={raffleId + "view"}
                              className="m-1"
                              size="sm"
                              variant="info"
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.RaffleView.split(
                                    ":"
                                  ).shift()}${raffleId}`
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            {isActive && (
                              <>
                                {!isHidden({
                                  module: { key: "Raffles", value: "R" },
                                }) && (
                                  <>
                                    <Trigger
                                      message="Payout"
                                      id={raffleId + "payout"}
                                    />
                                    <Button
                                      id={raffleId + "payout"}
                                      className="m-1"
                                      size="sm"
                                      variant="warning"
                                      hidden={isHidden({
                                        module: {
                                          key: "RafflePayout",
                                          value: "R",
                                        },
                                      })}
                                      onClick={() =>
                                        navigate(
                                          `${AdminRoutes.RafflePayout.split(
                                            ":"
                                          ).shift()}${raffleId}`
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faPlayCircle} />
                                    </Button>{" "}
                                  </>
                                )}
                                <Trigger
                                  message="Edit"
                                  id={raffleId + "edit"}
                                />
                                <Button
                                  id={raffleId + "edit"}
                                  hidden={isHidden({
                                    module: { key: "Raffles", value: "U" },
                                  })}
                                  className="m-1"
                                  size="sm"
                                  variant="warning"
                                  disabled={status === "completed"}
                                  onClick={() =>
                                    navigate(
                                      `${AdminRoutes.RaffleEdit.split(
                                        ":"
                                      ).shift()}${raffleId}`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                              </>
                            )}
                            {!isActive ? (
                              <>
                                <Trigger
                                  message="Set Status Active"
                                  id={raffleId + "active"}
                                />
                                <Button
                                  id={raffleId + "active"}
                                  hidden={isHidden({
                                    module: { key: "Raffles", value: "U" },
                                  })}
                                  className="m-1"
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleShow(raffleId, isActive)}
                                  // disabled={isEditable}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger
                                  message="Set Status In-Active"
                                  id={raffleId + "inactive"}
                                />
                                <Button
                                  id={raffleId + "inactive"}
                                  hidden={isHidden({
                                    module: { key: "Raffles", value: "U" },
                                  })}
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleShow(raffleId, isActive)}
                                  // disabled={isEditable}
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                            )}
                          </td>
                        ) : (
                          "NA"
                        )}
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={7} className="text-danger text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
        {raffleList?.count !== 0 && (
          <PaginationComponent
            page={raffleList?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </>
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
