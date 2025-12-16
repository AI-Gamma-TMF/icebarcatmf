import React, { useState } from "react";
import { useDebounce } from 'use-debounce'
import { Link, useParams } from "react-router-dom";
import { Col, Row, Table, Form, Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import {
  formatDateMDY,
} from "../../../utils/dateFormatter.js";
import { getPromotionBonusDetail } from "../../../utils/apiCalls.js";
import { useQuery } from "@tanstack/react-query";
import { viewPromocodeHeaders } from "../constant.js";
import useCheckPermission from "../../../utils/checkPermission.js";
import { formatAmountWithCommas } from '../../../utils/helper.js';
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import PaginationComponent from "../../../components/Pagination";
const ViewPromotionBonus = ({ data }) => {
  const { isHidden } = useCheckPermission();
  const [userIdSearch, setUserIdSearch] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);
  const [bonusSC, setBonusSC] = useState('')
  const [bonusGC, setBonusGC] = useState('')
  const [debouncedSCAmount] = useDebounce(bonusSC, 500)
  const [debouncedGCAmount] = useDebounce(bonusGC, 500)
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')
  const [bonusScError, setBonusScError] = useState('')
  const [bonusGcError, setBonusGcError] = useState('')
  const [page,setPage] = useState(1)
  const [limit,setLimit]=useState(15)

  const { promocodeId } = useParams();
  const { data: promoDetail } = useQuery({
    queryKey: ['promotionList', userIdSearch, debouncedSearch, debouncedSCAmount, debouncedGCAmount, statusFilter],
    queryFn: ({ queryKey }) => {
      const [, _userId] = queryKey;
      const params = {};
      if (queryKey[1]) params.userId = queryKey[1];
      if (queryKey[2]) params.search = queryKey[2];
      if (queryKey[3]) params.bonusSc = queryKey[3]
      if (queryKey[4]) params.bonusGc = queryKey[4]
      if (queryKey[5]) params.status = queryKey[5]
      return getPromotionBonusDetail(promocodeId, params);
    },
    select: (res) => res?.data?.promoCodeDetails,
    refetchOnWindowFocus: false,
  });
  
  const totalPages = Math.ceil(promoDetail?.userBonusDetail?.count / limit)
  
  const resetFilters = () => {
    setUserIdSearch('')
    setSearch('')
    setBonusSC('')
    setBonusGC('')
    setStatusFilter('all')
    setError('')
    setBonusScError('')
    setBonusGcError('')
  }

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>View Affiliate Promo Codes </h3>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promocode</h6>
            <span >{promoDetail?.promoDetail?.promocode}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Affiliate Id</h6>
            <span >{formatAmountWithCommas(promoDetail?.promoDetail?.affiliateId)}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Valid Till</h6>
            <span >{promoDetail?.promoDetail?.validTill ? formatDateMDY(promoDetail?.promoDetail?.validTill) : 'N/A'}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Status</h6>
            <span >{promoDetail?.promoDetail?.isActive == true ? 'True' : 'False'}</span>
          </div>
        </Col>
        <Col xs={12} md={6} lg={3} >
          <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
            <h6 className='mb-0 me-2'>Promocode Used</h6>
            <span >{formatAmountWithCommas(promoDetail?.promoDetail?.useCount)}</span>
          </div>
        </Col>

      </Row>


      <Row>
        <Col xs={3} className="mb-3">
          <Form.Label>
            Id Search
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Search By User Id'
            value={userIdSearch}
            onChange={(event) => {
              // setPage(1)
              const inputValue = event?.target?.value;
              if (/^\d*$/.test(inputValue)) {
                if (inputValue.length <= 10) {
                  // setPage(1);
                  setUserIdSearch(inputValue);
                  setError('')
                } else {
                  setError('User Id cannot exceed 10 digits')
                }
              }
            }}
          />
          {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
        </Col>

        <Col xs={3} className="mb-3">
          <Form.Label >
            Search by Username or Email
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Search By Username or Email'
            value={search}
            onChange={(event) => {
              // setPage(1)
              setSearch(event?.target?.value)
            }}
          />
        </Col>

        <Col xs={3} className="mb-3">
          <Form.Label>
            Bonus SC
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Bonus SC'
            value={bonusSC}
            onChange={(event) => {
              const inputValue = event?.target?.value;
              if (/^\d*\.?\d*$/.test(inputValue)) {
                if (inputValue.length <= 10) {
                  // setPage(1);
                  setBonusSC(inputValue);
                  setBonusScError('')
                } else {
                  setBonusScError('Bonus SC cannot exceed 10 digits')
                }
              }
            }}
          />
          {bonusScError && <div style={{ color: 'red', marginTop: '5px' }}>{bonusScError}</div>}

        </Col>
        <Col xs={3} className="mb-3">
          <Form.Label>
            Bonus GC
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Bonus GC'
            value={bonusGC}
            onChange={(event) => {
              const inputValue = event?.target?.value;
              if (/^\d*\.?\d*$/.test(inputValue)) {
                if (inputValue.length <= 10) {
                  // setPage(1);
                  setBonusGC(inputValue);
                  setBonusGcError('')
                } else {
                  setBonusGcError('Bonus GC cannot exceed 10 digits')
                }
              }
            }}
          />
          {bonusGcError && <div style={{ color: 'red', marginTop: '5px' }}>{bonusGcError}</div>}

        </Col>

        <Col xs={3} className="mb-3">
          <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
            <Form.Label >
              Status
            </Form.Label>

            <Form.Select
              onChange={(e) => {
                // setPage(1)
                setStatusFilter(e.target.value)
              }}
              value={statusFilter}
            >
              <option value='all'>All</option>
              <option value='CLAIMED'>Claimed</option>
              <option value='PENDING'>Pending</option>
            </Form.Select>
          </div>
        </Col>

        <Col xs={3} className="mb-3" style={{ marginTop: "30px" }}>
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            className=""
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
            {viewPromocodeHeaders.map((h, idx) => (
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
          {promoDetail?.userBonusDetail?.count > 0 &&
            promoDetail?.userBonusDetail?.rows?.map(
              ({
                userId,
                status,
                User,
                gcAmount,
                scAmount,
                createdAt,
                claimedAt
              }) => {
                return (
                  <tr key={userId}>
                    <td>{userId}</td>
                    <td>{User?.username}</td>
                    <td>
                      {isHidden({ module: { key: "Users", value: "R" } }) ? (
                        User?.email
                      ) : (
                        <Link to={`/admin/player-details/${userId}`}  className="text-link d-inline-block text-truncate" >{User?.email}</Link>
                      )}
                    </td>
                    <td>{status}</td>
                    <td>{formatAmountWithCommas(scAmount)}</td>
                    <td>{formatAmountWithCommas(gcAmount)}</td>
                    <td>{formatDateMDY(createdAt)}</td>
                    <td>{claimedAt ? formatDateMDY(claimedAt) : 'N/A'}</td>
                  </tr>
                );
              }
            )}

          {promoDetail?.userBonusDetail?.count === 0 && (
            <tr>
              <td colSpan={7} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {promoDetail?.userBonusDetail?.count !== 0 && (
        <PaginationComponent
          page={promoDetail?.userBonusDetail?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </div>
  );
};

export default ViewPromotionBonus;
