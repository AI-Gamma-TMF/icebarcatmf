import React from 'react'

import {
    Col,
    Row,
    Table
} from '@themesberg/react-bootstrap'
import { useParams } from 'react-router-dom';
import { getRaffleDetail } from '../../../utils/apiCalls';
import { useQuery } from '@tanstack/react-query';
import { getDateTimeByYMD } from '../../../utils/dateFormatter';


const ViewRaffle = ({ _data }) => {
    // const navigate = useNavigate();
    const { raffleId } = useParams();
    const { data: raffleDetail } = useQuery({
        queryFn: () => {
            return getRaffleDetail(raffleId)
        },
        select: (res) => res?.data?.getRaffleDetail,
        refetchOnWindowFocus: false
    })
    
    return (
        <div>
            <Row>
                <Col sm={8}>
                    <h3>View Giveaways</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>Title</h6>
                        <span >{raffleDetail?.title}</span>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>Sub Heading</h6>
                        <span >{raffleDetail?.subHeading}</span>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>Wager Base Amount</h6>
                        <span >{raffleDetail?.wagerBaseAmt}</span>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>Status</h6>
                        <span >{raffleDetail?.isActive == true ? 'True' : 'False'}</span>
                    </div>
                </Col>

            </Row>
            <Row>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>Start Date</h6>
                        {/* <span >{formatDateMDY(raffleDetail?.startDate)}</span> */}
                        <span>{getDateTimeByYMD(raffleDetail?.startDate)}</span>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>End Date</h6>
                        {/* <span >{formatDateMDY(raffleDetail?.endDate)}</span> */}
                        <span>{getDateTimeByYMD(raffleDetail?.endDate)}</span>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>GC Prize</h6>
                        <span >{raffleDetail?.prizeAmountGc}</span>
                    </div>
                </Col>
                <Col xs={12} md={6} lg={3} >
                    <div className='d-flex justify-content-between m-1 player-basic-info align-items-center'>
                        <h6 className='mb-0 me-2'>SC Prize</h6>
                        <span >{raffleDetail?.prizeAmountSc}</span>
                    </div>
                </Col>
            </Row> 
    
                {raffleDetail?.winnerObj && raffleDetail?.winnerObj.length> 0 ?
                    <>
                        <h5>Winners Detail</h5>
                        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                            <thead className='thead-dark'>
                                <tr>
                                    <th>Winner Id</th>
                                    <th>Winner Username</th>
                                    <th>Winner Ticket Id</th>
                                    <th>Win GC amount</th>
                                    <th>win SC amount</th>
                                    <th>Win Date</th>
                                    
                                </tr>
                            </thead>

                            <tbody>
                                {raffleDetail?.winnerObj.map((winners,index) => (
                                <tr key={index}>
                                    <td>{winners?.userId}</td>
                                    <td>{winners?.User?.username}</td>
                                    <td>{winners?.entryId}</td>
                                    <td>{winners?.gcWin}</td>
                                    <td>{winners?.scWin}</td>
                                    <td>{getDateTimeByYMD(winners?.updatedAt)}</td>
                                </tr>))}
                            </tbody>
                        </Table>
                    </>
                    :<></>}
            <Row className='mt-3'>
                <Col /*sm={8}*/>
                    <h5>User Detail</h5>
                    <div style={{
                                         maxHeight: '50vh', 
                                        overflowY: 'auto',
                                        overflowX: 'auto',}}>
                    <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                        <thead>

                            <tr>
                                <th>
                                    User Id
                                </th>
                                <th>
                                    Entries
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                raffleDetail?.userEntry?.length > 0 ?
                                    raffleDetail?.userEntry?.map((e, index) => {
                                        return (
                                            <tr key={index} style={{ backgroundColor: e?.isAllowed ? 'transparent' : '#ff9999' }}>
                                                <td >
                                                    {e?.userId}
                                                </td>
                                                <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                                                        {
                                                            e?.raffleEntry?.length > 0 ?
                                                            e?.raffleEntry?.join(', ') :<></>
                                                        }
                                                </td>

                                            </tr>
                                        )
                                    })

                                    : 
                                        <tr>
                                            <td colSpan={3} className='text-danger text-center'>
                                               No Data Found
                                            </td>
                                        </tr>

                            }
                        </tbody>
                    </Table>
                    </div>


                </Col>
            </Row>
        </div>
    )
}

export default ViewRaffle
