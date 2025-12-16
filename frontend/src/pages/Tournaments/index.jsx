import React, { useState } from "react";
import { Button, Row, Col, Table, Form } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaginationComponent from "../../components/Pagination";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import "./style.scss";
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
      <>
        <Row className="mb-2">
          <Col>
            <h3>{t("tournaments.title")}</h3>
          </Col>

          <Col>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="success"
                size="md"
                // style={{ marginRight: '10px' }}
                hidden={isHidden({
                  module: { key: "Tournaments", value: "C" },
                })}
                onClick={() => navigate(AdminRoutes.tournamentCreate)}
              >
                {t("tournaments.createButton")}
              </Button>

              <Button
                variant="success"
                className=""
                size="md"
                hidden={isHidden({
                  module: { key: "Tournaments", value: "U" },
                })}
                onClick={() => navigate(AdminRoutes.ReordertournamentList)}
              >
                {t("tournaments.reorder")}
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mb-3 w-100 m-auto">
          <Col xs={12} md={3} lg="auto" className="mt-2 mt-lg-0">
            <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
              <Form.Label
                column="sm"
                style={{ marginBottom: "0", marginRight: "15px" }}
              >
                Search by Title, Id and Entry Coin
              </Form.Label>

              <Form.Control
                type="search"
                value={search}
                placeholder={"Search..."}
                onChange={(event) => {
                  setPage(1);
                  setSearch(
                    event?.target?.value?.replace(/[~`!$%@^&*#=)()><?]+/g, "")
                  );
                }}
                style={{ minWidth: "230px" }}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg="auto" className="mt-2 mt-lg-0">
            <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
              <Form.Label
                column="sm"
                style={{ marginBottom: "0", marginRight: "15px" }}
              >
                {t("casinoSubCategory.filters.status")}
              </Form.Label>

              <Form.Select
                onChange={(e) => {
                  setPage(1);
                  setStatus(e?.target?.value);
                }}
                value={status}
                style={{ minWidth: "230px" }}
              >
                <option value="all">
                  {t("casinoSubCategory.filters.all")}
                </option>
                <option value="0">
                  {t("casinoSubCategory.filters.upComing")}
                </option>
                <option value="1">
                  {t("casinoSubCategory.filters.onGoing")}
                </option>
                <option value="2">
                  {t("casinoSubCategory.filters.completed")}
                </option>
                <option value="3">
                  {t("casinoSubCategory.filters.cancelled")}
                </option>
              </Form.Select>
            </div>
          </Col>

          <Col xs={12} md={3} lg="auto" className="mt-2 mt-lg-0">
            <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
              <Form.Label
                column="sm"
                style={{ marginBottom: "0", marginRight: "15px" }}
              >
                Joining Amount
              </Form.Label>

              <Form.Control
                type="search"
                value={joiningAmount}
                placeholder={"Joining Amount"}
                onChange={(event) => {
                  const inputValue = event?.target?.value;
                  if (/^\d*\.?\d*$/.test(inputValue)) {
                    setPage(1);
                    setJoiningAmount(inputValue);
                  }
                }}
                style={{ minWidth: "230px" }}
              />
            </div>
          </Col>

          <Col xs={12} md={3} lg="auto" style={{ marginTop: "28px" }}>
            <Trigger message="Reset Filters" id={"redo"} />
            <Button
              id={"redo"}
              variant="success"
              className=""
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>

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
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  // onClick={() => h.value !== '' && setOrderBy(h.value)}
                  // className={
                  //   selected(h)
                  //     ? 'border-3 border border-blue'
                  //     : ''
                  // }
                  className="border-2 border "
                >
                  {t(h.labelKey)}{" "}
                  {/* {selected(h) &&
                    (sort === 'ASC'
                      ? (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleUp}
                          onClick={() => setSort('DESC')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      )
                      : (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleDown}
                          onClick={() => setSort('ASC')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ))} */}
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
              {tournamentList && tournamentList.count > 0 ? (
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
                    return (
                      <tr key={tournamentId}>
                        <td>{tournamentId}</td>

                        <td>
                          {getDateTime(
                            convertToTimeZone(startDate, timezoneOffset)
                          )}
                        </td>
                        <td>
                          {getDateTime(
                            convertToTimeZone(endDate, timezoneOffset)
                          )}
                        </td>

                        <td>
                          <span
                            id={title}
                            style={{
                              // width: '100px',
                              cursor: "pointer",
                            }}
                            className="d-inline-block text-truncate"
                          >
                            {title}
                          </span>
                        </td>

                        <td>{formatPriceWithCommas(entryAmount)}</td>

                        <td>
                          {status === "0" ? (
                            <span className="text-warning">Upcoming</span>
                          ) : status === "1" ? (
                            <span className="text-success">Ongoing</span>
                          ) : status === "2" ? (
                            <span className="text-muted">Completed</span>
                          ) : status === "3" ? (
                            <span className="text-danger">Cancelled</span>
                          ) : (
                            <span>----</span>
                          )}
                        </td>

                        <td>
                          {entryCoin}
                          {/* ? (
                            <span className='text-success'>{t('tournaments.activeStatus')}</span>
                          )
                          : (
                            <span className='text-danger'>{t('tournaments.inActiveStatus')}</span>
                          )} */}
                        </td>

                        <td>
                          <Trigger
                            message={"View"}
                            id={tournamentId + "view"}
                          />
                          <Button
                            id={tournamentId + "view"}
                            className="m-1"
                            size="sm"
                            variant="info"
                            onClick={() =>
                              navigate(
                                `${AdminRoutes.TournamentDetails.split(
                                  ":"
                                ).shift()}${tournamentId}`
                              )
                            }
                            hidden={isHidden({
                              module: { key: "Tournaments", value: "R" },
                            })}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>

                          <Trigger message="Edit" id={tournamentId + "edit"} />
                          <Button
                            id={tournamentId + "edit"}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            hidden={isHidden({
                              module: { key: "Tournaments", value: "U" },
                            })}
                            onClick={() => {
                              navigate(
                                `${AdminRoutes.TournamentEdit.split(
                                  ":"
                                ).shift()}${tournamentId}`
                              );
                            }}
                            disabled={status === "3" || status === "2"} // Disable if cancelled
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          <Trigger
                            message="Cancel Tournament"
                            id={tournamentId + "cancel"}
                          />
                          <Button
                            className="btn btn-danger m-1"
                            id={tournamentId + "cancel"}
                            hidden={isHidden({
                              module: { key: "Tournaments", value: "D" },
                            })}
                            size="sm"
                            onClick={() => handleActionClick(tournamentId)}
                            disabled={status === "3" || status === "2"} // Disable if cancelled
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>

                          <Trigger
                            message="Duplicate Tournament"
                            id={tournamentId + "duplicate"}
                          />
                          <Button
                            className="btn btn-secondary m-1"
                            id={tournamentId + "duplicate"}
                            hidden={isHidden({
                              module: { key: "Tournaments", value: "C" },
                            })}
                            size="sm"
                            onClick={() => {
                              navigate(AdminRoutes.duplicateTournamentCreate, {
                                state: {
                                  duplicateTournamentId: tournamentId,
                                },
                              });
                            }}
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={7} className="text-danger text-center">
                    {t("tournaments.noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
        {tournamentList?.count !== 0 && (
          <PaginationComponent
            page={tournamentList?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </>

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
