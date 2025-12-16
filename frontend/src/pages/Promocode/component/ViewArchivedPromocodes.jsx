import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Table, Form as BForm } from "@themesberg/react-bootstrap";
import {
  formatDateMDY,
  getDateTime,
} from "../../../utils/dateFormatter.js";

import { getPackageDetails, getPromoCodeHistory } from "../../../utils/apiCalls.js";
import { useQuery } from "@tanstack/react-query";
import { viewPurchasePromocodeHeaders } from "../constant.js";
import PaginationComponent from "../../../components/Pagination/index.jsx";
import usePromoCodeListing from '../hooks/usePromoCodeListing';
import useCheckPermission from "../../../utils/checkPermission.js";

const ViewArchivedPromoCode = ({ data }) => {
  const [limit, setLimit] = useState(15)
  const [packageLimit, setPackageLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [packagePage, setPackagePage] = useState(1)
  const [orderBy, _setOrderBy] = useState('')
  const [sort, _setSort] = useState('DESC')
  const { isHidden } = useCheckPermission();
  const { promocodeId } = useParams();

  const { isArchive, setIsArchive } = usePromoCodeListing()
  
  useEffect(()=> {
    setIsArchive(true)
  }, [])

  const { data: promoDetail } = useQuery({
    queryKey: ['promoDetail', limit, page, orderBy, sort, promocodeId, isArchive],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], promocodeId: queryKey[5], isArchive: queryKey[6] };
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[3]) params.page = queryKey[3]
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocodeId = queryKey[5]
      if (queryKey[6]) params.isArchive = queryKey[6]

      return getPromoCodeHistory(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  const { data: packageDetails } = useQuery({
    queryKey: ['packageDetails', packageLimit, packagePage, orderBy, sort, promocodeId, isArchive],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], promocodeId: queryKey[5], isArchive: queryKey[6] };
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[3]) params.page = queryKey[3]
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocodeId = queryKey[5]
      if (queryKey[6]) params.isArchive = queryKey[6]

      return getPackageDetails(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  const totalPages = Math.ceil(promoDetail?.appliedDetails?.count / limit);
  const totalPagesPackages = Math.ceil(packageDetails?.count / packageLimit);
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
            <span >{promoDetail?.promocodeExist?.promocode}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promo Id</h6>
            <span >{promoDetail?.promocodeExist?.promocodeId}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Valid Till</h6>
            <span >{promoDetail?.promocodeExist?.validTill ? getDateTime(promoDetail?.promocodeExist?.validTill) : 'N/A'}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Status</h6>
            <span >{promoDetail?.promocodeExist?.isActive == true ? "Active" : "Inactive"}</span>
          </div>
        </Col>

      </Row>

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
      {packageDetails?.count !== 0 && packageDetails?.packages.length > 0  &&(
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
              {viewPurchasePromocodeHeaders.map((h, idx) => (
                <th
                  key={idx}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {h.labelKey}{" "}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promoDetail?.appliedDetails?.count > 0 &&
              promoDetail?.appliedDetails?.rows?.map(
                ({ packageId, userId, transactionUser, claimedAt }) => {
                  return (
                    <tr key={userId}>
                      <td>{userId}</td>
                      <td>{transactionUser?.username}</td>
                      <td>
                        {isHidden({ module: { key: "Users", value: "R" } }) ? (
                          transactionUser?.email
                        ) : (
                          <Link to={`/admin/player-details/${userId}`}>{transactionUser?.email}</Link>
                        )}
                      </td>
                      <td>{transactionUser?.firstName} {transactionUser?.lastName}</td>
                      <td>{packageId}</td>
                      <td>{transactionUser?.isActive ? "Active" : "Inactive"}</td>
                      <td>{formatDateMDY(claimedAt)}</td>
                    </tr>
                  );
                }
              )}

            {promoDetail?.appliedDetails?.count === 0 && (
              <tr>
                <td colSpan={7} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>


      {promoDetail?.appliedDetails?.count !== 0 && promoDetail?.appliedDetails?.rows?.length > 0 && (
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

export default ViewArchivedPromoCode;
