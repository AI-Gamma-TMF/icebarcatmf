import React, { useState } from "react";
import useCasinoTransactionsList from "../hooks/useCasinoTransactionsList";
import { Button, Col, Row, Form, Card } from "@themesberg/react-bootstrap";
import { formattedDate } from "../../../utils/dateFormatter";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { actionTypeOptions, coinTypeOptions } from "../constants";
import CasinoTransactionsList from "../../../components/CasinoTransactionsList";
import { convertTimeZone, onDownloadCsvClick } from "../../../utils/helper";
import Datetime from "react-datetime";
import ReactCreatable from "../../../components/ReactSelectField/ReactCreatable";
import "./casinoTransactions.scss";

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
    <div className="dashboard-typography casino-transactions-page">
      {isAllUser && (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
            <h3 className="casino-transactions-page__title">{t("transactions.casinoTransactions")}</h3>
            <p className="casino-transactions-page__subtitle">View and manage all casino transactions</p>
            </div>
        </div>
      )}

      {/* Filters Card */}
      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <Row className="g-3">
            {isAllUser && (
              <Col xs="12" sm="6" lg="3">
                <Form.Label>{t("transactions.filters.search")}</Form.Label>
                <Form.Control
                  type="search"
                  value={search}
                  placeholder="Search By Email"
                  className="casino-filters__control"
                  onChange={(event) => {
                    setPage(1);
                    setSearch(
                      event.target.value
                        .replace(/\s+/g, "")
                        .replace(/[~`!$%^&*#=)()><?]+/g, "")
                    );
                  }}
                  onKeyDown={(event) => {
                    if (event.key === " ") event.preventDefault();
                  }}
                />
              </Col>
            )}
            {isAllUser && (
              <Col xs="12" sm="6" lg="3">
                <Form.Label>{t("transactions.filters.casinoTransactionId")}</Form.Label>
                <Form.Control
                  type="number"
                  value={searchCasinoId}
                  placeholder="Search By Casino Txn Id"
                  className="casino-filters__control"
                  onChange={(event) => {
                    setPage(1);
                    setSearchCasinoId(
                      event.target.value
                        .replace(/\s+/g, "")
                        .replace(/[~`!$%^&*#=)()><?]+/g, "")
                    );
                  }}
                  onKeyDown={(event) => {
                    if (event.key === " ") event.preventDefault();
                  }}
                />
              </Col>
            )}
            {isAllUser && (
              <Col xs="12" sm="6" lg="3">
                <Form.Label>{t("transactions.filters.externalTransactionId")}</Form.Label>
                <Form.Control
                  type="search"
                  value={searchTransactionId}
                  placeholder="Search By External Txn Id"
                  className="casino-filters__control"
                  onChange={(event) => {
                    setPage(1);
                    setSearchTransactionId(
                      event.target.value
                        .replace(/\s+/g, "")
                        .replace(/[~`!$%^&*#=)()><?]+/g, "")
                    );
                  }}
                  onKeyDown={(event) => {
                    if (event.key === " ") event.preventDefault();
                  }}
                />
              </Col>
            )}

            <Col xs="12" sm="6" lg="3">
              <Form.Label>{t("history.filters.coinType")}</Form.Label>
              <Form.Select
                className="casino-filters__select"
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

            <Col xs="12" sm="6" lg="3">
              <Form.Label>Action Type</Form.Label>
              <Form.Select
                className="casino-filters__select"
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

            <Col xs="12" sm="6" lg="3">
              <Form.Label>Game Id</Form.Label>
              <Form.Control
                type="search"
                value={gameId}
                placeholder="Search By game Id"
                className="casino-filters__control"
                onChange={(event) => {
                  setPage(1);
                  setGameId(event.target.value.replace(/^0|[^\d]/g, ""));
                }}
              />
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Label>Game Name</Form.Label>
              <div className="casino-filters__select-creatable">
              <ReactCreatable
                options={gameIdsOptions}
                value={gameName}
                setValue={(dataValue) => {
                  setGameName(dataValue);
                }}
                isMulti={false}
                isLoading={isSelectLoading}
                classNamePrefix="prefix"
              />
              </div>
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Label>Sc Coin</Form.Label>
              <Form.Control
                type="search"
                value={scCoin}
                placeholder="Search By Sc Coin"
                className="casino-filters__control"
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

            <Col xs="12" sm="6" lg="3">
              <Form.Label>Start Date</Form.Label>
              <div className="casino-filters__date-wrapper">
                <Datetime
                  value={startDate}
                  onChange={handleStartDateChange}
                  inputProps={{ readOnly: true }}
                  timeFormat={true}
                />
              </div>
              {errorStart && (
                <div style={{ color: "red", marginTop: "5px", fontSize: "0.85rem" }}>{errorStart}</div>
              )}
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Label>End Date</Form.Label>
              <div className="casino-filters__date-wrapper">
                <Datetime
                  value={endDate}
                  timeFormat={true}
                  onChange={handleEndDateChange}
                  inputProps={{ readOnly: true }}
                />
              </div>
              {errorEnd && (
                <div style={{ color: "red", marginTop: "5px", fontSize: "0.85rem" }}>{errorEnd}</div>
              )}
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Label>{t("transactions.filters.userId")}</Form.Label>
              <Form.Control
                type="search"
                value={searchUserId}
                placeholder="Search By User Id"
                className="casino-filters__control"
                onChange={(event) => {
                  setPage(1);
                  setSearchUserId(event.target.value.replace(/^0|[^\d]/g, ""));
                }}
              />
            </Col>

            <Col xs="12" sm="6" lg="3">
              <Form.Label>{t("transactions.filters.userName")}</Form.Label>
              <Form.Control
                type="search"
                value={searchUserName}
                placeholder="Search By User Name"
                className="casino-filters__control"
                onChange={(event) => {
                  setPage(1);
                  setSearchUserName(
                    event.target.value
                      .replace(/\s+/g, "")
                      .replace(/[~`!$%^&*#=)()><?]+/g, "")
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === " ") event.preventDefault();
                }}
              />
            </Col>

            <Col xs="12" sm="12" lg="12" className="mt-4">
                <div className="casino-filters__actions justify-content-end">
                    <Trigger message="Reset Filters" id={"redo"} />
                    <Button
                        id={"redo"}
                        className="casino-action-btn casino-action-btn--reset"
                        onClick={handleReset}
                    >
                        <FontAwesomeIcon icon={faRedoAlt} /> Reset
                    </Button>

                    <Trigger message="Download as CSV" id={"csv"} />
                    <Button
                        id={"csv"}
                        className="casino-action-btn casino-action-btn--download"
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
                        <>
                            <FontAwesomeIcon icon={faFileDownload} /> Export CSV
                        </>
                        )}
                    </Button>
                </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="dashboard-data-table">
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
      </div>
    </div>
  );
};

export default CasinoTransactions;
