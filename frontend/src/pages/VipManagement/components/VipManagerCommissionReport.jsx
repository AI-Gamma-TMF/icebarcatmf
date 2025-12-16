import React, { useEffect } from "react";
import { Row, Col, Form, Table } from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import useCommissionReport from "../hooks/useCommissionReport";
import { InlineLoader } from "../../../components/Preloader";
import { commissionHeader } from "../constants";
import moment from "moment";
import { formatNumber } from "../../../utils/helper";

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
      <Row className="mt-3">
        <h3 className="w-auto">Manager Commission Report</h3>
      </Row>
      <Row className="mt-3">
        <Col className="col-lg-3 col-sm-6 col-6 mt-2 mt-sm-0">
          <Form.Label column="sm" className="mx-auto text-nowrap px-2">
            Start Date
          </Form.Label>
          <Datetime
            value={startDate}
            onChange={(date) => setStartDate(date)}
            timeFormat={false}
            inputProps={{ readOnly: true }}
          />
          {dateError && (
            <div className="text-danger fw-bold" style={{ fontSize: "12px" }}>
              {dateError}
            </div>
          )}
        </Col>
        <Col className="col-lg-3 col-sm-6 col-6 mt-2 mt-sm-0">
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
        <Col sm={6} lg={2}>
          <Form.Group>
            <Form.Label>Final VIP status</Form.Label>
            <Form.Select
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
        <Col sm={6} lg={2}>
          <Form.Group>
            <Form.Label>Managed By</Form.Label>
            <Form.Select
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
                    {manager.firstName} {manager?.lastName} (Staff Id -{" "}
                    {manager?.adminUserId})
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
          <tr>
            {commissionHeader.map((header, index) => (
              <th key={header.value}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            VipcommissionReport && (
              <>
                <tr>
                  <td>GGR (SC) </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_GGR_TOTAL?.CUSTOM_DATE,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_GGR_TOTAL?.LAST_MONTH,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_GGR_TOTAL?.LAST_WEEK,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_GGR_TOTAL?.MONTHLY_AVERAGE,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_GGR_TOTAL?.MONTH_TO_DATE,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_GGR_TOTAL?.YEAR_TO_DATE,
                      { isDecimal: true }
                    )}
                  </td>
                </tr>
                <tr>
                  <td>NGR (SC)</td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_NGR_TOTAL?.CUSTOM_DATE,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_NGR_TOTAL?.LAST_MONTH,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_NGR_TOTAL?.LAST_WEEK,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_NGR_TOTAL?.MONTHLY_AVERAGE,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_NGR_TOTAL?.MONTH_TO_DATE,
                      { isDecimal: true }
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      VipcommissionReport?.SC_NGR_TOTAL?.YEAR_TO_DATE,
                      { isDecimal: true }
                    )}
                  </td>
                </tr>
              </>
            )
          )}
        </tbody>
      </Table>
    </>
  );
};

export default VipManagerCommissionReport;
