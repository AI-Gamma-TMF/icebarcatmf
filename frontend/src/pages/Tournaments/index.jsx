import React, { useState } from "react";
import { Button, Row, Col, Table, Form, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaginationComponent from "../../components/Pagination";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import "./style.scss";
import "./tournamentListing.scss";
import {
  faEdit,
  faTrash,
  faEye,
  faCopy,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../components/OverlayTrigger";
import { InlineLoader } from "../../components/Preloader";
import useCheckPermission from "../../utils/checkPermission";
import { AdminRoutes } from "../../routes";
import { tableHeaders } from "./constants";
import useTournamentListing from "./hooks/useTournamentListing";
import { getDateTime } from "../../utils/dateFormatter";
import { convertToTimeZone, formatPriceWithCommas } from "../../utils/helper";
import Datetime from "react-datetime";
import { useCancelTournament } from "../../reactQuery/hooks/customMutationHook";
import { toast } from "../../components/Toast";

const Tournaments = () => {
  const {
    t,
    limit,
    page,
    loading,
    tournamentList,
    setLimit,
    setPage,
    totalPages,
    navigate,
    status,
    setStatus,
    search,
    setSearch,
    timezoneOffset,
    tournamentRefetch,
    joiningAmount,
    setJoiningAmount,
    statusShow,
    setStatusShow,
    itemToUpdate,
    setItemToUpdate,
    cancelTournament,
    handleOnSubmit,
  } = useTournamentListing({ isUTC: false });

  const { isHidden } = useCheckPermission();

    const handleActionClick = (tournamentId) => {
      setItemToUpdate(tournamentId);
      setStatusShow(true);
    };

  const resetFilters = () => {
    setSearch("");
    setStatus("1");
    setJoiningAmount("");
  };

  return (
    <>
      <div className="dashboard-typography tournament-list-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="tournament-list-page__title">{t("tournaments.title")}</h3>
            <p className="tournament-list-page__subtitle">Manage tournaments, status, and schedules</p>
          </div>

          <div className="d-flex justify-content-end gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              className="tournament-list__action-btn"
              hidden={isHidden({ module: { key: "Tournaments", value: "C" } })}
              onClick={() => navigate(AdminRoutes.tournamentCreate)}
            >
              {t("tournaments.createButton")}
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="tournament-list__action-btn"
              hidden={isHidden({ module: { key: "Tournaments", value: "U" } })}
              onClick={() => navigate(AdminRoutes.ReordertournamentList)}
            >
              {t("tournaments.reorder")}
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-start">
              <Col xs={12} md={6} lg={4}>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  className="tournament-filters__control"
                  type="search"
                  value={search}
                  placeholder="Search by Title, Id and Entry Coin"
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event?.target?.value?.replace(/[~`!$%@^&*#=)()><?]+/g, ""));
                  }}
                />
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>{t("casinoSubCategory.filters.status")}</Form.Label>
                <Form.Select
                  className="tournament-filters__select"
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e?.target?.value);
                  }}
                  value={status}
                >
                  <option value="all">{t("casinoSubCategory.filters.all")}</option>
                  <option value="0">{t("casinoSubCategory.filters.upComing")}</option>
                  <option value="1">{t("casinoSubCategory.filters.onGoing")}</option>
                  <option value="2">{t("casinoSubCategory.filters.completed")}</option>
                  <option value="3">{t("casinoSubCategory.filters.cancelled")}</option>
                </Form.Select>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>Joining Amount</Form.Label>
                <Form.Control
                  className="tournament-filters__control"
                  type="search"
                  value={joiningAmount}
                  placeholder="Joining Amount"
                  onChange={(event) => {
                    const inputValue = event?.target?.value;
                    if (/^\\d*\\.?\\d*$/.test(inputValue)) {
                      setPage(1);
                      setJoiningAmount(inputValue);
                    }
                  }}
                />
              </Col>

              <Col xs={12} md={6} lg={2} className="d-flex align-items-end">
                <div className="tournament-filters__actions w-100">
                  <div className="flex-grow-1" />
                  <Trigger message="Reset Filters" id={"redo"} />
                  <Button id={"redo"} className="tournament-reset-btn" onClick={resetFilters}>
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="tournament-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th key={idx} className="sortable">
                      {t(h.labelKey)}{" "}
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
                ) : tournamentList && tournamentList.count > 0 ? (
                  tournamentList?.rows?.map(
                    ({
                      tournamentId,
                      title,
                      entryAmount,
                      entryCoin,
                      startDate,
                      endDate,
                      status,
                    }) => {
                      const statusPill =
                        status === "0"
                          ? "tournament-status-pill tournament-status-pill--upcoming"
                          : status === "1"
                          ? "tournament-status-pill tournament-status-pill--ongoing"
                          : status === "2"
                          ? "tournament-status-pill tournament-status-pill--completed"
                          : status === "3"
                          ? "tournament-status-pill tournament-status-pill--cancelled"
                          : "tournament-status-pill";

                      const statusLabel =
                        status === "0"
                          ? "Upcoming"
                          : status === "1"
                          ? "Ongoing"
                          : status === "2"
                          ? "Completed"
                          : status === "3"
                          ? "Cancelled"
                          : "—";

                      return (
                        <tr key={tournamentId}>
                          <td>{tournamentId}</td>
                          <td>{getDateTime(convertToTimeZone(startDate, timezoneOffset))}</td>
                          <td>{getDateTime(convertToTimeZone(endDate, timezoneOffset))}</td>
                          <td>
                            <span className="d-inline-block text-truncate" style={{ maxWidth: 260 }}>
                              {title}
                            </span>
                          </td>
                          <td>{formatPriceWithCommas(entryAmount)}</td>
                          <td>
                            <span className={statusPill}>{statusLabel}</span>
                          </td>
                          <td>{entryCoin}</td>
                          <td>
                            <div className="tournament-actions">
                              <Trigger message={"View"} id={tournamentId + "view"} />
                              <Button
                                id={tournamentId + "view"}
                                className="tournament-icon-btn"
                                size="sm"
                                variant="info"
                                onClick={() =>
                                  navigate(`${AdminRoutes.TournamentDetails.split(":").shift()}${tournamentId}`)
                                }
                                hidden={isHidden({ module: { key: "Tournaments", value: "R" } })}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>

                              <Trigger message="Edit" id={tournamentId + "edit"} />
                              <Button
                                id={tournamentId + "edit"}
                                className="tournament-icon-btn"
                                size="sm"
                                variant="warning"
                                hidden={isHidden({ module: { key: "Tournaments", value: "U" } })}
                                onClick={() => {
                                  navigate(`${AdminRoutes.TournamentEdit.split(":").shift()}${tournamentId}`);
                                }}
                                disabled={status === "3" || status === "2"}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              <Trigger message="Cancel Tournament" id={tournamentId + "cancel"} />
                              <Button
                                className="tournament-icon-btn"
                                id={tournamentId + "cancel"}
                                hidden={isHidden({ module: { key: "Tournaments", value: "D" } })}
                                size="sm"
                                variant="danger"
                                onClick={() => handleActionClick(tournamentId)}
                                disabled={status === "3" || status === "2"}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>

                              <Trigger message="Duplicate Tournament" id={tournamentId + "duplicate"} />
                              <Button
                                className="tournament-icon-btn"
                                id={tournamentId + "duplicate"}
                                hidden={isHidden({ module: { key: "Tournaments", value: "C" } })}
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  navigate(AdminRoutes.duplicateTournamentCreate, {
                                    state: { duplicateTournamentId: tournamentId },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faCopy} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 tournament-empty">
                      {t("tournaments.noDataFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {tournamentList?.count !== 0 && (
          <PaginationComponent
            page={tournamentList?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>

      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleOnSubmit}
        message={`Are you sure you want to cancel this Tournament?`}
      />
    </>
  );
};

export default Tournaments;
