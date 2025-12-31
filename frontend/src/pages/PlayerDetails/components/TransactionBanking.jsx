import { Button, Col, Row, Form, Card } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { formattedDate } from "../../../utils/dateFormatter";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import useTransactionBLIst from "../hooks/useTransactionBList";
import { statusTypeOptions, transactionTypeOptions } from "../constants";
import BankingTransactionsList from "../../../components/BankingTransactionsList";
import { convertTimeZone, onDownloadCsvClick } from "../../../utils/helper";
import Datetime from "react-datetime";
import "./transactionBanking.scss";

const TransactionBanking = ({ email, isAllUser }) => {
  const {
    t,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedAction,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    transactionData,
    loading,
    // onDeposit,
    getCsvDownloadUrl,
    status,
    setStatus,
    search,
    setSearch,
    transactionRefetch,
    // setCsvDownload,
    timeZoneCode,
    userIdFilter,
    setUserIdFilter,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
  } = useTransactionBLIst(email);
  const [error, setError] = useState("");

  // const timeZone = getItem("timezone");
  // const timezoneOffset =  timeZone != null ? timeZones.find(x=> x.code === timeZone).value : getFormattedTimeZoneOffset()
  // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x=> x.value === timezoneOffset)?.code);
  // const [startDate,setStartDate] = useState(convertTimeZone(getDateThreeMonthsBefore(), timeZoneCode))
  // const [endDate,setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode))

  // useEffect(()=>{
  //   setTimeZoneCode(timeZones.find(x=> x.value === timezoneOffset)?.code)
  // },[timezoneOffset])

  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");
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
  const handleDownloadClick = async () => {
    try {
      let filename = "transaction_banking";

      if (search) {
        filename += `_${search}`;
      }

      const formattedStartDate = formattedDate(startDate);
      const formattedEndDate = formattedDate(endDate);

      if (status == "all" && selectedAction == "all") {
        filename += `_${formattedStartDate}_${formattedEndDate}`;
      } else if (status == "all") {
        filename += `_${selectedAction}_${formattedStartDate}_${formattedEndDate}`;
      } else if (selectedAction == "all") {
        filename += `_${status}_${formattedStartDate}_${formattedEndDate}`;
      } else {
        filename += `_${selectedAction}_${status}_${formattedStartDate}_${formattedEndDate}`;
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

  const resetFilters = () => {
    setSearch("");
    setSelectedAction("all");
    setStatus("all");
    setLimit(15);
    setPage(1);
    setErrorStart("");
    setErrorEnd("");
    setStartDate(convertTimeZone(new Date(), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
    setUserIdFilter("");
    setError("");
  };

  return (
    <div className="dashboard-typography banking-transactions-page">
      {isAllUser && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="banking-transactions-page__title">
              {t("transactions.transactionsBanking")}
            </h3>
            <p className="banking-transactions-page__subtitle">
              View and manage all banking transactions
            </p>
          </div>
        </div>
      )}

      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <Row className="g-3 align-items-start">
            {isAllUser && (
              <Col xs={12} md={6} lg={3}>
                <Form.Label>{t("transactions.filters.search")}</Form.Label>
                <Form.Control
                  type="search"
                  value={search}
                  placeholder="Search By Email"
                  className="banking-filters__control"
                  onChange={(event) => {
                    setPage(1);
                    setSearch(
                      event?.target?.value?.replace(/[~`!$%^&*#=)()><?]+/g, "")
                    );
                  }}
                />
              </Col>
            )}

            <Col xs={12} md={6} lg={3}>
              <Form.Label>{t("transactions.filters.actionType")}</Form.Label>
              <Form.Select
                className="banking-filters__select"
                onChange={(e) => {
                  setPage(1);
                  setSelectedAction(e?.target?.value);
                }}
                value={selectedAction}
              >
                {transactionTypeOptions &&
                  transactionTypeOptions?.map(({ label, value }) => (
                    <option key={label} value={value}>
                      {label}
                    </option>
                  ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Label>{t("transactions.filters.status")}</Form.Label>
              <Form.Select
                className="banking-filters__select"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(
                    e?.target?.value?.replace(/[~`!$%^&*#=)()><?]+/g, "")
                  );
                }}
              >
                {statusTypeOptions?.map(({ label, value }) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Label>{t("transactions.filters.SearchByUserId")}</Form.Label>
              <Form.Control
                type="search"
                value={userIdFilter}
                placeholder="Search By User Id"
                className="banking-filters__control"
                onChange={(event) => {
                  const inputValue = event?.target?.value;
                  if (/^\d*$/.test(inputValue)) {
                    if (inputValue.length <= 10) {
                      setPage(1);
                      setUserIdFilter(inputValue);
                      setError("");
                    } else {
                      setError("User Id cannot exceed 10 digits");
                    }
                  }
                }}
              />
              {error && (
                <div style={{ color: "red", marginTop: "5px" }}>{error}</div>
              )}
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Label>Start Date</Form.Label>
              <div className="banking-filters__date-wrapper">
                <Datetime
                  value={startDate}
                  onChange={handleStartDateChange}
                  inputProps={{ readOnly: true }}
                  timeFormat={false}
                />
              </div>
              {errorStart && (
                <div style={{ color: "red", marginTop: "5px" }}>{errorStart}</div>
              )}
            </Col>

            <Col xs={12} md={6} lg={3}>
              <Form.Label>End Date</Form.Label>
              <div className="banking-filters__date-wrapper">
                <Datetime
                  value={endDate}
                  onChange={handleEndDateChange}
                  inputProps={{ readOnly: true }}
                  timeFormat={false}
                />
              </div>
              {errorEnd && (
                <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
              )}
            </Col>

            <Col xs={12} lg={6} className="d-flex align-items-end">
              <div className="banking-filters__actions w-100">
                <div className="flex-grow-1" />

                <Trigger message="Reset Filters" id={"redo"} />
                <Button
                  id={"redo"}
                  className="banking-action-btn banking-action-btn--reset"
                  onClick={resetFilters}
                >
                  <FontAwesomeIcon icon={faRedoAlt} /> Reset
                </Button>

                <Trigger message="Download as CSV" id={"csv"} />
                <Button
                  id={"csv"}
                  className="banking-action-btn banking-action-btn--download"
                  disabled={
                    transactionData?.count === 0 ||
                    transactionData?.count === null ||
                    downloadInProgress
                  }
                  onClick={handleDownloadClick}
                >
                  {downloadInProgress ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
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
        <div className="banking-table-wrap">
          <BankingTransactionsList
            page={page}
            setLimit={setLimit}
            limit={limit}
            setPage={setPage}
            totalPages={totalPages}
            data={transactionData}
            loading={loading}
            isAllUser={isAllUser}
            transactionRefetch={transactionRefetch}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            sort={sort}
            setSort={setSort}
            over={over}
            setOver={setOver}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionBanking;
