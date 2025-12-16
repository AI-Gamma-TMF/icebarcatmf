import React, { useState } from "react";
import useCasinoTransactionsList from "../hooks/useCasinoTransactionsList";
import { Button, Col, Row, Form } from "@themesberg/react-bootstrap";
import { formattedDate } from "../../../utils/dateFormatter";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { actionTypeOptions, coinTypeOptions } from "../constants";
import CasinoTransactionsList from "../../../components/CasinoTransactionsList";
import { convertTimeZone, onDownloadCsvClick } from "../../../utils/helper";
import Datetime from "react-datetime";
import ReactCreatable from "../../../components/ReactSelectField/ReactCreatable";

const CasinoTransactions = ({ email, isAllUser }) => {
  const {
    t,
    setSelectedCurrency,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedCurrency,
    selectedAction,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    transactionData,
    loading,
    setStatus,
    getCsvDownloadUrl,
    search,
    setSearch,
    setSearchCasinoId,
    setSearchTransactionId,
    searchCasinoId,
    timeZoneCode,
    searchTransactionId,
    gameIdsOptions,
    isSelectLoading,
    gameId,
    setGameId,
    scCoin,
    setScCoin,
    gameName,
    setGameName,
    setSearchUserName,
    setSearchUserId,
    searchUserName,
    searchUserId,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    selected,handleReset,
    errorEnd, setErrorEnd,errorStart, setErrorStart
  } = useCasinoTransactionsList(email);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
 
  const handleDownloadClick = async () => {
    const formattedStartDate = formattedDate(startDate);
    const formattedEndDate = formattedDate(endDate);
    try {
      let currency = "";
      if (selectedCurrency == 0) {
        currency = "GC";
      } else if (selectedCurrency == 1) {
        currency = "SC";
      }
      let filename = "Casino_Transaction";

      if (search) {
        filename += `_${search}`;
      }
      if (searchCasinoId) {
        filename += `_${searchCasinoId}`;
      }
      if (searchTransactionId) {
        filename += `_${searchTransactionId}`;
      }
      if (scCoin) filename += `_${scCoin}`;
      if (gameId || gameName?.value)
        filename += `_${gameId || gameName?.value}`;
      if (selectedCurrency == "all" && selectedAction == "all") {
        filename += `_${formattedStartDate}_${formattedEndDate}`;
      } else if (selectedCurrency == "all") {
        filename += `_${selectedAction}_${formattedStartDate}_${formattedEndDate}`;
      } else if (selectedAction == "all") {
        filename += `_${currency}_${formattedStartDate}_${formattedEndDate}`;
      } else {
        filename += `_${currency}_${selectedAction}_${formattedStartDate}_${formattedEndDate}`;
      }

      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setDownloadInProgress(false);
    }
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date && date.isAfter(endDate)) {
      setErrorStart("Start date cannot be greater than end date.");
    } else {
      setErrorEnd("");
      setErrorStart("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date && date.isBefore(startDate)) {
      setErrorEnd("End date must be greater than the start date.");
    } else {
      setErrorStart("");
      setErrorEnd("");
    }
  };
  return (
    <>
      {isAllUser && (
        <Row className="mb-3">
          <Col sm={12}>
            <h3>{t("transactions.casinoTransactions")}</h3>
          </Col>
        </Row>
      )}
      <Row className="w-100 m-auto">
        {isAllUser && (
          <Col xs="12" sm="6" lg="3" className="mb-3">
            <Form.Label
              style={{
                marginBottom: "0",
                marginRight: "15px",
                marginTop: "5px",
              }}
            >
              {t("transactions.filters.search")}
            </Form.Label>

            <Form.Control
              type="search"
              value={search}
              placeholder="Search By Email"
              onChange={(event) => {
                setPage(1);
                // Remove spaces and special characters
                setSearch(
                  event.target.value
                    .replace(/\s+/g, "") // remove spaces
                    .replace(/[~`!$%^&*#=)()><?]+/g, "")
                );
              }}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault(); // Block space key
                }
              }}
            />
          </Col>
        )}
        {isAllUser && (
          <Col xs="12" sm="6" lg="3" className="mb-3">
            <Form.Label
              style={{
                marginBottom: "0",
                marginRight: "15px",
                marginTop: "5px",
              }}
            >
              {t("transactions.filters.casinoTransactionId")}
            </Form.Label>

            <Form.Control
              type="number"
              value={searchCasinoId}
              placeholder="Search By Casino Txn Id"
              onChange={(event) => {
                setPage(1);
                // Remove spaces and special characters
                setSearchCasinoId(
                  event.target.value
                    .replace(/\s+/g, "") // remove spaces
                    .replace(/[~`!$%^&*#=)()><?]+/g, "")
                );
              }}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault(); // Block space key
                }
              }}
            />
          </Col>
        )}
        {isAllUser && (
          <Col xs="12" sm="6" lg="3" className="mb-3">
            <Form.Label
              style={{
                marginBottom: "0",
                marginRight: "15px",
                marginTop: "5px",
              }}
            >
              {t("transactions.filters.externalTransactionId")}
            </Form.Label>

            <Form.Control
              type="search"
              value={searchTransactionId}
              placeholder="Search By External Txn Id"
              onChange={(event) => {
                setPage(1);
                // Remove spaces and special characters
                setSearchTransactionId(
                  event.target.value
                    .replace(/\s+/g, "") // remove spaces
                    .replace(/[~`!$%^&*#=)()><?]+/g, "")
                );
              }}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault(); // Block space key
                }
              }}
            />
          </Col>
        )}

        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            {t("history.filters.coinType")}
          </Form.Label>

          <Form.Select
            onChange={(e) => {
              setPage(1);
              setSelectedCurrency(e.target.value);
            }}
            value={selectedCurrency}
          >
            {coinTypeOptions &&
              coinTypeOptions?.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            Action Type
          </Form.Label>

          <Form.Select
            onChange={(e) => {
              setPage(1);
              setSelectedAction(e.target.value);
            }}
            value={selectedAction}
          >
            {actionTypeOptions &&
              actionTypeOptions?.map(({ label, value }) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
          </Form.Select>
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            Game Id
          </Form.Label>

          <Form.Control
            type="search"
            value={gameId}
            placeholder="Search By game Id"
            onChange={(event) => {
              setPage(1);
              setGameId(event.target.value.replace(/^0|[^\d]/g, ""));
            }}
          />
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            Game Name
          </Form.Label>
          <ReactCreatable
            options={gameIdsOptions}
            value={gameName}
            setValue={(dataValue) => {
              setGameName(dataValue);
            }}
            isMulti={false}
            isLoading={isSelectLoading}
          />
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            Sc Coin
          </Form.Label>

          <Form.Control
            type="search"
            value={scCoin}
            placeholder="Search By Sc Coin"
            onChange={(event) => {
              setPage(1);
              setScCoin(
                event.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1")
                  .replace(/^(\d+)(\.\d{0,2})?.*/, "$1$2")
              );
            }}
          />
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            Start Date
          </Form.Label>
          <Datetime
            value={startDate}
            onChange={handleStartDateChange}
            inputProps={{ readOnly: true }}
            timeFormat={true}
          />
          {errorStart && (
            <div style={{ color: "red", marginTop: "5px" }}>{errorStart}</div>
          )}
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
          >
            End Date
          </Form.Label>
          <Datetime
            value={endDate}
            timeFormat={true}
            onChange={handleEndDateChange}
            inputProps={{ readOnly: true }}
          />
          {errorEnd && (
            <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
          )}
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{
              marginBottom: "0",
              marginRight: "15px",
              marginTop: "5px",
            }}
          >
            {t("transactions.filters.userId")}
          </Form.Label>
          <Form.Control
            type="search"
            value={searchUserId}
            placeholder="Search By User Id"
            onChange={(event) => {
              setPage(1);
              setSearchUserId(event.target.value.replace(/^0|[^\d]/g, ""));
            }}
          />
        </Col>
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{
              marginBottom: "0",
              marginRight: "15px",
              marginTop: "5px",
            }}
          >
            {t("transactions.filters.userName")}
          </Form.Label>

          <Form.Control
            type="search"
            value={searchUserName}
            placeholder="Search By User Name"
            onChange={(event) => {
              setPage(1);
              // Remove spaces and special characters
              setSearchUserName(
                event.target.value
                  .replace(/\s+/g, "") // remove spaces
                  .replace(/[~`!$%^&*#=)()><?]+/g, "")
              );
            }}
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.preventDefault(); // Block space key
              }
            }}
          />
        </Col>
        <Col
          xs="12"
          sm="6"
          lg="1"
          className="d-flex align-items-end mt-2 mt-sm-0 mb-0 mb-sm-3"
        >
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            onClick={() => {
              handleReset()
            }}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>

          <Trigger message="Download as CSV" id={"csv"} />
          <Button
            id={"csv"}
            variant="success"
            style={{ marginLeft: "10px" }}
            onClick={handleDownloadClick}
            disabled={downloadInProgress || transactionData?.count === 0}
          >
            {downloadInProgress ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <FontAwesomeIcon icon={faFileDownload} />
            )}
          </Button>
        </Col>
      </Row>
      <CasinoTransactionsList
        page={page}
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        totalPages={totalPages}
        loading={loading}
        data={transactionData}
        isAllUser={isAllUser}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        sort={sort}
        setSort={setSort}
        over={over}
        setOver={setOver}
        selected={selected}
      />
    </>
  );
};

export default CasinoTransactions;
