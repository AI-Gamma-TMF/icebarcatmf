import { Button, Col, Form, Row } from "@themesberg/react-bootstrap";
import React from "react";
import { actionConstants, transactionConstants } from "../../constants";
import { formattedDate } from "../../../../utils/dateFormatter";
import Trigger from "../../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { onDownloadCsvClick } from "../../../../utils/helper";
import Datetime from 'react-datetime'


const ActivityTableFilters = ({
  startDate,
  endDate,
  providerName,
  setProviderName,
  transaction,
  setTransaction,
  coinType,
  setCoinType,
  action,
  setAction,
  data,
  resetFilters,
  casinoProvidersData,
  providerNameArray,
  getCsvDownloadUrl,
  handleStartDateChange,
  handleEndDateChange,
  errorEnd,
  errorStart,
  gameIdSearch,
  setGameIdSearch,
  gameNameSearch,
  setGameNameSearch,
  setPage,
}) => {
  const handleDownloadClick = async () => {
    try {
      let filename = "User_Activity";

      const formattedStartDate = formattedDate(startDate);
      const formattedEndDate = formattedDate(endDate);

      if (
        action == "all" &&
        transaction == "all" &&
        coinType == "all" &&
        providerName == "all"
      ) {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}`;
      } else if (
        action == "all" &&
        coinType == "all" &&
        providerName == "all"
      ) {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${transaction}`;
      } else if (
        transaction == "all" &&
        coinType == "all" &&
        providerName == "all"
      ) {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${action}`;
      } else if (
        action == "all" &&
        transaction == "all" &&
        providerName == "all"
      ) {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${coinType}`;
      } else if (action == "all" && transaction == "all" && coinType == "all") {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${providerName}`;
      } else if (action == "all") {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${transaction}_${coinType}_${providerName}`;
      } else if (transaction == "all") {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${action}_${coinType}_${providerName}`;
      } else if (coinType == "all") {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${action}_${transaction}_${providerName}`;
      } else if (providerName == "all") {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${action}_${transaction}_${coinType}`;
      } else {
        filename = `User_Activity_${formattedStartDate}_${formattedEndDate}_${action}_${transaction}_${coinType}_${providerName}`;
      }

      if (gameIdSearch) {
        filename += `_${gameIdSearch}`;
      }
      if (gameNameSearch) {
        filename += `_${gameNameSearch}`;
      }

      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };
  return (
    <Row className="player-activity-filters">
      {/* <Col xs="12" sm="6" lg="3" className="mb-3">
        <Form.Label column="sm" className="mx-auto text-nowrap px-2">
          Time Period
        </Form.Label>
        <DateRangePicker width="auto" state={state} setState={setState} timeZoneCode={timezoneOffset} startDate = {startDate} endDate={endDate}/>
      </Col> */}
      <Col xs={3} className="mb-3">
        <Form.Label>Game Id</Form.Label>

        <Form.Control
          type="search"
          placeholder="Search By Game Id"
          value={gameIdSearch}
          onChange={(event) => {
            const inputValue = event?.target?.value;
            if (/^\d*$/.test(inputValue)) {
              setPage(1);
              setGameIdSearch(inputValue);
            }
          }}
        />
      </Col>
      <Col xs={3} className="mb-3">
        <Form.Label>Game Name</Form.Label>

        <Form.Control
          type="search"
          placeholder="Search By Game Name"
          value={gameNameSearch}
          onChange={(event) => {
            setPage(1);
            // const mySearch = event?.target?.value?.replace(searchRegEx, '')
            setGameNameSearch(event?.target?.value);
          }}
        />
      </Col>
      <Col xs={3} className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Datetime
          value={startDate}
          onChange={handleStartDateChange}
          inputProps={{ readOnly: true }}
          timeFormat={false}
        />
        {errorStart && (
          <div style={{ color: "red", marginTop: "5px" }}>{errorStart}</div>
        )}
      </Col>

      <Col xs={3} className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Datetime
          value={endDate}
          timeFormat={false}
          onChange={handleEndDateChange}
          inputProps={{ readOnly: true }}
        />
        {errorEnd && (
          <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
        )}
      </Col>
      <Col xs={3} className="mb-3">
        <Form.Label>Actions</Form.Label>
        <Form.Select
          className="player-activity-filters__select"
          value={action}
          onChange={(e) => {
            setPage(1);
            setAction(e.target.value);
          }}
        >
          {actionConstants?.map(({ label, value }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Form.Select>
      </Col>

      <Col xs={3} className="mb-3">
        <Form.Label>Transaction</Form.Label>
        <Form.Select
          className="player-activity-filters__select"
          value={transaction}
          onChange={(e) => {
            setPage(1);
            setTransaction(e.target.value);
          }}
        >
          {transactionConstants?.map(({ label, value }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Form.Select>
      </Col>

      <Col xs={3} className="mb-3">
        <Form.Label>Coin Type</Form.Label>
        <Form.Select
          className="player-activity-filters__select"
          value={coinType}
          onChange={(e) => {
            setPage(1);
            setCoinType(e.target.value);
          }}
        >
          <option value="">All</option>
          <option value="GC">Gold Coins</option>
          <option value="SC">Sweep Coins</option>
        </Form.Select>
      </Col>
      {casinoProvidersData?.rows && casinoProvidersData?.rows.length > 0 ? (
        <>
          <Col xs={3} className="mb-3">
            <Form.Label>Provider</Form.Label>
            <Form.Select
              className="player-activity-filters__select"
              value={providerName}
              onChange={(e) => {
                setProviderName(e.target.value);
                setPage(1);
                setProviderName(e.target.value);
              }}
            >
              {providerNameArray?.map(({ label, value }) => {
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </>
      ) : (
        <></>
      )}

      <Col
        xs={12}
        className="d-flex justify-content-end align-items-end gap-2 mb-3"
      >
        <Trigger message="Download as CSV" id={"csv"} />
        <Button
          id={"csv"}
          variant="success"
          disabled={
            data?.rows.length === 0 ||
            data?.count === 0 ||
            data?.totalPages === null
          }
          onClick={handleDownloadClick}
        >
          <FontAwesomeIcon icon={faFileDownload} />
        </Button>

        <Trigger message="Reset Filters" id={"redo"} />
        <Button id={"redo"} variant="success" onClick={resetFilters}>
          <FontAwesomeIcon icon={faRedoAlt} />
        </Button>
      </Col>
    </Row>
  );
};

export default ActivityTableFilters;
