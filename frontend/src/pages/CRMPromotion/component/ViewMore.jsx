import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDebounce } from 'use-debounce'
import { Col, Row, Table, Form as BForm, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import {
  formatDateMDY,
} from "../../../utils/dateFormatter.js";
import { getCRMBonusUserDetailsapi } from "../../../utils/apiCalls.js";
import { useQuery } from "@tanstack/react-query";
import { viewUserDetailsHeaders } from "../constant.js";
import PaginationComponent from "../../../components/Pagination/index.jsx";
import useCheckPermission from "../../../utils/checkPermission.js";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import { formatPriceWithCommas } from "../../../utils/helper.js";


const ViewMoreCRMPromoBonus = ({ data }) => {
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, _setOrderBy] = useState('')
  const [sort, _setSort] = useState('DESC')
  const { crmPromotionId } = useParams();
  const { isHidden } = useCheckPermission();
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);
  const [isActive, setIsActive] = useState('all')

  const { data: promoDetail } = useQuery({
    queryKey: ['promoDetail', limit, page, orderBy, sort, crmPromotionId, debouncedSearch, isActive],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], crmPromotionId: queryKey[5], unifiedSearch: queryKey[6], isActive: queryKey[7] };
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[3]) params.page = queryKey[3]
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.crmPromotionId = queryKey[5]
      if (queryKey[6]) params.unifiedSearch = queryKey[6]
      if (queryKey[7]) params.isActive = queryKey[7]

      return getCRMBonusUserDetailsapi(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  const totalPages = Math.ceil(promoDetail?.count / limit);

  const resetFilters = () => {
    setSearch('')
    setIsActive('all')
  }
  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>View CRM Bonus User Details </h3>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>CRM Promotion Id</h6>
            <span >{promoDetail?.crmBonusDetails?.crmPromotionId}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promo code</h6>
            <span >{promoDetail?.crmBonusDetails?.promocode}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Name</h6>
            <span >{promoDetail?.crmBonusDetails?.name}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Campaign Id</h6>
            <span >{promoDetail?.crmBonusDetails?.campaignId}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>SC Amount</h6>
            <span >{formatPriceWithCommas(promoDetail?.crmBonusDetails?.scAmount)}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>GC Amount</h6>
            <span >{formatPriceWithCommas(promoDetail?.crmBonusDetails?.gcAmount)}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promotion Type</h6>
            <span >{promoDetail?.crmBonusDetails?.promotionType}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Start Date</h6>
            <span >{promoDetail?.crmBonusDetails?.startDate}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>End Date</h6>
            <span >{promoDetail?.crmBonusDetails?.endDate}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Status</h6>
            <span >{promoDetail?.crmBonusDetails?.isActive == true ? "Active" : "Inactive"}</span>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <BForm.Label>User Details</BForm.Label>
        <Row>
          <Col xs={4}>
            <BForm.Label>
              Search by Email, Username, Name, Last Name or User Id
            </BForm.Label>

            <BForm.Control
              type='search'
              placeholder='Search...'
              value={search}
              onChange={(event) => {
                setPage(1)
                setSearch(event?.target?.value)
              }}
            />
          </Col>

          <Col xs={3} >
            <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
              <BForm.Label>
                Status
              </BForm.Label>

              <BForm.Select
                onChange={(e) => {
                  setPage(1)
                  setIsActive(e?.target?.value)
                }}
                value={isActive}
              >
                <option value='all'>All</option>
                <option value='true'>Active</option>
                <option value='false'>In-Active</option>
              </BForm.Select>
            </div>
          </Col>

          <Col xs={3} style={{ margin: "30px" }}>
            <Trigger message='Reset Filters' id={'redo'} />
            <Button
              id={'redo'}
              variant='success'
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>
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
              {viewUserDetailsHeaders.map((h, idx) => (
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
            {promoDetail?.userDetails?.count > 0 &&
              promoDetail?.userDetails?.rows?.map(
                ({ userId, User, claimedAt }) => {
                  return (
                    <tr key={userId}>
                      <td>{User?.userId}</td>
                      <td>{User?.username}</td>
                      <td>  {isHidden({ module: { key: "Users", value: "R" } }) ? (
                        User?.email
                      ) : (<Link to={`/admin/player-details/${User?.userId}`}  className="text-link d-inline-block text-truncate">{User?.email}</Link>)}</td>
                      <td>{User?.firstName} {User?.lastName}</td>
                      <td>{User?.lastName}</td>
                      <td>{User?.isActive ? "Active" : "Inactive"}</td>
                      <td>{claimedAt ? formatDateMDY(claimedAt) : 'Not Claimed'}</td>
                    </tr>
                  );
                }
              )}

            {promoDetail?.userDetails?.count === 0 && (
              <tr>
                <td colSpan={7} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>


      {promoDetail?.userDetails?.count !== 0 && promoDetail?.userDetails?.rows?.length > 0 && (
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

export default ViewMoreCRMPromoBonus;
