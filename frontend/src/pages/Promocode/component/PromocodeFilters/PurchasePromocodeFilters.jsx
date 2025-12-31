import React from "react";
import Datetime from "react-datetime";
import { Col, Row, Form, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../../../components/OverlayTrigger";
import { statusOptions } from "../../constant";
import { searchRegEx } from "../../../../utils/helper";

const PurchasePromocodeFilters = ({
  setPage,
  search,
  setSearch,
  discountPercentage,
  setDiscountPercentage,
  maxUsersAvailed,
  setMaxUsersAvailed,
  validTill,
  setValidTill,
  status,
  setStatus,
  validFrom,
  setValidFrom,
}) => {
  const resetFilters = () => {
    setSearch("");
    setDiscountPercentage("");
    setMaxUsersAvailed("");
    setValidTill(null);
    setValidFrom(null);
    setStatus("all");
  };

  return (
    <Row className="g-3 align-items-end">
      <Col xs={12} md={6} lg={4}>
        <Form.Label>Search By Promocode / Promocode Id</Form.Label>
        <Form.Control
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setPage(1);
            const mySearch = event.target.value.replace(searchRegEx, "");
            setSearch(mySearch);
          }}
        />
      </Col>

      <Col xs={12} md={6} lg={4}>
        <Form.Label>Discount / Bonus Percentage</Form.Label>
        <Form.Control
          type="search"
          placeholder="Discount / Bonus Percentage"
          value={discountPercentage}
          onChange={(event) => {
            const inputValue = event?.target?.value;
            if (/^\d*$/.test(inputValue)) {
              setPage(1);
              setDiscountPercentage(inputValue);
            }
          }}
        />
      </Col>

      <Col xs={12} md={6} lg={4}>
        <Form.Label>Max Users Availed</Form.Label>
        <Form.Control
          type="search"
          placeholder="Max Users Availed"
          value={maxUsersAvailed}
          onChange={(event) => {
            const inputValue = event?.target?.value;
            if (/^\d*$/.test(inputValue)) {
              setPage(1);
              setMaxUsersAvailed(inputValue);
            }
          }}
        />
      </Col>

      <Col xs={12} md={6} lg={3}>
        <Form.Label>Status</Form.Label>
        <Form.Select
          // size="sm"
          // defaultValue="all"
          onChange={(event) => {
            setPage(1);
            setStatus(event?.target?.value);
          }}
          value={status}
        >
          {statusOptions?.map((status, idx) => (
            <option key={status.label} value={status.value}>
              {status.label}
            </option>
          ))}
        </Form.Select>
      </Col>

      <Col xs={12} md={6} lg={3}>
        <Form.Label>Valid From</Form.Label>
        <Datetime
          key={validFrom}
          inputProps={{
            placeholder: "MM-DD-YYYY",
            readOnly: true,
          }}
          value={validFrom}
          onChange={(date) => setValidFrom(date)}
          timeFormat={false}
        />
      </Col>

      <Col xs={12} md={6} lg={3}>
        <Form.Label>Valid Till</Form.Label>
        <Datetime
          key={validTill}
          inputProps={{
            placeholder: "MM-DD-YYYY",
            readOnly: true,
          }}
          value={validTill}
          onChange={(date) => setValidTill(date)}
          timeFormat={false}
        />
      </Col>

      <Col xs={12} md={6} lg="auto">
        <Trigger message="Reset Filters" id={"redo"} />
        <Button id={"redo"} variant="secondary" onClick={resetFilters}>
          <FontAwesomeIcon icon={faRedoAlt} />
        </Button>
      </Col>
    </Row>
  );
};

export default PurchasePromocodeFilters;
