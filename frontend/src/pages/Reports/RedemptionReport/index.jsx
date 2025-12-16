import React, { useState } from "react";
import {
  Table,
  Button,
  Col,
  Row,
  Form,
  Accordion,
  Card,
} from "@themesberg/react-bootstrap";
import { InlineLoader } from "../../../components/Preloader";
import PaginationComponent from "../../../components/Pagination";
import useRedeemReport from "./useRedeemReport";
import Datetime from "react-datetime";
import moment from "moment";
import { formatAmountWithCommas } from "../../../utils/helper";
import RedeemReport from "./RedeemReport";

import RedeemGraph from "./RedeemGraph";
const RedeemRateReport = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { redeemRefetch } = useRedeemReport();
  const handleAccordionToggle = () => {
    setIsAccordionOpen((prev) => !prev);
  };

  return (
    <>
      <Row className="mb-3">
        <Col sm={12}>
          <h3>Redeem Rate Report</h3>
        </Col>
      </Row>
      <Col md={12} sm={12} className="my-3">
        <Card className=" tournament-card p-2">
          <RedeemGraph />
        </Card>
      </Col>
      
    </>
  );
};

export default RedeemRateReport;
