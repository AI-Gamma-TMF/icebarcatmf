import React from "react";
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Table, Row, Col, Form } from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";

import { internalTierRating, tableHeaders } from "../constants";
import SearchBar from "./SearchBar";
import PaginationComponent from "../../../components/Pagination";
import { InlineLoader } from "../../../components/Preloader";
import { AdminRoutes } from "../../../routes";
import "./_vip.scss";
import "./vipPending.scss";
import { formatNumber } from "../../../utils/helper";
import useVipPlayerListing from "../hooks/useVipPlayerListing";

const PendingVipPlayers = () => {
  const navigate = useNavigate();
  const vipStatusSearch = "pending";
  const ratingMin = 0;
  const ratingMax = 3;
  const {
    vipPlayerListing,
    isLoading,
    limit,
    setLimit,
    setPage,
    page,
    totalPages,
    setSearch,
    search,
    setRatingFilter,
    selected,
    over,
    setOver,
    sort,
    setSort,
    setOrderBy,
  } = useVipPlayerListing("pendingVip", ratingMin, ratingMax, vipStatusSearch);

  const handleNavigatePlayerDetails = (userId) => {
    navigate(`${AdminRoutes.VipPlayerDetails.split(":").shift()}${userId}`);
  };
  return (
    <>
      <div className="vip-pending-page dashboard-typography">
        <Row className="align-items-center mb-2">
          <Col xs={12}>
            <h3 className="vip-pending-page__title">Pending - VIP</h3>
            <div className="vip-pending-page__subtitle">
              Review pending VIP players, filter by rating, and open player profiles.
            </div>
          </Col>
        </Row>

        <Card className="vip-pending-page__filters dashboard-filters p-3 mb-3">
          <Row className="g-3 align-items-start">
            <Col xs={12} md={6} lg={4}>
              <Form.Label className="form-label">Search Player</Form.Label>
              <SearchBar search={search} setSearch={setSearch} />
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Form.Group>
                <Form.Label className="form-label">Player Rating</Form.Label>
                <Form.Select
                  className="vip-pending-page__select"
                  onChange={(event) => {
                    setPage(1);
                    setRatingFilter(event?.target?.value);
                  }}
                >
                  {internalTierRating
                    .filter((rating) => rating.value <= 3 || rating.value === "all")
                    .map((rating) => (
                      <option key={rating.value} value={rating.value}>
                        {rating.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card>

        <div className="vip-pending-page__table-wrap table-responsive dashboard-table">
          <Table hover size="sm" className="dashboard-data-table vip-pending-table text-center">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.value}
                    onClick={() =>
                      header.value !== "userProfile" &&
                      header.value !== "ngr" &&
                      header.value !== "managedBy" &&
                      header.value !== "status" &&
                      setOrderBy(header.value)
                    }
                    className={selected(header) ? "border-3 border border-blue" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    {header.labelKey}{" "}
                    {selected(header) &&
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
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <InlineLoader />
                  </td>
                </tr>
              ) : vipPlayerListing && vipPlayerListing?.users?.rows.length > 0 ? (
                vipPlayerListing?.users?.rows.map(
                  ({ userId, username, email, UserReport, UserInternalRating, ngr, status }) => (
                    <tr key={userId}>
                      <td
                        className="text-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavigatePlayerDetails(userId)}
                      >
                        {userId || "NA"}
                      </td>
                      <td
                        className="text-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavigatePlayerDetails(userId)}
                      >
                        {username || "NA"}
                      </td>
                      <td
                        className="text-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNavigatePlayerDetails(userId)}
                      >
                        {email || "NA"}
                      </td>
                      <td>{formatNumber(UserReport?.totalGgr, { isDecimal: true })}</td>
                      <td>{formatNumber(ngr, { isDecimal: true })}</td>
                      <td>{formatNumber(UserReport?.totalPurchaseAmount, { isDecimal: true })}</td>
                      <td>{formatNumber(UserReport?.totalRedemptionAmount, { isDecimal: true })}</td>
                      <td>{UserInternalRating?.rating}</td>
                      <td>
                        <Button
                          onClick={() => handleNavigatePlayerDetails(userId)}
                          className="vip-pending-page__profile-btn"
                        >
                          Profile
                        </Button>
                      </td>
                      <td className={status === "Active" ? "text-success" : "text-danger"}>
                        {status}
                      </td>
                      <td>{UserInternalRating?.moreDetails?.managedBy || "Not Available"}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <span className="vip-pending-page__empty">No data found</span>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      {vipPlayerListing?.users?.count !== 0 && (
        <PaginationComponent
          page={vipPlayerListing?.users?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      </div>
    </>
  );
};
export default PendingVipPlayers;
