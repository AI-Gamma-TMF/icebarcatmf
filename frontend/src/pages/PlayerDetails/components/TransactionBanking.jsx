import { Button, Col, Row, Form } from "@themesberg/react-bootstrap";
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
    <>
      {isAllUser && (
        <Row className="mb-3">
          <Col sm={12}>
            <h3>{t("transactions.transactionsBanking")}</h3>
          </Col>
        </Row>
      )}
      <Row>
        {isAllUser && (
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>{t("transactions.filters.search")}</Form.Label>

            <Form.Control
              type="search"
              value={search}
              placeholder="Search By Email"
              onChange={(event) => {
                setPage(1);
                setSearch(
                  event?.target?.value?.replace(/[~`!$%^&*#=)()><?]+/g, "")
                );
              }}
            />
          </Col>
        )}

        <Col xs={12} md={3} className="mb-3">
          <Form.Label>{t("transactions.filters.actionType")}</Form.Label>

          <Form.Select
            onChange={(e) => {
              setPage(1);
              setSelectedAction(e?.target?.value);
            }}
            value={selectedAction}
          >
            {/* <option value=''>{t('transactions.filters.actionTypeOpt')}</option> */}
            {transactionTypeOptions &&
              transactionTypeOptions?.map(({ label, value }) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col xs={12} md={3} className="mb-3">
          <Form.Label>{t("transactions.filters.status")}</Form.Label>

          <Form.Select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e?.target?.value?.replace(/[~`!$%^&*#=)()><?]+/g, ""));
            }}
          >
            {statusTypeOptions?.map(({ label, value }) => {
              return (
                <option key={label} value={value}>
                  {label}
                </option>
              );
            })}
          </Form.Select>
        </Col>

        <Col xs={12} md={3} className="mb-3">
          <Form.Label>{t("transactions.filters.SearchByUserId")}</Form.Label>

          <Form.Control
            type="search"
            value={userIdFilter}
            placeholder="Search By User Id"
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

        <Col xs={12} md={3} className="mb-3">
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

        <Col xs={12} md={3} className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Datetime
            value={endDate}
            onChange={handleEndDateChange}
            inputProps={{ readOnly: true }}
            timeFormat={false}
          />
          {errorEnd && (
            <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
          )}
        </Col>
        {/* </Col> */}

        <Col xs={12} md={3} className="mb-3" style={{ marginTop: "30px" }}>
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            className=""
            onClick={resetFilters}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>
          <Trigger message="Download as CSV" id={"csv"} />
          <Button
            id={"csv"}
            variant="success"
            style={{ marginLeft: "10px" }}
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
              ></span>
            ) : (
              <FontAwesomeIcon icon={faFileDownload} />
            )}
          </Button>
        </Col>
      </Row>
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
        // onDeposit={onDeposit}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        sort={sort}
        setSort={setSort}
        over={over}
        setOver={setOver}
      />
    </>
  );
};

export default TransactionBanking;
