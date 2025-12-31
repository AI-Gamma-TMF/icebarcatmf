import React from "react";
import {
  Col,
  Row,
  Card,
} from "@themesberg/react-bootstrap";
import RedeemGraph from "./RedeemGraph";
import "./redeemRateReport.scss";
const RedeemRateReport = () => {
  return (
    <>
      <div className="redeem-rate-report-page dashboard-typography">
        <Row className="d-flex align-items-center mb-2">
          <Col sm={12}>
            <h3 className="redeem-rate-report-page__title">Redeem Rate Report</h3>
            <div className="redeem-rate-report-page__subtitle">
              Track revenue vs redemptions, redemption rates, and export CSV.
            </div>
          </Col>
        </Row>

        <Col md={12} sm={12} className="mb-2">
          <Card className="p-2 redeem-rate-report-page__card">
            <RedeemGraph />
          </Card>
        </Col>
      </div>
    </>
  );
};

export default RedeemRateReport;
