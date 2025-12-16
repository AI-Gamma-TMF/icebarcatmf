import { Col, Row, Form, Button, Table, Accordion } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { faArrowCircleUp, faArrowCircleDown , faCheck, faTimesSquare } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import useWithdrawTransactions from "../hooks/useWithdrawTransactions";
import { tableHeaders } from "../constants";
import { getDateTime } from "../../../utils/dateFormatter";
import Trigger from "../../../components/OverlayTrigger";
import { InlineLoader } from "../../../components/Preloader";
import { ApproveRedeemConfirmation, RedeemMoreDetail } from "../../../components/ConfirmationModal";
import PaginationComponent from "../../../components/Pagination";
import { convertToTimeZone } from "../../../utils/helper";
import useCheckPermission from "../../../utils/checkPermission";



const LongPendingRequests = () => {
  const [type, setType] = useState('')
  const { isHidden } = useCheckPermission();
  const {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    transactionData,
    loading,
    updateWithdrawData,
    approveModal,
    setApproveModal,
    redeemRequest,
    setRedeemRequest,
    updateLoading,
    handelFetchStatus,
    setRedeemMoreDetail,
    redeemMoreDetail,
    moreDetailData,
    timezoneOffset,
    selected,

    orderBy,
    setOrderBy,
    sort,
    setSort,
    over, setOver,
    getMoreDetail,
    reasonData,
    pendingDay, 
    setPendingDay,
    setEndDate,
    setStartDate
  } = useWithdrawTransactions();
  const [errorMsg, setErrorMsg] = useState(false);

  const handleApproveRequest = () => {
    updateWithdrawData({
      withdrawRequestId: redeemRequest?.withdrawRequestId.toString(),
      reason: "",
      userId: redeemRequest?.userId,
      status: type,
    });

  }

  const handlePlayerTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(param.value)
      setSort('asc');
    }
  }

  const getLongPendingRequests = () => {
    if (!pendingDay) {
      setPendingDay(1)
    }
  }


  const handleRedeem = () => {
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "0" || value === '' ) {
      setErrorMsg(true)
      setPendingDay(null);
      setEndDate(null)
      setStartDate(null)    
    } else {
      setErrorMsg(false)
      setPendingDay(value);
    }
  }

  return (
    <>
      <h4>Long Pending Requests</h4>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header onClick={getLongPendingRequests}>Long Pending Requests</Accordion.Header>
          <Accordion.Body>
            <Row className=''>
              <Col xs='12' sm='6' lg='9'>
                <span style={{ padding: '5px' }}>Total Amount: ${transactionData?.totalAmount}</span>
              </Col>
              <Col xs='12' sm='6' lg='3' className='mb-3'>
                <Form.Label column='sm' className='mx-auto text-nowrap px-2'>
                  Pending days
                </Form.Label>

                <Form.Control
                  type='number'
                  min={1}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", '.', '-'].includes(evt.key) && evt.preventDefault()
                  }
                  placeholder='Enter number of days'
                  value={pendingDay}
                  onChange={handleInputChange}
                />
                {(errorMsg)  && <div style={{color:'red'}}>Pending days must be at least 1</div>}
              </Col>
              <Col>
                <Table
                  bordered
                  striped
                  responsive
                  hover
                  size='sm'
                  className='text-center mt-4'
                >
                  <thead className='thead-dark'>
                    <tr>
                      {tableHeaders.map((h, idx) => (
                        <th
                          key={idx}
                          onClick={() => h.value !== '' && handlePlayerTableSorting(h)}
                          style={{
                            cursor: 'pointer'
                          }}
                          className={
                            selected(h)
                              ? 'border-3 border border-blue'
                              : ''
                          }
                        >
                          {h.labelKey}{' '}
                          {selected(h) &&
                            (sort === 'asc'
                              ? (
                                <FontAwesomeIcon
                                  style={over ? { color: 'red' } : {}}
                                  icon={faArrowCircleUp}
                                  onClick={() => setSort('desc')}
                                  onMouseOver={() => setOver(true)}
                                  onMouseLeave={() => setOver(false)}
                                />
                              )
                              : (
                                <FontAwesomeIcon
                                  style={over ? { color: 'red' } : {}}
                                  icon={faArrowCircleDown}
                                  onClick={() => setSort('asc')}
                                  onMouseOver={() => setOver(true)}
                                  onMouseLeave={() => setOver(false)}
                                />
                              ))}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {transactionData &&
                      transactionData?.rows?.map(
                        ({
                          transactionId,
                          userTotalPurchase,
                          email,
                          amount,
                          ngr,
                          cancelRedemptionCount,
                          lastApprovedRedeemDate,
                          zipCode,
                          ipLocation,
                          actionableEmail,
                          isFloridaOrNewYorkUser,
                          userId,
                          status,
                          paymentProvider,
                          withdrawRequestId,
                          lastRunAt

                        }) => {
                          return (
                            <tr key={transactionId} style={{
                              background: isFloridaOrNewYorkUser ? '#ffa8a8' : ''
                            }}>
                              <td>{ngr > 0 ? <span style={{ color: 'green' }}>{ngr?.toFixed(2)}</span> : <span style={{ color: 'red' }}>{ngr?.toFixed(2)}</span>}</td> {/* NGR Value */}
                              <td>{userTotalPurchase ? userTotalPurchase?.toFixed(2) : '-'}</td> {/* Amount */}
                              <td>
                                {isHidden({ module: { key: "Users", value: "R" } }) ? (
                                  email
                                ) : (
                                  <Link to={`/admin/player-details/${userId}`}>{email}</Link>
                                )}
                              </td>
                              <td>{actionableEmail}</td> {/* Cancel Redemption Count */}
                              <td>{amount?.toFixed(2)}</td> {/* Amount */}

                              <td>{cancelRedemptionCount}</td> {/* Cancel Redemption Count */}
                              <td>{lastApprovedRedeemDate ? getDateTime(convertToTimeZone(lastApprovedRedeemDate, timezoneOffset)) : '-'}</td>
                              <td>{lastRunAt ? getDateTime(convertToTimeZone(lastRunAt, timezoneOffset)) : '-'}</td>
                              {/* <td>{lastApprovedRedeemAmount?.toFixed(2)}</td> Last Approved Redeem Amount */}
                              <td>{zipCode}</td> {/* Zip Code */}
                              <td>{ipLocation || 'N/A'}</td> {/* IP Location */}
                              <td>
                                {status === 0 ? (
                                  <>
                                    <Trigger
                                      message='Approve'
                                      id={transactionId + "edit"}
                                    />
                                    <Button
                                      disabled={status !== 0 || updateLoading}
                                      id={transactionId + "edit"}
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() => {
                                        setType('approved')
                                        setApproveModal(true)
                                        setRedeemRequest({ userId, withdrawRequestId, paymentProvider })
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                  </>
                                ) : status === 1 ? (
                                  <span className='success'>Approved</span>
                                ) : status === 2 ? (
                                  <span className='danger'>Cancelled</span>
                                ) : status === 7 ? (
                                  <button className='btn btn-success btn-sm' onClick={() => handelFetchStatus(withdrawRequestId)}>Check Status</button>
                                ) : status === 6 ? (
                                  <span className='danger'>Declined</span>
                                ) : (
                                  <span className='danger'>Failed</span>
                                )}
                                {status === 0 && (
                                  <>
                                    <Trigger
                                      message='Cancel'
                                      id={transactionId + "Cancel"}
                                    />
                                    <Button
                                      disabled={status !== 0 || updateLoading}
                                      id={transactionId + "Cancel"}
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      onClick={() => {
                                        setType('rejected')
                                        setApproveModal(true)
                                        setRedeemRequest({ userId, withdrawRequestId, paymentProvider })
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTimesSquare} />
                                    </Button>
                                  </>
                                )}
                              </td>
                              <td><Button style={{ padding: '3px 8px' }} onClick={() => {
                                getMoreDetail({ transactionId, userId })
                                // setRedeemMoreDetail(true)
                                // setReasonData(moreDetails)
                                // setMoreDetailData({ amount, ngr, lastApprovedRedeemDate, email, actionableEmail, lastApprovedRedeemAmount })
                              }}>More Detail</Button></td>
                            </tr>
                          );
                        }
                      )}

                    {transactionData?.count === 0 && (
                      <tr>
                        <td colSpan={10} className='text-danger text-center'>
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
            {loading && <InlineLoader />}
            {(transactionData?.count !== 0 && !loading)&& (
              <PaginationComponent
                page={transactionData?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {approveModal &&
        <ApproveRedeemConfirmation
          show={approveModal}
          setShow={setApproveModal}
          handleYes={handleApproveRequest}
          redeemRequest={redeemRequest}
          type={type}
        />}
      {redeemMoreDetail &&
        <RedeemMoreDetail
          show={redeemMoreDetail}
          setShow={setRedeemMoreDetail}
          handleYes={handleRedeem}
          moreDetailData={moreDetailData}
          reasonData={reasonData}
        />}
    </>
  );
};

export default LongPendingRequests;
