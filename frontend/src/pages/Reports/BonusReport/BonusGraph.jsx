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
import useBonusGraph from "./useBonusGraph";
import { bonusMetricOptions, intervalOptions } from "./constant";
import { getDateTime } from "../../../utils/dateFormatter";
import BonusInfoPopup from "./BonusInfoPopup";
import BonusTypeDropdown from "./BonusTypeDropdown";
import AutoRefreshControl from "./AutoRefreshControl";
import { formateBonusGraphData, getDateRange } from "./BonusUtils";
import "./bonusReportStyle.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BonusGraph = () => {
  const [bonusGraphData, setBonusGraphData] = useState({
    labels: [],
    datasets: [],
  });
  const [showInfoBox, setShowInfoBox] = useState(false);

  const {
    bonusData: bonusGraphReportData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    intervalTime,
    setIntervalTime,
    bonusType,
    setBonusType,
    bonusGraphDataLoading,
    resetFilters,
    selectedMetric,
    setSelectedMetric,
    refreshInterval,
    setRefreshInterval,
    progress,
    countdownKey,
    selectedRange,
    setSelectedRange,
  } = useBonusGraph();

  const [dateError, setDateError] = useState("");

  const quickRanges = ["1h", "3h", "12h", "1d", "3d", "1w", "Custom"];
  const [lastQuickRange, setLastQuickRange] = useState("1d");

  useEffect(() => {
    if (bonusGraphReportData?.data) {
      const formattedData = formateBonusGraphData(
        bonusGraphReportData?.data,
        selectedMetric.value,
        bonusGraphReportData?.dateFormat
      );
      setBonusGraphData(formattedData);
    }
  }, [bonusGraphReportData?.data, selectedMetric]);

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Bonus Graph: ${selectedMetric.label} by Bonus Type`,
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const rawDate = bonusGraphReportData?.data?.[index]?.intervals;

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
          font: { weight: "bold" },
        },
        ticks: {
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
          text:
            selectedMetric.value === "totalNoOfUsers"
              ? "Total Claimed"
              : selectedMetric.value === "scBonus"
              ? "SC-Bonus"
              : "GC-Bonus",
          font: { weight: "bold" },
        },
      },
    },
  };

  return (
    <>
      <div className="bonus-graph-container">
        <Row>
          <Col xs={12} md={6} lg={3} className="mb-3">
            <label>Metric</label>
            <Select
              value={selectedMetric}
              onChange={setSelectedMetric}
              options={bonusMetricOptions}
              placeholder="Select Metric"
              isClearable={false}
              classNamePrefix="bonus-select"
            />
          </Col>

          <Col xs={12} md={6} lg={4} className="mb-3">
            <label>Bonus Types</label>
            <BonusTypeDropdown
              bonusType={bonusType}
              setBonusType={setBonusType}
            />
          </Col>

          <Col xs={12} md={12} lg={5} className="mb-3">
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
                    className="bonus-graph__clear-custom-btn"
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
                <div className="quick-range-wrapper">
                  {/* Other ranges */}
                  <div className="d-flex gap-3">
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
                  </div>

                  {/* Custom range */}
                  {quickRanges.includes("Custom") && (
                    <div>
                      <span
                        className={`cursor-pointer ${
                          selectedRange === "Custom"
                            ? "text-primary fw-bold"
                            : ""
                        }`}
                        onClick={() => setSelectedRange("Custom")}
                        style={{ cursor: "pointer" }}
                      >
                        Custom{" "}
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="ms-1 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRange("Custom");
                          }}
                        />
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6} lg={3}>
            <label>Interval</label>
            <Select
              value={intervalTime}
              onChange={setIntervalTime}
              options={intervalOptions}
              placeholder="Select Interval"
              isClearable={false}
              classNamePrefix="bonus-select"
            />
          </Col>

          <Col xs={12} md={6} lg={3} className="mb-3">
            <AutoRefreshControl
              resetFilters={resetFilters}
              refreshInterval={refreshInterval}
              setRefreshInterval={setRefreshInterval}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12} lg={12}>
            {refreshInterval !== "off" && (
              <div className="progress-bar-track">
                <div
                  key={countdownKey}
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Col
        xs={12}
        className="bonus-graph__info-wrap mb-3"
      >
        <Trigger message="View Graph Info" id="infoBoxTrigger" />
        <Button
          id="infoBoxTrigger"
          variant="outline-primary"
          onClick={() => setShowInfoBox((prev) => !prev)}
          className="bonus-info-btn ms-2"
        >
          <FontAwesomeIcon icon={faInfo} />
        </Button>
      </Col>

      <Row>
        <Col xs={12}>
          {bonusType?.length === 0 ? (
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
              No Bonus Type selected. Please select at least one.
            </div>
          ) : bonusGraphDataLoading ? (
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
              <Line data={bonusGraphData} options={options} />
            </div>
          )}
          {showInfoBox && (
            <BonusInfoPopup
              bonusGraphData={bonusGraphData}
              selectedMetric={selectedMetric}
              setShowInfoBox={setShowInfoBox}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default BonusGraph;
