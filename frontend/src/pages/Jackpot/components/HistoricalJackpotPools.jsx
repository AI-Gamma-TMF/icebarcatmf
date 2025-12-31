import React from "react";
import { Table, Row, Col, Button, Form, Card } from "@themesberg/react-bootstrap";
import { jackpotTableHeaders, STATUS_LABELS } from "../constant";
import { InlineLoader } from "../../../components/Preloader";
import { formatDateMDY } from "../../../utils/dateFormatter";
import { AdminRoutes } from "../../../routes";
import useJackpotListing from "../hooks/useJackpotListing";
import Trigger from "../../../components/OverlayTrigger";
import useCheckPermission from "../../../utils/checkPermission";

import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faEdit,
} from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatNumber } from "../../../utils/helper";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal/index";
import PaginationComponent from "../../../components/Pagination";

const HistoricalJackpotPools = ({ isHitoricalTab }) => {
  const { isHidden } = useCheckPermission();

  const {
    jackpotList,
    setOrderBy,
    selected,
    over,
    setOver,
    loading,
    handleDelete,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
    navigate,
    sort,
    setSort,
    setSearch,
    search,
    page,
    setPage,
    status,
    setStatus,
    limit,
    setLimit,
    totalPages,
  } = useJackpotListing(isHitoricalTab);

  return (
    <Card className="jackpot-page__card p-2 mt-3">
      <Row className="dashboard-filters jackpot-history-filters g-3 mx-0 align-items-end">
        <Col xs={12} md={4}>
          <Form.Label className="form-label">Search</Form.Label>
          <Form.Control
            type="search"
            placeholder="Search Jackpot"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
        </Col>
        <Col xs={12} md={3}>
          <Form.Label className="form-label">Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="0">Upcoming</option>
            <option value="1">Running</option>
            <option value="2">Completed</option>
          </Form.Select>
        </Col>
        <Col xs={12} md="auto" className="ms-auto d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setPage(1);
              setSearch("");
              setStatus("all");
              setSort("DESC");
              setOrderBy("");
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      <div className="dashboard-section-divider" />

      <div className="jackpot-history-table-wrap table-responsive">
        <Table bordered striped responsive hover size="sm" className="dashboard-data-table jackpot-history-table text-center mt-3">
          <thead className="thead-dark">
            <tr>
              {jackpotTableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() =>
                    h.value !== "action" &&
                    h.value !== "gameName" &&
                    h.value !== "winningDate" &&
                    setOrderBy(h.value)
                  }
                  style={{
                    cursor:
                      h.value === "action" || h.value === "gameName" || h.value === "winningDate"
                        ? "default"
                        : "pointer",
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
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={jackpotTableHeaders.length} className="text-center">
                  <InlineLoader />
                </td>
              </tr>
            ) : jackpotList?.data?.rows?.length > 0 ? (
              jackpotList.data?.rows.map(
                ({
                  jackpotId,
                  jackpotName,
                  jackpotPoolEarning,
                  poolAmount,
                  seedAmount,
                  netRevenue,
                  userId,
                  username,
                  email,
                  gameId,
                  gameName,
                  winningDate,
                  status,
                  ticketSold,
                  winningTicket,
                }) => (
                  <tr key={jackpotId}>
                    <td>{jackpotId}</td>
                    <td>{jackpotName || "-"}</td>
                    <td>{formatNumber(poolAmount, { isDecimal: true })}</td>
                    <td>{formatNumber(seedAmount, { isDecimal: true })}</td>
                    <td>{formatNumber(jackpotPoolEarning, { isDecimal: true })}</td>
                    <td>{formatNumber(netRevenue, { isDecimal: true })}</td>
                    <td>{formatNumber(userId) || "-"}</td>
                    <td>{username || "-"}</td>
                    <td>{email || "-"}</td>
                    <td>{gameId || "-"}</td>
                    <td>{gameName || "-"}</td>
                    <td>{winningDate ? formatDateMDY(winningDate) : "-"}</td>
                    <td>{formatNumber(winningTicket, { isDecimal: true })}</td>
                    <td>{formatNumber(ticketSold)}</td>
                    <td>{STATUS_LABELS[status] || "-"}</td>
                    <td>
                      <Trigger message="Edit" id={jackpotId + "edit"} />
                      <Button
                        id={jackpotId + "edit"}
                        hidden={isHidden({
                          module: { key: "Jackpot", value: "U" },
                        })}
                        className="m-1"
                        size="sm"
                        variant="warning"
                        disabled={status === 1 || status === 2}
                        onClick={() =>
                          navigate(`${AdminRoutes.EditJackpot.split(":").shift()}${jackpotId}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>

                      <Trigger message="Delete" id={jackpotId + "delete"} />
                      <Button
                        id={jackpotId + "delete"}
                        hidden={isHidden({
                          module: { key: "Jackpot", value: "U" },
                        })}
                        className="m-1"
                        size="sm"
                        variant="warning"
                        onClick={() => handleDelete(jackpotId)}
                        disabled={status === 1 || status === 2}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={jackpotTableHeaders.length} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {jackpotList?.data?.count !== 0 && (
        <PaginationComponent
          page={jackpotList?.data?.count < page ? setPage(1) : page}
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
    </Card>
  );
};

export default HistoricalJackpotPools;
