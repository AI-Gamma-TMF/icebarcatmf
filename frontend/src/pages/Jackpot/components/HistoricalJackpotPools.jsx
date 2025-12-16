import React from "react";
import { Table, Row, Col, Button, Form } from "@themesberg/react-bootstrap";
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
    <Row className="mt-4">
      <Row className="mb-2">
        <Col xs={12} md={6} lg={4}>
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "8px" }}
          >
            Search
          </Form.Label>
          <Form.Control
            type="search"
            placeholder="Search Jackpot"
            value={search}
            style={{ maxWidth: "330px", marginRight: "10px", marginTop: "5px" }}
            onChange={(event) => {
              setPage(1);
              // const mySearch = event.target.value.replace(searchRegEx, '')
              const mySearch = event.target.value;
              setSearch(mySearch);
            }}
          />
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
                  cursor: (h.value === 'action' || h.value === 'gameName' || h.value === 'winningDate')
                   ? 'default' : 'pointer',
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
              <td colSpan={11} className="text-center">
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
                  <td>
                    {formatNumber(jackpotPoolEarning, { isDecimal: true })}
                  </td>
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
                        navigate(
                          `${AdminRoutes.EditJackpot.split(
                            ":"
                          ).shift()}${jackpotId}`
                        )
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
              <td colSpan={11} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

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
    </Row>
  );
};

export default HistoricalJackpotPools;
