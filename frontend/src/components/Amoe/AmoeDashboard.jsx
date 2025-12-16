import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import { Col, Row, Card } from "@themesberg/react-bootstrap";
import useAmoeDashboard from "../../pages/PlayerDetails/hooks/useAmoeDashboard";
import AmoeClaimedDetailsChart from "./AmoeClaimedDetailsChart";
import AmoeScannedDetailsChart from "./AmoeScannedDetailChart";
import { formatPriceWithCommas } from "../../utils/helper";

const formatScannedDetailsChartData = (responseData = []) => {
  const labels = [];
  const scannedData = [];

  responseData?.forEach(({ scannedDate, count }) => {
    labels.push(scannedDate);
    scannedData.push(count);
  });
  return { labels, scannedData };
};

const formatClaimedDetailsChartData = (responseData = []) => {
  const labels = [];
  const claimedData = [];

  responseData?.forEach(({ registeredDate, count }) => {
    labels.push(registeredDate);
    claimedData.push(count);
  });
  return { labels, claimedData };
};

const AmoeDashboard = ({ _amoeData }) => {
  const { amoeDashboardData, startDate, setStartDate, endDate, setEndDate, isLoadingAmoeData } = useAmoeDashboard({
    isUTC: false,
  });

  const [scannedDetailsChart, setScannedDetailsChart] = useState({
    labels: [],
    scannedData: [],
  });
  const [claimedDetailsChart, setClaimedDetailsChart] = useState({
    labels: [],
    claimedData: [],
  });

  useEffect(() => {
    if (amoeDashboardData) {
      const formattedScannedDetailsData = formatScannedDetailsChartData(
        amoeDashboardData?.scannedDetails
      );
      setScannedDetailsChart(formattedScannedDetailsData);

      const formattedClaimedDetailsData = formatClaimedDetailsChartData(
        amoeDashboardData?.registeredDetails
      );
      setClaimedDetailsChart(formattedClaimedDetailsData);
    }
  }, [amoeDashboardData]);
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const stripTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date); // Always update state first
    const selected = stripTime(date);
    const end = endDate ? stripTime(endDate) : null;

    if (end && selected > end) {
      setStartDateError("Start date cannot be after end date.");
      setEndDateError("");
    } else {
      setStartDateError("");
      setEndDateError("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date); // Always update state first
    const selected = stripTime(date);
    const start = startDate ? stripTime(startDate) : null;

    if (start && selected < start) {
      setEndDateError("End date cannot be before start date.");
      setStartDateError("");
    } else {
      setEndDateError("");
      setStartDateError("");
    }
  };

  return (
    <>
      <div className="ps-0">
        <div className="tournament-detail-wrap mt-4">
          <Card className=" tournament-card p-2">
            <div>
              <h3>Total GC Claimed Amount</h3>
              <h3>{`${formatPriceWithCommas(
                amoeDashboardData?.totalClaimedDetails?.totalGcAmountClaimed
              )} GC`}</h3>
            </div>
            <div>
              <img src="/entry-amount-gc.png" alt="ggr" />
            </div>
          </Card>
          <Card className=" tournament-card p-2">
            <div>
              <h3>Total SC Claimed Amount</h3>
              <h3>{`${formatPriceWithCommas(
                amoeDashboardData?.totalClaimedDetails?.totalScAmountClaimed
              )} SC`}</h3>
            </div>
            <div>
              <img src="/total-sc-amoe.png" alt="ggr" />
            </div>
          </Card>
          <Card className="tournament-card p-2 ">
            <div>
              <h3>Total Claimed Count</h3>
              <h3>
                {formatPriceWithCommas(
                  amoeDashboardData?.totalClaimedDetails?.totalClaimedCount
                )}
              </h3>
            </div>
            <div>
              <img src="/claimed-count.png" alt="ggr" />
            </div>
          </Card>
          <Card className="tournament-card p-2 ">
            <div>
              <h3>Unique User Count</h3>
              <h3>
                {formatPriceWithCommas(
                  amoeDashboardData?.totalClaimedDetails?.uniqueUserCount
                )}
              </h3>
            </div>
            <div>
              <img src="/user-count.png" alt="ggr" />
            </div>
          </Card>
        </div>
      </div>

      <Row style={{ marginTop: "50px" }}>
        <Col sm={6} lg={2} style={{ marginBottom: "1rem" }}>
          <label>
            Start Date:
            <Datetime
              value={startDate}
              onChange={handleStartDateChange}
              timeFormat={false}
              inputProps={{ readOnly: true }}
            />
          </label>
          {startDateError && (
            <div style={{ color: "red", marginTop: "0.5rem" }}>
              {startDateError}
            </div>
          )}
        </Col>

        <Col sm={6} lg={2}>
          <label>
            End Date:
            <Datetime
              value={endDate}
              onChange={handleEndDateChange}
              timeFormat={false}
              inputProps={{ readOnly: true }}
            />
          </label>
          {endDateError && (
            <div style={{ color: "red", marginTop: "0.5rem" }}>
              {endDateError}
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-0">
        <Col md={6} sm={6} className="mt-5">
          <Card className=" tournament-card p-2">
            <AmoeScannedDetailsChart
              labels={scannedDetailsChart?.labels}
              scannedData={scannedDetailsChart?.scannedData}
              isLoadingAmoeData={isLoadingAmoeData}
            />
          </Card>
        </Col>
        <Col md={6} sm={6} className="mt-5">
          <Card className=" tournament-card p-2">
            <AmoeClaimedDetailsChart
              labels={claimedDetailsChart?.labels}
              claimedData={claimedDetailsChart?.claimedData}
              isLoadingAmoeData={isLoadingAmoeData}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AmoeDashboard;
