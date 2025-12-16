import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Col,
  Spinner,
  Form,
  Table,
} from "@themesberg/react-bootstrap";
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
import { intervalOptions } from "./constant";
import { getDateTime } from "../../../utils/dateFormatter";
import AutoRefreshControl from "./AutoRefreshControl";
import { formateBonusGraphData, getDateRange } from "./ScratchCardUtils";
import "./scratchCardStyle.scss";
import useScratchCardGraph from "./useScratchCardGraph";
import ScratchCardInfoPopup from "./ScratchCardInfoPopup";
import ScratchCardTypeDropdown from "./ScratchCardTypeDropdown";
import ScratchCardDashbaordSummary from "./ScratchCardDashbaordSummary";
import PaginationComponent from "../../../components/Pagination";
import { formatAmountWithCommas } from "../../../utils/helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ScratchCardGraph = () => {
  const [bonusGraphData, setBonusGraphData] = useState({
    labels: [],
    datasets: [],
  });
  const [showInfoBox, setShowInfoBox] = useState(false);

  const {
    scratchCardGraphData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    intervalTime,
    setIntervalTime,
    scratchCardId,
    setScratchCardId,
    scratchCardGraphDataLoading,
    resetFilters,
    selectedMetric,
    refreshInterval,
    setRefreshInterval,
    progress,
    countdownKey,
    selectedRange,
    setSelectedRange,
    scratchCardDropdownList,
    userDetail,
    page,
    setPage,
    userId,
    setUserId,
    search,
    error,
    errorStart,
    errorEnd,
    userScratchCardId,
    setUserScratchCardId,
    totalPages,
    limit,
    setLimit,
    handleChange,
    handleStartDateChange,
    handleEndDateChange,
    userStartDate,
    setUserStartDate,
    userEndDate,
    setUserEndDate,
  } = useScratchCardGraph();
  const [dateError, setDateError] = useState("");

  const quickRanges = ["1h", "3h", "12h", "1d", "3d", "1w", "Custom"];
  const [lastQuickRange, setLastQuickRange] = useState("1d");
  useEffect(() => {
    if (scratchCardGraphData?.data) {
      const formattedData = formateBonusGraphData(
        scratchCardGraphData?.data,
        selectedMetric.value,
        scratchCardGraphData?.dateFormat
      );
      setBonusGraphData(formattedData);
    }
  }, [scratchCardGraphData?.data, selectedMetric]);

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
        text: `Scratchcard Graph: ${selectedMetric.label} by Scratchcard Type`,
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const rawDate = scratchCardGraphData?.data?.[index]?.intervals;

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
      <Row className="mb-2 mt-4">
        <ScratchCardDashbaordSummary
          isLoading={scratchCardGraphDataLoading}
          scratchCardGraphData={scratchCardGraphData}
        />
      </Row>

      <div className="bonus-graph-container">
        <Row>
          <Col>
            <h3>Graph Filter</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={6} xl={4} className="mb-3">
            <label>Scratchcard</label>
            <ScratchCardTypeDropdown
              scratchCardId={scratchCardId}
              setScratchCardId={setScratchCardId}
              scratchCardDropdownList={scratchCardDropdownList}
            />
          </Col>
          <Col xs={12} md={12} lg={6} xl={4} className="mb-3">
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
                      value={startDate ? getDateTime(startDate) : ""}
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
                  className="d-flex position-relative justify-content-between gap-2 border rounded px-2 py-2 align-items-center"
                  style={{ top: "-3px" }}
                >
                  {/* Other ranges */}
                  <div className="d-flex gap-2">
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
          <Col xs={12} md={6} lg={4} xl={3}>
            <label>Interval</label>
            <Select
              value={intervalTime}
              onChange={setIntervalTime}
              options={intervalOptions}
              placeholder="Select Interval"
              isClearable={false}
            />
          </Col>
          <Col xs={12} md={6} lg={2} xl={1} className="mb-3">
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
          {scratchCardId?.length === 0 ? (
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
              No Scratchcard selected. Please select at least one.
            </div>
          ) : scratchCardGraphDataLoading ? (
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
            <ScratchCardInfoPopup
              bonusGraphData={bonusGraphData}
              selectedMetric={selectedMetric}
              setShowInfoBox={setShowInfoBox}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Row className="mt-4">
          <Col sm={8}>
            <h4>User Details</h4>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs="12" sm="6" lg="2" className="mb-3">
            <Form.Label>Scratchcard</Form.Label>
            <ScratchCardTypeDropdown
              scratchCardId={userScratchCardId}
              setScratchCardId={setUserScratchCardId}
              scratchCardDropdownList={scratchCardDropdownList}
            />
          </Col>
          <Col xs="12" sm="6" lg="2" className="mb-3">
            <Form.Label>User Id</Form.Label>
            <Form.Control
              type="number"
              value={userId}
              placeholder="Search By User Id"
              onChange={(event) => {
                setPage(1);
                setUserId(
                  event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, "")
                );
              }}
            />
          </Col>
          <Col xs="12" sm="6" lg="3" className="mb-3">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="search"
              value={search}
              placeholder="Search By Full Email"
              onChange={handleChange}
              isInvalid={!!error}
            />
            {error && (
              <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
            )}
          </Col>
          <Col
            xs="12"
            sm="6"
            lg="2"
            className="col-lg-2 col-sm-6 col-12 mt-2 mt-sm-0"
          >
            <Form.Label column="sm" className="mx-auto text-nowrap px-2">
              Start Date
            </Form.Label>
            <Datetime
              value={userStartDate}
              onChange={handleStartDateChange}
              timeFormat={false}
              inputProps={{ readOnly: true }}
            />
            {errorStart && (
              <div style={{ color: "red", marginTop: "5px" }}>{errorStart}</div>
            )}
          </Col>

          <Col
            xs="12"
            sm="6"
            lg="2"
            className="col-lg-2 col-sm-6 col-12 mt-2 mt-sm-0"
          >
            <Form.Label column="sm" className="mx-auto text-nowrap px-2">
              End Date
            </Form.Label>
            <Datetime
              value={userEndDate}
              onChange={handleEndDateChange}
              timeFormat={false}
              inputProps={{ readOnly: true }}
            />
            {errorEnd && (
              <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
            )}
          </Col>
        </Row>
        <div className="mt-4">
          <Table
            bordered
            striped
            responsive
            hover
            size="sm"
            className="text-center mt-4"
          >
            <thead className="thead-dark">
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Username</th>
                <th>Claimed Count</th>
                <th>SC Bonus Claimed</th>
                <th>GC Bonus Claimed</th>
                <th>Pending To Claimed SC Bonus</th>
                <th>Pending To Claimed GC Bonus</th>
                <th>Scratchcard Id</th>
              </tr>
            </thead>
            <tbody>
              {userDetail?.rows?.map((data, index) => {
                return (
                  <tr key={data.scratch_card_id}>
                    <td >{data.user_id}</td>
                    <td>{data.email}</td>
                    <td>{data.username}</td>
                    <td>{formatAmountWithCommas(data.total_claimed_count)}</td>
                    <td>{formatAmountWithCommas(data.total_sc_bonus_claimed)}</td>
                    <td>{formatAmountWithCommas(data.total_gc_bonus_claimed)}</td>
                    <td>{formatAmountWithCommas(data.pending_to_claim_sc_bonus)}</td>
                    <td>{formatAmountWithCommas(data.pending_to_claim_gc_bonus)}</td>
                    <td>{data.scratch_card_id}</td>
                  </tr>
                );
              })}
              {userDetail?.count === 0 && (
                <tr>
                  <td colSpan={7} className="text-danger text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {userDetail?.count !== 0 && (
            <PaginationComponent
              page={userDetail?.count < page ? setPage(1) : page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          )}
        </div>
      </Row>
    </>
  );
};

export default ScratchCardGraph;
