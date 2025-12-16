import Datetime from 'react-datetime'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { RedeemTableContainer } from './style'
// import { useUserStore } from '../../store/store'
import Trigger from '../../components/OverlayTrigger'
import DashboardCard from './Components/DashboardCard'
import { InlineLoader } from '../../components/Preloader'
import useCheckPermission from '../../utils/checkPermission'
import PaginationComponent from '../../components/Pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useWithdrawTransactions from './hooks/useWithdrawTransactions'
import { formattedDate, getDateTime } from '../../utils/dateFormatter'
import { Col, Row, Form, Button, Table } from '@themesberg/react-bootstrap'
import { paymentProviderName, statusOptions, tableHeaders } from './constants'
import { faArrowCircleUp, faArrowCircleDown , faCheck, faFileDownload, faRedoAlt, faTimesSquare } from '@fortawesome/free-solid-svg-icons'
import { ApproveRedeemConfirmation, RedeemMoreDetail } from '../../components/ConfirmationModal'
import { convertTimeZone, convertToTimeZone, formatPriceWithCommas, onDownloadCsvClick } from '../../utils/helper'

const WithdrawRequests = () => {
  const { isHidden } = useCheckPermission()
  const [type, setType] = useState('')
  const [downloadInProgress, setDownloadInProgress] = useState(false)

  const {
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
    search,
    setSearch,
    updateWithdrawData,
    approveModal,
    setApproveModal,
    redeemRequest,
    setRedeemRequest,
    updateLoading,
    handelFetchStatus,
    getCsvDownloadUrl,
    setRedeemMoreDetail,
    redeemMoreDetail,
    moreDetailData,
    timezoneOffset,
    selected,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    getMoreDetail,
    reasonData,
    paymentProvider,
    setPaymentProvider,
    timeZoneCode,
    loadingRows,
    setLoadingRows,
    dashboardData,
    // transactionId,
    setTransactionId,
    userId,
    setUserId,
    operator,
    setOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
  } = useWithdrawTransactions({ fetchDashboardData: true });
  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (event) => {
    const value = event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, "");
    setSearch(value);
    setPage(1);

    // Validate email
    if (value && !validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };
  const handleRedeem = () => {};
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
  const handleApproveRequest = () => {
    updateWithdrawData({
      withdrawRequestId: redeemRequest?.withdrawRequestId.toString(),
      reason: "",
      userId: redeemRequest?.userId,
      status: type,
    });
  };

  const handleDownloadClick = async () => {
    try {
      let filename = "Redeem_Request";

      if (search) {
        filename += `_${search}`;
      }

      const formattedStartDate = formattedDate(startDate);
      const formattedEndDate = formattedDate(endDate);

      if (selectedAction == "all") {
        filename += `_${formattedStartDate}_${formattedEndDate}`;
      } else {
        filename += `_${selectedAction}_${formattedStartDate}_${formattedEndDate}`;
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

  const handlePlayerTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(param.value);
      setSort("asc");
    }
  };

  return (
    <RedeemTableContainer>
      <Row className="mb-3">
        <Col xs={12}>
          <h3>Redeem Requests</h3>
        </Col>
      </Row>

      <DashboardCard dashboardData={dashboardData} />

      <Row className="mt-4">
        <Col xs="12" sm="6" lg="2" className="mb-3">
          <Form.Label>User Id</Form.Label>
          <Form.Control
            type="number"
            value={userId}
            placeholder="Search By User Id"
            onChange={(event) => {
              setPage(1);
              setUserId(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
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

        {/* <Col xs='12' sm='6' lg='3' className='mb-3'>
            <Form.Label>Transaction Id</Form.Label>
            <Form.Control
              type='search'
              value={transactionId}
              placeholder='Search By TransactionId'
              onChange={(event) => {
                setPage(1)
                setTransactionId(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))
              }}
            />
          </Col> */}

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
            value={startDate}
            onChange={handleStartDateChange}
            inputProps={{ readOnly: true }}
            timeFormat={false}
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
            value={endDate}
            onChange={handleEndDateChange}
            inputProps={{ readOnly: true }}
            timeFormat={false}
          />
          {errorEnd && (
            <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
          )}
        </Col>
      </Row>
      <Row className="mt-0">
        <Col xs="12" sm="6" lg="2" className="mb-3">
          <Form.Label column="sm" className="mx-auto text-nowrap px-2">
            Status
          </Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setSelectedAction(e.target.value);
            }}
            value={selectedAction}
          >
            {statusOptions &&
              statusOptions?.map(({ label, value }) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col xs="12" sm="6" lg="2" className="mb-3">
          <Form.Label column="sm" className="mx-auto text-nowrap px-2">
            Payment Provider
          </Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setPaymentProvider(e.target.value);
            }}
            value={paymentProvider}
          >
            {paymentProviderName &&
              paymentProviderName?.map(({ label, value }) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col sm={6} lg={2}>
          <Form.Label column="sm">Filter By</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setFilterBy(e.target.value);
            }}
            value={filterBy}
          >
            <option hidden>Select value</option>
            <option value="NGR">NGR</option>
            <option value="playThrough">Play Through</option>
            <option value="amount">Amount</option>
            <option value="last30daysRollingRedeemAmount">30 days Rolling Amount</option>
          </Form.Select>
        </Col>

        <Col sm={6} lg={2}>
          <Form.Label column="sm">Operator</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setOperator(e.target.value);
            }}
            value={operator}
            disabled={!filterBy}
          >
            <option hidden>Select Operator</option>
            <option value="=">=</option>
            <option value=">">{`>`}</option>
            <option value=">=">{`>=`}</option> <option value="<">{`<`}</option>{" "}
            <option value="<=">{`<=`}</option>
          </Form.Select>
        </Col>

        <Col sm={6} lg={2}>
          <Form.Label>Value</Form.Label>
          <Form.Control
            type="number"
            onKeyDown={(evt) =>
              ["e", "E", "+"].includes(evt.key) && evt.preventDefault()
            }
            name="filterValue"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e?.target?.value);
            }}
            placeholder="Enter Value"
            disabled={!operator}
          />
        </Col>

        <Col
          xs="12"
          sm="6"
          lg="1"
          className="d-flex align-items-center mt-3 mb-0"
        >
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            onClick={() => {
              setSearch("");
              setSelectedAction("pending");
              setLimit(15);
              setPage(1),
                setErrorStart(""),
                setErrorEnd(""),
                setStartDate(convertTimeZone(new Date(), timeZoneCode)),
                setEndDate(convertTimeZone(new Date(), timeZoneCode));
              setTransactionId("");
              setUserId("");
              setFilterBy("");
              setOperator("");
              setFilterValue("");
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

      <div className="table-wrapper">
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark table-scroll">
            <tr>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== "" && handlePlayerTableSorting(h)}
                  style={{
                  cursor: (h.value !== '')
                   ? 'pointer' : 'default',
                }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
                >
                  {h.labelKey}

                  {selected(h) &&
                    (sort === "asc" ? (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleUp}
                        onClick={() => setSort("desc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleDown}
                        onClick={() => setSort("asc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ))}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center">
                  <InlineLoader />
                </td>
              </tr>
            ) : (
              <>
                {transactionData && transactionData?.rows?.length > 0 ? (
                  transactionData.rows.map(
                    ({
                      transactionId,
                      email,
                      amount,
                      cancelRedemptionCount,
                      lastWithdrawalDate,
                      zipCode,
                      ipLocation,
                      actionableEmail,
                      isFloridaOrNewYorkUser,
                      userId,
                      status,
                      paymentProvider,
                      withdrawRequestId,
                      playThrough,
                      NGR, 
                      last30daysRollingRedeemAmount
                    }) => (
                      <tr
                        key={transactionId}
                        style={{
                          background: isFloridaOrNewYorkUser ? "#ffa8a8" : "",
                        }}
                      >
                        <td>
                          {+NGR > 0 ? (
                            <span style={{ color: "green" }}>
                              {" "}
                              {formatPriceWithCommas(NGR)}{" "}
                            </span>
                          ) : (
                            <span style={{ color: "red" }}>
                              {" "}
                              {formatPriceWithCommas(NGR)}{" "}
                            </span>
                          )}
                        </td>
                        <td>{userId}</td>
                        <td>
                          {isHidden({
                            module: { key: "Users", value: "R" },
                          }) ? (
                            email
                          ) : (
                            <Link to={`/admin/player-details/${userId}`}>
                              {email}
                            </Link>
                          )}
                        </td>
                        <td>{actionableEmail}</td>
                        <td>{last30daysRollingRedeemAmount !== null ? formatPriceWithCommas(last30daysRollingRedeemAmount.toFixed(2)): '-'}</td>
                        <td>{paymentProvider}</td>
                        <td>{formatPriceWithCommas(amount.toFixed(2))}</td>
                        <td>{formatPriceWithCommas(cancelRedemptionCount)}</td>
                        <td>
                          {lastWithdrawalDate
                            ? getDateTime(
                                convertToTimeZone(
                                  lastWithdrawalDate,
                                  timezoneOffset
                                )
                              )
                            : "-"}
                        </td>
                        <td>
                          {+playThrough > 1 ? (
                            <span style={{ color: "green" }}>
                              {" "}
                              {playThrough}{" "}
                            </span>
                          ) : (
                            <span style={{ color: "red" }}>
                              {" "}
                              {playThrough}{" "}
                            </span>
                          )}
                        </td>
                        <td>{zipCode}</td>
                        <td>{ipLocation || "N/A"}</td>

                        <td>
                          {status === 0 || status === 8 ? (
                            <>
                              <Trigger
                                message="Approve"
                                id={`${transactionId}edit`}
                              />
                              <Button
                                disabled={
                                  !(status === 0 || status === 8) ||
                                  updateLoading
                                }
                                id={`${transactionId}edit`}
                                className="m-1"
                                size="sm"
                                variant="success"
                                onClick={() => {
                                  setType("approved");
                                  setApproveModal(true);
                                  setRedeemRequest({
                                    userId,
                                    withdrawRequestId,
                                    paymentProvider,
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </Button>
                            </>
                          ) : status === 7 ? (
                            paymentProvider === "SKRILL" ||
                            paymentProvider === "PAY_BY_BANK" ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handelFetchStatus(withdrawRequestId)
                                }
                              >
                                Check Status
                              </button>
                            ) : (
                              <span className="info">N/A</span>
                            )
                          ) : (
                            <span className="info">N/A</span>
                          )}

                          {(status === 0 || status === 8) && (
                            <>
                              <Trigger
                                message="Cancel"
                                id={`${transactionId}Cancel`}
                              />
                              <Button
                                disabled={
                                  !(status === 0 || status === 8) ||
                                  updateLoading
                                }
                                id={`${transactionId}Cancel`}
                                className="m-1"
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  setType("rejected");
                                  setApproveModal(true);
                                  setRedeemRequest({
                                    userId,
                                    withdrawRequestId,
                                    paymentProvider,
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faTimesSquare} />
                              </Button>
                            </>
                          )}
                        </td>
                        <td>
                          {status === 0 ? (
                            <span className="info">Pending</span>
                          ) : status === 1 ? (
                            <span className="success">Approved</span>
                          ) : status === 2 ? (
                            <span className="danger">Cancelled</span>
                          ) : status === 8 ? (
                            <span className="success">Scheduled</span>
                          ) : status === 7 ? (
                            <span className="success">In Progress</span>
                          ) : status === 6 ? (
                            <span className="danger">Declined</span>
                          ) : (
                            <span className="danger">Failed</span>
                          )}
                        </td>

                        <td>
                          {loadingRows[transactionId] ? (
                            <InlineLoader />
                          ) : (
                            <Button
                              style={{ padding: "3px 8px" }}
                              onClick={() => {
                                getMoreDetail({ transactionId, userId });
                                setLoadingRows({ [transactionId]: true });
                              }}
                            >
                              More Details
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={12} className="text-danger text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </Table>
      </div>

      {transactionData?.count !== 0 && !loading && (
        <PaginationComponent
          page={transactionData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {approveModal && (
        <ApproveRedeemConfirmation
          show={approveModal}
          setShow={setApproveModal}
          handleYes={handleApproveRequest}
          redeemRequest={redeemRequest}
          type={type}
        />
      )}
      {redeemMoreDetail && (
        <RedeemMoreDetail
          show={redeemMoreDetail}
          setShow={setRedeemMoreDetail}
          handleYes={handleRedeem}
          moreDetailData={moreDetailData}
          reasonData={reasonData}
        />
      )}
    </RedeemTableContainer>
  );
};

export default WithdrawRequests;
