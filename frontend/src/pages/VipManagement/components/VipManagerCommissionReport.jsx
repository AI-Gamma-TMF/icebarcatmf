import React, { useEffect } from "react";
import { Row, Col, Form, Table, Card } from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import useCommissionReport from "../hooks/useCommissionReport";
import { InlineLoader } from "../../../components/Preloader";
import { commissionHeader } from "../constants";
import moment from "moment";
import { formatNumber } from "../../../utils/helper";
import "./vipCommissionReport.scss";

const VipManagerCommissionReport = () => {
  const {
    VipcommissionReport,
    isLoading,
    vipManagersList,
    isLoadingManagers,
    setManagedBySearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setVipStatus,
    setDateError,
    dateError,
  } = useCommissionReport();

  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);

      if (start.isAfter(end)) {
        setDateError("Start date cannot be after End date.");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  }, [startDate, endDate]);
  return (
    <>
      <div className="vip-commission-page dashboard-typography">
        <Row className="align-items-center mb-2">
          <Col xs={12}>
            <h3 className="vip-commission-page__title">Manager Commission Report</h3>
            <div className="vip-commission-page__subtitle">
              Compare VIP manager performance across custom range, last week/month, MTD and YTD.
            </div>
          </Col>
        </Row>

        <Card className="vip-commission-page__filters dashboard-filters p-3 mb-3">
          <Row className="g-3 align-items-start">
            <Col xs={12} sm={6} lg={3}>
              <Form.Label className="form-label">Start Date</Form.Label>
              <Datetime
                value={startDate}
                onChange={(date) => setStartDate(date)}
                timeFormat={false}
                inputProps={{ readOnly: true }}
              />
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Form.Label className="form-label">End Date</Form.Label>
              <Datetime
                value={endDate}
                onChange={(date) => setEndDate(date)}
                timeFormat={false}
                inputProps={{ readOnly: true }}
              />
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Form.Group>
                <Form.Label className="form-label">Final VIP Status</Form.Label>
                <Form.Select
                  className="vip-commission-page__select"
                  onChange={(event) => {
                    setVipStatus(event?.target?.value);
                  }}
                >
                  <option value="">All</option>
                  <option value="approved">Approved VIP</option>
                  <option value="rejected">Revoked VIP</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <Form.Group>
                <Form.Label className="form-label">Managed By</Form.Label>
                <Form.Select
                  className="vip-commission-page__select"
                  onChange={(event) => {
                    setManagedBySearch(event?.target?.value);
                  }}
                >
                  <option value="all">All</option>
                  {!isLoadingManagers &&
                    vipManagersList?.map((manager) => (
                      <option
                        key={manager?.adminUserId}
                        value={manager?.adminUserId}
                      >
                        {manager.firstName} {manager?.lastName} (Staff Id - {manager?.adminUserId})
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {dateError ? (
              <Col xs={12}>
                <div className="vip-commission-page__error text-danger fw-bold">
                  {dateError}
                </div>
              </Col>
            ) : null}
          </Row>
        </Card>

        <div className="vip-commission-page__table-wrap table-responsive dashboard-table">
          <Table hover size="sm" className="dashboard-data-table vip-commission-table text-center">
            <thead>
              <tr>
                {commissionHeader.map((header) => (
                  <th key={header.value}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={commissionHeader.length} className="text-center">
                    <InlineLoader />
                  </td>
                </tr>
              ) : VipcommissionReport ? (
                <>
                  <tr>
                    <td>GGR (SC)</td>
                    <td>{formatNumber(VipcommissionReport?.SC_GGR_TOTAL?.CUSTOM_DATE, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_GGR_TOTAL?.LAST_MONTH, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_GGR_TOTAL?.LAST_WEEK, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_GGR_TOTAL?.MONTHLY_AVERAGE, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_GGR_TOTAL?.MONTH_TO_DATE, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_GGR_TOTAL?.YEAR_TO_DATE, { isDecimal: true })}</td>
                  </tr>
                  <tr>
                    <td>NGR (SC)</td>
                    <td>{formatNumber(VipcommissionReport?.SC_NGR_TOTAL?.CUSTOM_DATE, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_NGR_TOTAL?.LAST_MONTH, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_NGR_TOTAL?.LAST_WEEK, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_NGR_TOTAL?.MONTHLY_AVERAGE, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_NGR_TOTAL?.MONTH_TO_DATE, { isDecimal: true })}</td>
                    <td>{formatNumber(VipcommissionReport?.SC_NGR_TOTAL?.YEAR_TO_DATE, { isDecimal: true })}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={commissionHeader.length} className="text-center">
                    <span className="vip-commission-page__empty">No data found</span>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default VipManagerCommissionReport;
