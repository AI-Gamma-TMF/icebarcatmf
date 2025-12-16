import React, { useState, useEffect } from "react";
import { Row, Button, Col, Spinner } from "@themesberg/react-bootstrap";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import Datetime from "react-datetime";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Trigger from "../../../components/OverlayTrigger";
import { getDateTime } from "../../../utils/dateFormatter";
import AutoRefreshControl from "../../Reports/BonusReport/AutoRefreshControl";
import useJackpotGraph from "../hooks/useJackpotGraph";
import { intervalOptions } from "../../Reports/BonusReport/constant";
import GraphYDropDown from "./GraphYDropDown";
import {
  createLineChartDataSet,
  getGraphTitle,
  getYAxisLabel,
} from "../jackpotGraphUtils";
import JackpotGraphInfoPopup from "./JackpotGraphInfo";
import { getDateRange } from "../../Reports/BonusReport/BonusUtils";
import { formatNumber } from "../../../utils/helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const JackpotGraph = () => {
  const [jackpotGraphData, setJackpotGraphData] = useState({
    labels: [],
    datasets: [],
  });
  const [showInfoBox, setShowInfoBox] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const {
    jackpotData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    intervalTime,
    setIntervalTime,
    jackpotMetrics,
    setJackpotMetrics,
    jackpotGraphDataLoading,
    resetFilters,
    refreshInterval,
    setRefreshInterval,
    progress,
    countdownKey,
    selectedRange,
    setSelectedRange,
    dateError,
    setDateError,
  } = useJackpotGraph();

  const quickRanges = ["1h", "3h", "12h", "1d", "3d", "1w", "Custom"];
  const [lastQuickRange, setLastQuickRange] = useState("1d");

  useEffect(() => {
    if (jackpotData?.data) {
      const formattedData = createLineChartDataSet(
        jackpotData?.data,
        jackpotMetrics,
        jackpotData?.dateFormat
      );
      setJackpotGraphData(formattedData);
    }
  }, [jackpotData?.data, jackpotMetrics]);

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

  const integerOnlyMetrics = [
    "spinCount",
    "totalBetCount",
    "newlyOptedInUsers",
  ];
  const shouldUseIntegerY = jackpotMetrics.every((metric) =>
    integerOnlyMetrics.includes(metric.value)
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: getGraphTitle(jackpotMetrics),
        font: { weight: "bold", size: 14 },
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const rawDate = jackpotData?.data?.[index]?.intervals;

            return rawDate
              ? moment(rawDate).format("MM-DD-YYYY HH:mm")
              : tooltipItems[0].label;
          },
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Duration with Interval",
          font: { weight: "bold", size: 14 },
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 14,
          },
          callback: function (val, index, ticks) {
            const total = ticks.length;
            const showEvery = Math.ceil(total / 10);
            return index % showEvery === 0 ? this.getLabelForValue(val) : "";
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: getYAxisLabel(jackpotMetrics),
          font: { weight: "bold", size: 14 },
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 14,
          },
          stepSize: shouldUseIntegerY ? 1 : undefined, // force integer steps
          callback: function (value) {
            if (shouldUseIntegerY) {
              return Number.isInteger(value) ? formatNumber(value) : "";
            }
            return formatNumber(value, { isDecimal: true, decimalPlaces: 2 });
          },
        },
      },
    },
  };

  return (
    <>
      <div className="bonus-graph-container">
        <Row className="mb-3">
          <Col xs={12} md={12} lg={3} className="mb-3">
            <label>Jackpot Metrics</label>
            <GraphYDropDown
              jackpotMetrics={jackpotMetrics}
              setJackpotMetrics={setJackpotMetrics}
            />
          </Col>

          <Col xs={12} md={12} lg={2} className="mb-3">
            <label>Interval</label>
            <Select
              value={intervalTime}
              onChange={setIntervalTime}
              options={intervalOptions}
              placeholder="Select Interval"
              isClearable={false}
            />
          </Col>
          <Col xs={12} md={12} lg={6} xl={5} className="mb-3">
            {selectedRange === "Custom" ? (
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <label>Start Date</label>
                    <Datetime
                      value={startDate ? getDateTime(startDate) : ""}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="MM-DD-YYYY"
                      timeFormat={true}
                      inputProps={{ readOnly: true }}
                    />
                  </div>
                  <div>
                    <label>End Date</label>
                    <Datetime
                      value={endDate ? getDateTime(endDate) : ""}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="MM-DD-YYYY"
                      timeFormat={true}
                      inputProps={{ readOnly: true }}
                    />
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setSelectedRange(lastQuickRange);
                      const { startDate, endDate } = getDateRange("1d");
                      setStartDate(startDate);
                      setEndDate(endDate);
                    }}
                    style={{ marginTop: "25px", height: "38px" }}
                  >
                    &times;
                  </Button>
                </div>
                {dateError && (
                  <div
                    className="text-danger fw-bold"
                    style={{ marginTop: "-8px", fontSize: "12px" }}
                  >
                    {dateError}
                  </div>
                )}
              </div>
            ) : (
              <>
                <label>Time Duration</label>
                <div
                  // className="d-flex position-relative justify-content-between align-items-center gap-3 gap-md-3 border w-content rounded px-2 py-1 px-sm-3 py-sm-2 position-relative mt-4"
                  className="d-flex position-relative justify-content-between gap-3 border rounded px-3 py-2 align-items-center"
                  style={{ top: "-3px", width: "fit-content" }}
                >
                  <div className="d-flex gap-2 gap-lg-4 gap-md-3">
                    {quickRanges
                      .filter((range) => range !== "Custom")
                      .map((range) => (
                        <span
                          key={range}
                          className={`cursor-pointer ${
                            selectedRange === range
                              ? "text-primary fw-bold"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setLastQuickRange(range);
                            setSelectedRange(range);
                            const { startDate, endDate } = getDateRange(range);
                            setStartDate(startDate);
                            setEndDate(endDate);
                          }}
                        >
                          {range}
                        </span>
                      ))}

                    {quickRanges.includes("Custom") && (
                      <span
                        className={`cursor-pointer ${
                          selectedRange === "Custom"
                            ? "text-primary fw-bold"
                            : ""
                        }`}
                        onClick={() => setSelectedRange("Custom")}
                      >
                        <span className="d-none d-sm-inline">Custom</span>
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="ms-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRange("Custom");
                          }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </Col>

          <Col
            xs={12}
            md={12}
            lg={2}
            // className="justify-content-md-end justify-content-start d-flex"
          >
            <AutoRefreshControl
              resetFilters={resetFilters}
              refreshInterval={refreshInterval}
              setRefreshInterval={setRefreshInterval}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {refreshInterval !== "off" && (
              <div
                style={{
                  height: "4px",
                  width: "100%",
                  backgroundColor: "#e9ecef",

                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  key={countdownKey}
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: "#0d6efd",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Col
        xs={12}
        className="mb-3"
        style={{ marginTop: "25px", display: "flex", justifyContent: "end" }}
      >
        <Trigger message="View Graph Info" id="infoBoxTrigger" />
        <Button
          id="infoBoxTrigger"
          variant="outline-primary"
          onClick={() => setShowInfoBox((prev) => !prev)}
          className="ms-2"
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            borderRadius: "50%",
            backgroundColor: "#CCCCCC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            border: "none",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FontAwesomeIcon icon={faInfo} />
        </Button>
      </Col>

      <Row>
        <Col xs={12}>
          {jackpotMetrics?.length === 0 ? (
            <div
              className="text-center"
              style={{
                padding: "50px",
                height: "450px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "red",
              }}
            >
              No Jackpot Metrics selected. Please select at least one.
            </div>
          ) : jackpotGraphDataLoading ? (
            <div
              className="loader"
              style={{
                textAlign: "center",
                padding: "50px",
                height: "450px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spinner animation="border" />
            </div>
          ) : (
            <div style={{ height: "450px", width: "100%" }}>
              <Line data={jackpotGraphData} options={options} />
            </div>
          )}
          {showInfoBox && (
            <JackpotGraphInfoPopup
              jackpotGraphData={jackpotGraphData}
              setShowInfoBox={setShowInfoBox}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default JackpotGraph;
