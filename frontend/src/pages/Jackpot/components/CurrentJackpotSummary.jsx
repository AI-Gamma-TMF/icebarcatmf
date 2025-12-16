import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "@themesberg/react-bootstrap";
import { formatNumber } from "../../../utils/helper";
import { jackpotSocket } from "../../../utils/socket";
import arrowUp from "../../../../src/assets/img/digit-up.svg";
import arrowDown from "../../../../src/assets/img/digit-down.svg";
import arrowNeutral from "../../../../src/assets/img/digit-neutral.svg";

const displayValue = (value, isDecimal = false, decimalPlaces = null) => {
  if (value === null || value === undefined) return decimalPlaces ? `0.${'0'.repeat(decimalPlaces)}` : "0";
  return formatNumber(value, { isDecimal, decimalPlaces });
};

const CurrentJackpotSummary = ({ runningJackpoTabs }) => {
  const [jackpotDetails, setJackpotDetails] = useState(runningJackpoTabs);

  useEffect(() => {
    const handleJackpotUpdate = (data) => {
      setJackpotDetails(data?.data);
    };
    jackpotSocket.on("JACKPOT_ADMIN_UPDATE", handleJackpotUpdate);
  }, []);


  return (
    <>
      <Row className="my-3">
        <Col lg={4} sm={6} className='mt-2'>
          <Card className="jackpot-card">
            <div className="card-text">
              <div className="jackpot-heading">
                <p>Total Spins Count</p>
              </div>
              <div className="d-flex  p-2  justify-content-between">
                <h5>{displayValue(jackpotDetails?.totalSpinCounts, true, 2)}</h5>

                {jackpotDetails?.totalSpinCountDiff > 0 ? (
                  <div className=" d-flex gap-1 align-items-center green">
                    <h5>{displayValue(jackpotDetails?.totalSpinCountDiff, true, 2)}</h5>
                    <img src={arrowUp} alt="arrow-log" />
                  </div>
                ) : (
                  <div className={`d-flex gap-1 align-items-center ${jackpotDetails?.totalSpinCountDiff < 0 ? 'red':'gray'}`}>
                    <h5>{displayValue(jackpotDetails?.totalSpinCountDiff, true, 2)}</h5>
                    <img src={jackpotDetails?.totalSpinCountDiff < 0 ? arrowDown: arrowNeutral} alt="arrow-log" />

                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col lg={4} sm={6} className='mt-2'>
          <Card className="jackpot-card">
            <div className="card-text">
              <div className="jackpot-heading">
                <p>Current Jackpot Pool</p>
              </div>
              <div className="d-flex  p-2  justify-content-between">
                <h5>{displayValue(jackpotDetails?.currentJackpotPool, true, 2)}</h5>

                {jackpotDetails?.currentJackpotPoolDiff > 0 ? (
                  <div className=" d-flex gap-1 align-items-center green">
                    <h5>{displayValue(jackpotDetails?.currentJackpotPoolDiff, true, 2)}</h5>
                    <img src={arrowUp} alt="arrow-log" />
                  </div>
                ) : (
                  <div className={`d-flex gap-1 align-items-center ${jackpotDetails?.currentJackpotPoolDiff < 0 ? 'red':'gray'}`}>
                    <h5>{displayValue(jackpotDetails?.currentJackpotPoolDiff, true, 2)}</h5>
                    <img src={jackpotDetails?.totalSpinCountDiff < 0 ? arrowDown: arrowNeutral} alt="arrow-log" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
        <Col lg={4} sm={6} className='mt-2'>
          <Card className="jackpot-card">
            <div className="card-text">
              <div className="jackpot-heading">
                <p>Current Jackpot Revenue</p>
              </div>
              <div className="d-flex  p-2  justify-content-between">
                <h5>{displayValue(jackpotDetails?.currentJackpotRevenue, true, 2)}</h5>

                {jackpotDetails?.currentJackpotRevenueDiff > 0 ? (
                  <div className=" d-flex gap-1 align-items-center green">
                    <h5>{displayValue(jackpotDetails?.currentJackpotRevenueDiff, true, 2)}</h5>
                    <img src={arrowUp} alt="arrow-log" />
                  </div>
                ) : (
                  <div className={`d-flex gap-1 align-items-center ${jackpotDetails?.currentJackpotRevenueDiff < 0 ? 'red':'gray'}`}>
                    <h5>{displayValue(jackpotDetails?.currentJackpotRevenueDiff, true, 2)}</h5>
                    <img src={jackpotDetails?.currentJackpotRevenueDiff < 0 ? arrowDown: arrowNeutral} alt="arrow-log" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CurrentJackpotSummary;
