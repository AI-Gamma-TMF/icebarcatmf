import React, { useState } from "react";
import { playerTypeOptions } from "./constants";
import { Row, Col, Form, Button, Spinner } from "@themesberg/react-bootstrap";


import "react-datepicker/dist/react-datepicker.css";
import Datetime from "react-datetime";

const DashBoardFilters = ({
  setPlayerType,
  playerType,
  t,
  // timeZoneCode,
  reportRefetch,
  customerRefetch,
  transactionRefetch,
  economyRefetch,
  dashboardReportRefetchV2,
  economicDataAccordionOpen,
  transactionDataAccordianOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isDashboardReportRefetchingV2,
  isReportRefetching,
  isCustomerRefetching,
  isEconomyRefetching,
  isTransactionRefetching,
  customerRefetchV2,
}) => {
  const [loading, setLoading] = useState(false);
  const handleSearch = () => {
    try {
      reportRefetch();
      customerRefetch();
      dashboardReportRefetchV2();
      customerRefetchV2();

      transactionDataAccordianOpen && transactionRefetch();
      economicDataAccordionOpen && economyRefetch();
      setLoading(false);
    } catch (e) {
      console.log("error", e);
    }
  };
  return (
    <Row
      className="mt-3"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "row",
        alignContent: "center",
      }}
    >
      <Col className="col-lg-3 col-sm-12  col-12">
        <Form.Label>{t("filter.playerType.title")}</Form.Label>

        <Form.Select
          value={playerType}
          onChange={(event) => {
            setPlayerType(event.target.value);
          }}
        >
          {playerTypeOptions?.map(({ labelKey, value }) => {
            return (
              <option key={value} value={value}>
                {t(labelKey)}
              </option>
            );
          })}
        </Form.Select>
      </Col>
      <Col
        className="col-lg-3 col-sm-6 col-6 mt-2 mt-sm-0"
        // style={{ width: "250px" }}
      >
        <Form.Label column="sm" className="mx-auto text-nowrap px-2">
          Start Date
        </Form.Label>
        <Datetime
          value={startDate}
          onChange={(date) => setStartDate(date)}
          timeFormat={false}
          inputProps={{ readOnly: true }}
        />
      </Col>
      <Col
        className="col-lg-3 col-sm-6 col-6 mt-2 mt-sm-0"
        // style={{ width: "250px" }}
      >
        <Form.Label column="sm" className="mx-auto text-nowrap px-2">
          End Date
        </Form.Label>
        <Datetime
          value={endDate}
          onChange={(date) => setEndDate(date)}
          timeFormat={false}
          inputProps={{ readOnly: true }}
        />
      </Col>
      <Col className="col-lg-2 col-sm-6 col-12 d-flex align-items-end justify-content-center justify-content-md-start mt-3 mt-sm-3">
        <Button
          variant="outline-secondary"
          disabled={loading}
          onClick={handleSearch}
        >
          Search{" "}
          {(isDashboardReportRefetchingV2 ||
            isReportRefetching ||
            isCustomerRefetching ||
            isEconomyRefetching ||
            isTransactionRefetching) && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </Col>
    </Row>
  );
};

export default DashBoardFilters;
