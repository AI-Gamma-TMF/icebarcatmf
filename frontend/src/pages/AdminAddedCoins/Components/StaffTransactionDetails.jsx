import React from "react";
import { Table, Button, Row, Col, Form } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedoAlt,
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AdminCoinsUserListHeader } from "../constants";
import { InlineLoader } from "../../../components/Preloader";
import { AdminRoutes } from "../../../routes";
import Trigger from "../../../components/OverlayTrigger";
import useUserSCCreditdetails from "../hooks/useUserSCCreditdetails";
import { getDateTime } from "../../../utils/dateFormatter";
import {
  convertToTimeZone,
  formatPriceWithCommas,
  getFormattedTimeZoneOffset,
} from "../../../utils/helper";
import { getItem } from "../../../utils/storageUtils";
import { timeZones } from "../../Dashboard/constants";
import PaginationComponent from "../../../components/Pagination";
import useCheckPermission from "../../../utils/checkPermission";

const StaffTransactionDetails = () => {
  const { isHidden } = useCheckPermission();
  const {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    loading,
    UserSCCreditData,
    emailSearch,
    setEmailSearch,
    idSearch,
    setIdSearch,
    nameSearch,
    setNameSearch,
    resetFilters,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    selected,
    navigate,
  } = useUserSCCreditdetails();

  const handleStaffTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(param.value);
      setSort("asc");
    }
  };

  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  return (
    <>
      <Row className="mb-3 w-100 m-auto">
        <Col xs="12" lg="auto" className="mt-2 mt-lg-0">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label
              column="sm"
              style={{ marginBottom: "0", marginRight: "15px" }}
            >
              Email
            </Form.Label>
            <Form.Control
              type="search"
              value={emailSearch}
              placeholder={"Email Search"}
              onChange={(event) => {
                setPage(1);
                setEmailSearch(
                  event.target.value.replace(/[~`%^#)()><?]+/g, "")
                );
              }}
              style={{ minWidth: "230px" }}
            />
          </div>
        </Col>

        <Col xs="12" lg="auto" className="mt-2 mt-lg-0">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label
              column="sm"
              style={{ marginBottom: "0", marginRight: "15px" }}
            >
              User Id
            </Form.Label>
            <Form.Control
              type="search"
              value={idSearch}
              placeholder={"User Id Search"}
              onChange={(event) => {
                const inputValue = event.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setPage(1);
                  setIdSearch(inputValue);
                }
              }}
              style={{ minWidth: "230px" }}
            />
          </div>
        </Col>

        <Col xs="12" lg="auto" className="mt-2 mt-lg-0">
          <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
            <Form.Label
              column="sm"
              style={{ marginBottom: "0", marginRight: "15px" }}
            >
              Name
            </Form.Label>
            <Form.Control
              type="search"
              value={nameSearch}
              placeholder={"Name Search"}
              onChange={(event) => {
                setPage(1);
                setNameSearch(event.target.value);
              }}
              style={{ minWidth: "230px" }}
            />
          </div>
        </Col>

        <Col
          xs="12"
          lg="auto"
          className="mt-2 mt-lg-0 d-flex align-items-end mb-1"
        >
          <Trigger message="Reset Filters" id={"redo"} />
          <Button id={"redo"} variant="success" onClick={resetFilters}>
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
            {AdminCoinsUserListHeader?.map((h, idx) => (
              <th
                key={idx}
                onClick={() =>
                  ["userEmail", "createdAt", "userId", "amount"].includes(
                    h.value
                  ) && handleStaffTableSorting(h)
                }
                style={{
                  cursor: [
                    "userEmail",
                    "createdAt",
                    "userId",
                    "amount",
                  ].includes(h.value)
                    ? "pointer"
                    : "default",
                }}
                className={selected(h) ? "border-3 border border-blue" : ""}
              >
                {h.labelKey}
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
        {loading ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {UserSCCreditData?.data &&
            UserSCCreditData?.data?.rows?.length > 0 ? (
              UserSCCreditData?.data?.rows?.map((value, index) => {
                return (
                  <tr
                    key={index}
                    className="text-center"
                    style={{
                      height: "40px",
                      verticalAlign: "middle",
                    }}
                  >
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{value?.userId}</td>
                    <td>{value?.name || "-"}</td>
                    <td>
                      {isHidden({ module: { key: "Users", value: "R" } }) ? (
                        value?.userEmail
                      ) : (
                        <Link
                          to={`/admin/player-details/${value?.userId}`}
                          className="text-link d-inline-block text-truncate"
                        >
                          {value?.userEmail}
                        </Link>
                      )}
                    </td>
                    <td>{formatPriceWithCommas(value?.amount)}</td>
                    <td>
                      {value?.transactionType === "addSc"
                        ? "Add SC"
                        : "Deduct SC"}
                    </td>

                    <td>
                      {getDateTime(
                        convertToTimeZone(value?.createdAt, timezoneOffset)
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-danger text-center">
                  No data Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>

      <Row>
        <Col xs="12" lg="auto" className="pt-4 mt-lg-0">
          <Trigger message="Cancel" id={"cancel"} />
          <Button
            id={"cancel"}
            variant="warning"
            onClick={() => navigate(AdminRoutes.StaffCreditDetails)}
          >
            Cancel
          </Button>
        </Col>
      </Row>

      {UserSCCreditData?.data?.count !== 0 && (
        <PaginationComponent
          page={UserSCCreditData?.data?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default StaffTransactionDetails;
