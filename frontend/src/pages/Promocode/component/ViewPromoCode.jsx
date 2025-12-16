import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Table, Form as BForm, Spinner } from "@themesberg/react-bootstrap";
import {
  formatDateMDY,
  getDateTime,
} from "../../../utils/dateFormatter.js";
import { STATUS_LABELS, viewPurchasePromocodeHeaders } from "../constant.js";
import PaginationComponent from "../../../components/Pagination/index.jsx";
import useViewPromoCode from "../hooks/useViewPromoCode.js";
import SelectedPackageFilters from "./PromocodeFilters/SelectedPackageFilters.jsx";
import UserDetailsFilters from "./PromocodeFilters/UserDetailsFilters.jsx";

const ViewPromoCode = ({ data }) => {
  const {
    promocodeHistory,
    totalPages,
    totalPagesPackages,
    packageDetails,
    packagePage,
    setPackagePage,
    packageLimit,
    setPackageLimit,
    isHidden,
    page,
    setPage,
    limit,
    setLimit,
    packageLoading,
    // promoHistoryLoading,
    // userId,
    // setUserId,
    // transactionId,
    // setTransactionId,
    // isFirstDeposit,
    // setIsFirstDeposit,
    // setEmail,
    packageId,
    setPackageId,
    packageIdSearch,
    setPackageIdSearch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    amount,
    setAmount,
    scCoin,
    setScCoin,
    gcCoin,
    setGcCoin,
    isActive,
    setIsActive,
    getCsvDownloadUrl
  } = useViewPromoCode()

  // const [inputEmail, setInputEmail] = useState('');
  // const [error, setError] = useState('');

  // const validateEmail = (email) => {
  //   // Basic email regex
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // };

  // const handleBlur = () => {
  //   if (validateEmail(inputEmail)) {
  //     setEmail(inputEmail);
  //     setError('');
  //   } else {
  //     setError('Invalid email format');
  //   }
  // };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>View Purchase Promo Codes </h3>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promocode</h6>
            <span >{promocodeHistory?.promocodeExist?.promocode}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promo Id</h6>
            <span >{promocodeHistory?.promocodeExist?.promocodeId}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Valid Till</h6>
            <span >{promocodeHistory?.promocodeExist?.validTill ? getDateTime(promocodeHistory?.promocodeExist?.validTill) : 'N/A'}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Status</h6>
            <span >{STATUS_LABELS[promocodeHistory?.promocodeExist?.status] || 'N/A'}  </span>
          </div>
        </Col>
      </Row>

      <SelectedPackageFilters
        setPage={setPackagePage}
        packageId={packageId}
        setPackageId={setPackageId}
        scCoin={scCoin}
        setScCoin={setScCoin}
        gcCoin={gcCoin}
        setGcCoin={setGcCoin}
        amount={amount}
        setAmount={setAmount}
        isActive={isActive}
        setIsActive={setIsActive}
        setLimit={setPackageLimit}
      />

      <Row className="mt-3">
        <BForm.Label>Selected Package Details</BForm.Label>
        <div style={{ overflow: 'auto' }}>
          {packageDetails ? (
            <Table bordered striped hover size='sm' className='text-center mt-4'>
              <thead className='thead-dark'>
                <tr>
                  <th>
                    Selected
                  </th>
                  <th>Package ID</th>
                  <th>Amount</th>
                  <th>GC Coin</th>
                  <th>SC Coin</th>
                  <th>Package Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {packageDetails?.packages?.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        name='select'
                        type='checkbox'
                        className='form-check-input cursor-pointer'
                        disabled
                        checked={item?.packageId}
                      />
                    </td>
                    <td>{item?.packageId}</td>
                    <td>{item?.amount}</td>
                    <td>{item?.gcCoin}</td>
                    <td>{item?.scCoin}</td>
                    <td>{item?.welcomePurchaseBonusApplicable ? 'Welcome Purchase Package' : item?.firstPurchaseApplicable && item?.isSpecialPackage ? 'Special First Purchase Package' : item?.firstPurchaseApplicable ? 'First Purchase Package' : item?.isSpecialPackage ? 'Special Package' : 'Basic Package'}</td>
                    <td>{item?.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
                {packageDetails?.packages?.length === 0 && (
                  <tr><td className='text-danger' colSpan={6}>No Data Available</td></tr>
                )}
              </tbody>
            </Table>
          ) : (
            <p className='text-danger text-center mt-3'>No Data Available</p>
          )}
        </div>
      </Row>
      {packageDetails?.count !== 0 && packageDetails?.packages.length > 0 && (
        <PaginationComponent
          page={data?.count < packagePage ? setPackagePage(1) : packagePage}
          totalPages={totalPagesPackages}
          setPage={setPackagePage}
          limit={packageLimit}
          setLimit={setPackageLimit}
        />
      )}
      <Row className="mt-3">
        <BForm.Label>User Details</BForm.Label>

        <UserDetailsFilters
          setPage={setPage}
          packageIdSearch={packageIdSearch}
          setPackageIdSearch={setPackageIdSearch}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          getCsvDownloadUrl={getCsvDownloadUrl}
          promocodeHistory={promocodeHistory}
          setLimit={setLimit}
        />
        {/* <Row>
          <Col className='col-lg-3 col-sm-6 col-12'>
            <BForm.Group className='mb-3' controlId='idSearch'>
              <BForm.Label>User Id</BForm.Label>
              <BForm.Control
                type='number'
                name='userId'
                placeholder='User Id'
                onChange={(e) => setUserId(e.target.value)}
                value={userId}
              />

            </BForm.Group>
          </Col>
          <Col className='col-lg-3 col-sm-6 col-12'>
            <BForm.Group className='mb-3' controlId='formGroupEmail'>
              <BForm.Label>Transaction Id</BForm.Label>
              <BForm.Control
                type='text'
                placeholder='Transaction Id'
                name='transactionId'
                onChange={(e) => setTransactionId(e.target.value)}
                value={transactionId}
              />

            </BForm.Group>
          </Col>
          <Col className='col-lg-3 col-sm-6 col-12'>
            <BForm.Group className='mb-3' controlId='formGroupEmail'>
              <BForm.Label>Email</BForm.Label>
              <BForm.Control
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter your email"
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}

            </BForm.Group>
          </Col>
          <Col className='col-lg-2 col-sm-6 col-12'>
            <BForm.Group className='mb-3' controlId='formGroupEmail'>
              <BForm.Label>Package Id</BForm.Label>
              <BForm.Control
                type='number'
                name='packageId'
                placeholder='Package Id'
                onChange={(e) => setPackageId(e.target.value)}
                value={packageId}
              />
            </BForm.Group>
          </Col>

          <Col className='col-lg-1 col-sm-6 col-12'>
            <BForm.Group className='mb-3' controlId='formGroupEmail'>
              <BForm.Label>First Deposit</BForm.Label>
              <BForm.Check
                type="switch"
                name='isFirstDeposit'
                checked={isFirstDeposit}
                onChange={(e) => setIsFirstDeposit(e.target.checked)}
              />
            </BForm.Group>
          </Col>
        </Row> */}


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
              {viewPurchasePromocodeHeaders?.map((h, idx) => (
                <th key={idx} style={{ cursor: "pointer" }}>
                  {h.labelKey}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packageLoading ? (
              <tr>
                <td colSpan={viewPurchasePromocodeHeaders.length} className="text-center">
                  <div className="d-flex justify-content-center align-items-center py-3">
                    <Spinner animation="border" variant="primary" />
                  </div>
                </td>
              </tr>
            ) : promocodeHistory?.appliedDetails?.count > 0 ? (
              promocodeHistory.appliedDetails.rows.map(
                ({ packageId, userId, transactionUser, claimedAt, transactionId }) => (
                  <tr key={transactionId}>
                    <td>{userId}</td>
                    <td>{transactionUser?.username}</td>
                    <td>
                      {isHidden({ module: { key: "Users", value: "R" } }) ? (
                        transactionUser?.email
                      ) : (
                        <Link to={`/admin/player-details/${userId}`}  className="text-link d-inline-block text-truncate">
                          {transactionUser?.email}
                        </Link>
                      )}
                    </td>
                    <td>
                      {transactionUser?.firstName} {transactionUser?.lastName}
                    </td>
                    <td>{packageId}</td>
                    <td>{transactionUser?.isActive ? "Active" : "Inactive"}</td>
                    <td>{formatDateMDY(claimedAt)}</td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={viewPurchasePromocodeHeaders.length} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>


      </Row>


      {promocodeHistory?.appliedDetails?.count !== 0 && promocodeHistory?.appliedDetails?.rows?.length > 0 && (
        <PaginationComponent
          page={data?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

    </div>
  );
};

export default ViewPromoCode;
