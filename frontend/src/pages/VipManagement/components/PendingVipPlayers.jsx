import React from "react";
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Table, Row, Col, Form } from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";

import { internalTierRating, tableHeaders } from "../constants";
import SearchBar from "./SearchBar";
import PaginationComponent from "../../../components/Pagination";
import { InlineLoader } from "../../../components/Preloader";
import { AdminRoutes } from "../../../routes";
import "./_vip.scss";
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
      <Row className="d-flex justify-content-between align-items-center">
        <Col sm={6} lg={2}>
          <h3>Pending - VIP</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm={6} lg={3}>
          <Form.Label>Search Player</Form.Label>
          <SearchBar search={search} setSearch={setSearch} />
        </Col>
        <Col sm={6} lg={2}>
          <Form.Group>
            <Form.Label>Player Rating</Form.Label>
            <Form.Select
              onChange={(event) => {
                setPage(1);
                setRatingFilter(event?.target?.value);
              }}
            >
              {internalTierRating
                .filter((rating) => rating.value <= 3 || rating.value === "all")
                .map((rating, index) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className="text-center mt-3"
      >
        <thead className="thead-dark">
          <tr style={{ boxShadow: "0 4px 4px 0 #797979", borderRadius: "7px" }}>
            {tableHeaders.map((header, index) => (
              <th
                key={header.value}
                onClick={() =>
                  header.value !== "userProfile" &&
                  header.value !== "ngr" &&
                  header.value !== "managedBy" &&
                  header.value !== "status" &&
                  setOrderBy(header.value)
                }
                className={
                  selected(header) ? "border-3 border border-blue" : ""
                }
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
        {isLoading ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {vipPlayerListing && vipPlayerListing?.users?.rows.length > 0 ? (
              vipPlayerListing?.users?.rows.map(
                ({
                  userId,
                  username,
                  email,
                  UserReport,
                  UserInternalRating,
                  ngr,
                  status,
                }) => {
                  return (
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
                      <td>
                        {formatNumber(UserReport?.totalGgr, {
                          isDecimal: true,
                        })}
                      </td>
                      <td>{formatNumber(ngr, { isDecimal: true })}</td>
                      <td>
                        {formatNumber(UserReport?.totalPurchaseAmount, {
                          isDecimal: true,
                        })}
                      </td>
                      <td>
                        {formatNumber(UserReport?.totalRedemptionAmount, {
                          isDecimal: true,
                        })}
                      </td>
                      <td>{UserInternalRating?.rating}</td>
                      <td>
                        <Button
                          onClick={() => handleNavigatePlayerDetails(userId)}
                          // variant='success'
                          style={{
                            width: "6rem",
                            padding: "5px 10px",
                            backgroundColor: "#219653",
                            color: "#FFFFFF",
                            border: "none",
                          }}
                        >
                          Profile
                        </Button>
                      </td>

                      <td
                        className={
                          status === "Active" ? "text-success" : "text-danger"
                        }
                      >
                        {status}
                      </td>
                      <td>
                        {UserInternalRating?.moreDetails?.managedBy ||
                          "Not Available"}
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan={10} className="text-danger text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
      {vipPlayerListing?.users?.count !== 0 && (
        <PaginationComponent
          page={vipPlayerListing?.users?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};
export default PendingVipPlayers;
