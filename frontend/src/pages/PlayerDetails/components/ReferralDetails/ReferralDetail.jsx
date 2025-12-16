import { Accordion, Col, Row, Table } from '@themesberg/react-bootstrap'
import { useState } from 'react'
import '../../playerdetails.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { getReferralDetails } from '../../../../utils/apiCalls'
import { useQuery } from "@tanstack/react-query";
import { InlineLoader } from '../../../../components/Preloader'
import PaginationComponent from '../../../../components/Pagination'
import { tableHeaders } from './constants'
import { formatAmountWithCommas } from '../../../../utils/helper'

const ReferralDetail = ({ user, accordionOpen, setAccordionOpen }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(30);

    const { data, isLoading: loading } = useQuery({
        queryKey: ["referralList",
            page, limit
        ],
        queryFn: () => {
            const params = {
                pageNo: page,
                limit,
                userId: user.userId,
            };
            return getReferralDetails(params);
        },
        enabled: accordionOpen,
        refetchOnWindowFocus: false,
        select: (res) => res?.data,
    });

    const totalPages = Math.ceil(data?.count / limit);

    // function formatNumber(coin) {
    //     if (typeof coin !== 'number') {
    //         return coin
    //     }
    //     const formattedNumber = coin.toLocaleString('en-US', {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2
    //     })
    //     return formattedNumber
    // }


    // const {
    //     data: casinoSearchData,
    // } = useGetPlayerCasinoQuery({
    //     params:
    //     {
    //         userId: user.userId,
    //     },
    // })


    // const convToStr = (value) => {
    //     if (typeof value === 'number') {
    //         return value.toFixed(2).toString()
    //     }
    //     else
    //         return Number(value).toFixed(2).toString()
    // }


    return (

        <>
            <Row className='mt-4' onClick={() => setAccordionOpen(!accordionOpen)} style={{ cursor: 'pointer' }}>
                <h5 className='accordian-heading'>
                    <span>Referral Details</span>
                    <span>{accordionOpen ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />} </span>
                </h5>
            </Row>

            <Accordion activeKey={accordionOpen ? '0' : ''}>
                <Accordion.Item eventKey="0">
                    <Accordion.Body>
                        <Row>
                            <Col className='col-padding'>
                                <Row className='div-overview'>
                                    <Col xs={12} md={6} lg={3} >
                                        <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                                            <h6 className='mb-0 me-2'>Total GC Earn :</h6>
                                            <span className={`text-break`}>{formatAmountWithCommas(data?.referralAmount?.totalGcEarn || 0)}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6} lg={3} >

                                        <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                                            <h6 className='mb-0 me-2'>Total SC Earn :</h6>
                                            <span className={`text-break`}>{formatAmountWithCommas(data?.referralAmount?.totalScEarn || 0)}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>


                        <Row>
                            <Col>
                                <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            {tableHeaders.map((header, index) => (
                                                <th key={index}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.count > 0 ?
                                            data?.referralDetails?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.userId}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.username}</td>
                                                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                                                    <td>{item.bonusStatus}</td>
                                                    <td>{formatAmountWithCommas(item.totalPurchaseAmount)}</td>
                                                    <td>{formatAmountWithCommas(item.totalGcPurchase)}</td>
                                                    <td>{formatAmountWithCommas(item.totalScPurchase)}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={19} className="text-danger text-center">
                                                        No Data Found
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                                {loading && <InlineLoader />}
                                {data?.count !== 0 && (
                                    <PaginationComponent
                                        page={page}
                                        totalPages={totalPages}
                                        setPage={setPage}
                                        limit={limit}
                                        setLimit={setLimit}
                                    />
                                )}
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    )
}

export default ReferralDetail
