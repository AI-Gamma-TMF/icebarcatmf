import React, {  useState } from "react";
import {  useParams,useNavigate } from "react-router-dom";
import { Button, Col, Row, Table } from "@themesberg/react-bootstrap";
import {
  formatDateMDY,
} from "../../../utils/dateFormatter.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCRMPromoBonusHistory } from "../../../utils/apiCalls.js";
import { useQuery } from "@tanstack/react-query";
import { viewPromocodeHeaders , STATUS_LABELS } from "../constant.js";
import PaginationComponent from "../../../components/Pagination/index.jsx";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import {  faEye } from "@fortawesome/free-regular-svg-icons";
import { AdminRoutes } from "../../../routes.js";
// import { STATUS_LABELS } from "../constant.js";
import { formatPriceWithCommas } from "../../../utils/helper.js";

const ViewCRMPromoBonus = ({ data }) => {
    const navigate = useNavigate();
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, _setOrderBy] = useState('')
  const [sort, _setSort] = useState('DESC')
  const  {promocode} = useParams();

  const { data: promoDetail} = useQuery({
    queryKey: ['promoDetail', limit, page, orderBy, sort, promocode],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], promocode: queryKey[5] };
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[3]) params.page = queryKey[3]
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocode = queryKey[5]

      return getCRMPromoBonusHistory(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(promoDetail?.count / limit);

  // const handleAddGame = (e,item) =>{
  //  console.log(e,item)
  // }

  
  return (

    <div>
    <Row>
      <Col sm={8}>
        <h3>View CRM Purchase Promo Bonus </h3>
      </Col>
    </Row>


    <Row className="mt-3">

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
          {promoDetail?.count > 0 &&
            promoDetail?.rows?.map(
              ({ crmPromotionId, promocode,name, campaignId,claimedCount,gcBonus,scBonus,
                isActive,startDate ,endDate,deletedAt, status,claimedScAmount,claimedGcAmount,
              pendingCount,pendingScAmount,pendingGcAmount}) => {
                return (
                  <tr key={crmPromotionId}>
                    <td>{crmPromotionId}</td>
                    <td>{promocode}</td>
                    <td>{name}</td>
                    <td>{campaignId}</td>
                    <td>{formatPriceWithCommas(scBonus)}</td>
                    <td>{formatPriceWithCommas(gcBonus)}</td>
                    <td>{claimedCount}</td>
                    <td>{formatPriceWithCommas(claimedScAmount)}</td>
                    <td>{pendingCount}</td>
                    <td>{formatPriceWithCommas(pendingScAmount)}</td>
                    {/* <td>{isActive ? "Active" : "Inactive"}</td> */}
                    <td>{STATUS_LABELS[status] || '-'}</td>
                    <td>{startDate? formatDateMDY(startDate): '-'}</td>
                    <td>{endDate? formatDateMDY(endDate): '-'}</td>
                    {/* <td>{deletedAt? formatDateMDY(deletedAt):'-'}</td> */}
                    <td>
                   <Trigger message={"View"} id={crmPromotionId + "view"} />
                  <Button
                    id={crmPromotionId + "view"}
                    className="m-1"
                    size="sm"
                    variant="info"
                    onClick={() =>navigate(`${AdminRoutes.CrmPromoBonusViewMore.split(":").shift()}${crmPromotionId}`)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button> 
                  </td>
                  </tr>
                );
              }
            )}

          {promoDetail?.count === 0 && (
            <tr>
              <td colSpan={7} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Row>


    {promoDetail?.count !== 0 && promoDetail?.rows?.length > 0 && (
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

export default ViewCRMPromoBonus;
