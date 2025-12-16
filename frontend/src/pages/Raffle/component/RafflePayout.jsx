import React, { useState } from 'react'
import {
    Button,
    Row,
    Col,
    Table,
    OverlayTrigger,
    Tooltip,
    Form as BForm
} from '@themesberg/react-bootstrap'

import { useNavigate, useParams } from 'react-router-dom';
import { getPayoutUserSearch, getRaffleDetail, getRafflePayout } from '../../../utils/apiCalls';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage, Form, Formik} from 'formik';
import Trigger from '../../../components/OverlayTrigger';
import Datetime from 'react-datetime';
import { formatDateYMD, getDateTimeByYMD } from '../../../utils/dateFormatter';
import {  useRafflePayoutMutation } from '../../../reactQuery/hooks/customMutationHook';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AdminRoutes } from '../../../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import useCheckPermission from '../../../utils/checkPermission';

const RafflePayout = () => {
  const navigate = useNavigate();
  const { isHidden } = useCheckPermission();
  const [showRows, setShowRows] = useState(false);
  const [winnerList, setWinnerList] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);
  const [awardedTicketId, setAwardedTicketId] = useState();

  const { raffleId } = useParams();
  const [searchId, setSearchId] = useState(0);

    const { data: rafflePayoutDetail } = useQuery({
        queryFn: () => {
            return getRafflePayout(raffleId)
        },
        select: (res) => res?.data?.rafflePayout,
        refetchOnWindowFocus: false
    })
    const { data: raffleDetail } = useQuery({
        queryKey: ['RaffleDetail'],
        queryFn: () => {
            return getRaffleDetail(raffleId)
        },
        select: (res) => res?.data?.getRaffleDetail,
        refetchOnWindowFocus: false
    })

  const handleButtonClick = () => {
    setShowRows(!showRows);
  };

  const handleWinnerChange = (e, field) => {
    if (typeof e === "object" && e._d) {
      setFormData({ ...formData, [field]: formatDateYMD(e._d) });
    } else {
      const { name, value, checked } = e.target;
      if (name === "isGiveAwayCompleted")
        setFormData({ ...formData, [name]: checked });
      else setFormData({ ...formData, [name]: value });
    }
  };

    const handleCancel = () => {
        setShowRows(false);
        setFormData({ awardedTicketIds:[], scWin : "", gcWin: "", isGiveAwayCompleted:false});
        setAwardedTicketId();
        setSelectedTicketIds([]);
        setWinnerList([]);
      };
      
    const { data: _payoutSearch, refetch} = useQuery({
        queryKey: ['payoutsearch', raffleId, searchId],
        queryFn: ({ queryKey }) => {
            const params = {};
            if (queryKey[1] && queryKey[2] > 0) {
                params.raffleId = queryKey[1]
                params.entryId = queryKey[2]
                return getPayoutUserSearch(params)
            }
            else {
                return
            }

        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
        retry: false, 
        onSuccess: (data) => {
            if(data?.isUserAlreadyAWinner?.entryId){
                toast.success(`Entry Id ${data?.isUserAlreadyAWinner?.entryId} has already won ${data?.isUserAlreadyAWinner?.scWin} SC and ${data?.isUserAlreadyAWinner?.gcWin} GC in the Giveaway on ${getDateTimeByYMD(data?.isUserAlreadyAWinner?.updatedAt)}.`)
            }
            else if(data?.rafflePayout){
                    setSelectedTicketIds((prev) => [...prev, data?.rafflePayout?.entryId]);
                    setWinnerList((prev) => [...prev, data?.rafflePayout]);
            }
            
            // else if (data?.rafflePayout && !selectedTicketIds.includes(data?.rafflePayout?.entryId)) {   
                // const alreadySelectedTicketId =  winnerList?.find((winner)=>winner?.User?.username === data?.rafflePayout?.User?.username)?.entryId;
                //if(alreadySelectedTicketId && alreadySelectedTicketId > 0){
                    // toast.success(`This user is already selected with Ticket Id : ${alreadySelectedTicketId}`)
                // }
                // else{
                    // setSelectedTicketIds((prev) => [...prev, data?.rafflePayout?.entryId]);
                    // setWinnerList((prev) => [...prev, data?.rafflePayout]);
                // }
            // }
            
        },
        onError: (error) => {
            const {errors} = error?.response?.data || {}
            if(errors?.length>0 && errors[0]?.description){
                toast.error(errors[0]?.description)
            }
        }
    })

    const handleSearch = (id) => {
         if (!(selectedTicketIds.includes(Number(id)))) { 
            setSearchId(id);
            refetch();
         } else {
             toast.success(`Ticket ID ${id} is already in the list.`);
         }
    };
    
    const handlePayout = (raffleId) => {
        const body = {
            raffleId: +raffleId,
            entryIds: selectedTicketIds,
            scWinAmount : formData?.scWin ? +(formData?.scWin):0,
            gcWinAmount : formData?.gcWin ? +(formData?.gcWin):0,
            isCompleted : formData?.isGiveAwayCompleted ? formData.isGiveAwayCompleted : false,
        };
        rafflePayout(body)
    }
    const { mutate: rafflePayout} = useRafflePayoutMutation({
        onSuccess: () => {
            toast('Awarded user payout successfully', 'success')
            navigate(AdminRoutes.Raffle)
        }, onError: (error) => {
            toast(error.response.data.errors[0].description, 'error')
        }
    })
    const handleDeleteWinner = (ticketId)=>{
        const updatedWinnerList = winnerList?.filter(winner => winner?.entryId !== ticketId);
        setWinnerList(updatedWinnerList);
        const updatedSelectedIds = selectedTicketIds?.filter(id=> id!==ticketId);
        setSelectedTicketIds(updatedSelectedIds);
    }
    return (
        <>
            <Row className='mb-2'>
                <Col>
                    <h3>Giveaways Payout</h3>
                </Col>
            </Row>
            {rafflePayoutDetail ?
                (<Formik
                    initialValues={{
                        title: rafflePayoutDetail?.title,
                        endDate: rafflePayoutDetail?.endDate,
                        startDate: rafflePayoutDetail?.startDate,
                        description: rafflePayoutDetail?.description,
                        totalNoOfEntryTickets: rafflePayoutDetail?.entryRequiredDetails?.totalNoOfEntryTickets,
                        firstTicketId: rafflePayoutDetail?.entryRequiredDetails?.firstTicketId,
                        lastTicketId: rafflePayoutDetail?.entryRequiredDetails?.lastTicketId,

                        awardedTicketDetails: [],
                        prizeAmountSc: rafflePayoutDetail?.prizeAmountSc,
                        isActive: rafflePayoutDetail?.isActive,
                        // isGiveAwayCompleted: rafflePayoutDetail?.isComplete ? true : false
                    }}
                    enableReinitialize={true}
                // onSubmit={handleEditRaffleSubmit}
                >
                    {({
                        values,
                        handleChange,
                        // handleSubmit,
                        handleBlur,
                    }) => (
                        <Form>
                            <Row>
                                <Col>
                                    <BForm.Label>
                                        Title

                                    </BForm.Label>

                  <BForm.Control
                    type="text"
                    name="title"
                    min="0"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={true}
                  />

                  <ErrorMessage
                    component="div"
                    name="title"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>End Date</BForm.Label>
                  <Datetime
                    inputProps={{
                      disabled: true,
                      readOnly: true,
                    }}
                    dateFormat="MM/DD/YYYY"
                    value={getDateTimeByYMD(values.endDate)}
                    timeFormat={true}
                  />
                  <ErrorMessage
                    component="div"
                    name="endDate"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>Description</BForm.Label>

                  <BForm.Control
                    type="text"
                    name="description"
                    min="0"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={true}
                  />

                  <ErrorMessage
                    component="div"
                    name="description"
                    className="text-danger"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <BForm.Label>Ticket Awarded</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="totalNoOfEntryTickets"
                    min="0"
                    value={values.totalNoOfEntryTickets}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={true}
                  />

                  <ErrorMessage
                    component="div"
                    name="totalNoOfEntryTickets"
                    className="text-danger"
                  />
                </Col>
                <Col>
                  <BForm.Label>Ticket ID</BForm.Label>
                  <Row>
                    <Col>
                      <BForm.Control
                        type="number"
                        name="firstTicketId"
                        min="0"
                        value={values.firstTicketId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                    </Col>
                    <Col>
                      <BForm.Control
                        type="number"
                        name="lastTicketId"
                        min="0"
                        value={values.lastTicketId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col /*sm={8}*/>
                  <h5>User Detail</h5>
                  <div
                    style={{
                      maxHeight: "50vh",
                      overflowY: "auto",
                      overflowX: "auto",
                    }}
                  >
                    <Table
                      bordered
                      striped
                      responsive
                      hover
                      size="sm"
                      className="text-center mt-4"
                    >
                      <thead>
                        <tr>
                          <th>User Id</th>
                          <th>Entries</th>
                        </tr>
                      </thead>
                      <tbody>
                        {raffleDetail?.userEntry.length > 0 ? (
                          raffleDetail?.userEntry.map((e, index) => {
                            return (
                              <tr
                                key={index}
                                style={{
                                  backgroundColor: e?.isAllowed
                                    ? "transparent"
                                    : "#ff9999",
                                }}
                              >
                                <td>{e?.userId}</td>
                                <td
                                  style={{
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {e?.raffleEntry?.length > 0 ? (
                                    e?.raffleEntry?.join(", ")
                                  ) : (
                                    <></>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-danger text-center">
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              {raffleDetail?.status !== "completed" ? (
                <div className="container-fluid">
                  <Row
                    className="rounded mt-2 p-2"
                    style={{ border: "0.0625rem solid #d1d7e0" }}
                  >
                    <Row>
                      <Button
                        variant="outline-secondary"
                        className="f-right ml-2"
                        onClick={handleButtonClick}
                        hidden={showRows}
                        // style={{ width: "150px", left: "10px" }}
                      >
                        Add Winner lists by each day
                      </Button>
                    </Row>
                    {showRows && (
                      <>
                        <Row>
                          <Col>
                            <BForm.Label>Awarded Ticket Id</BForm.Label>

                            <BForm.Control
                              type="text"
                              name="awardedTicketId"
                              min="0"
                              value={awardedTicketId}
                              onChange={(e) =>
                                setAwardedTicketId(e.target.value)
                              }
                              onBlur={handleBlur}
                            />

                            <ErrorMessage
                              component="div"
                              name="awardedTicketId"
                              className="text-danger"
                            />
                          </Col>
                          <Col
                            style={{ display: "flex", alignItems: "flex-end" }}
                          >
                            <Button
                              variant="success"
                              onClick={() => {
                                handleSearch(awardedTicketId);
                              }}
                              disabled={!awardedTicketId}
                              className="ml-2 mt-4 "
                            >
                              Search
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col className="col-12 col-sm-6">
                            <BForm.Label>SC Win Coins</BForm.Label>
                            <BForm.Control
                              type="number"
                              name="scWin"
                              min="0"
                              value={formData.scWin}
                              onChange={handleWinnerChange}
                            />
                            <ErrorMessage
                              component="div"
                              name="scWin"
                              className="text-danger"
                            />
                          </Col>
                          <Col className="col-12 col-sm-6">
                            <BForm.Label>GC Win Coins</BForm.Label>
                            <BForm.Control
                              type="number"
                              name="gcWin"
                              min="0"
                              value={formData.gcWin}
                              onChange={handleWinnerChange}
                            />
                            <ErrorMessage
                              component="div"
                              name="gcWin"
                              className="text-danger"
                            />
                          </Col>
                        </Row>
                        <div className="mt-4 d-flex justify-content-between align-items-center">
                          <Button variant="warning" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </Row>
                </div>
              ) : (
                <></>
              )}

              {winnerList && winnerList.length > 0 ? (
                <>
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
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Winner Ticket Id</th>
                        <th>Raffle Id</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {winnerList.map((winners, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor: winners?.User?.isAllowed
                              ? "transparent"
                              : "#ff9999",
                          }}
                        >
                          <td>{winners?.User?.username}</td>
                          <td>{winners?.User?.email}</td>
                          <td>{winners?.entryId}</td>
                          <td>{winners?.raffleId}</td>
                          <td>
                            <Trigger
                              message="Delete"
                              id={winners?.entryId + "delete"}
                            />
                            <Button
                              id={winners?.entryId + "delete"}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleDeleteWinner(winners?.entryId)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div>
                    <Row className="align-items-center justify-content-between ">
                      <Col xs={12} md="auto" className="d-flex">
                        <Button
                          variant="success"
                          onClick={() => handlePayout(raffleId)}
                          style={{ width: "80px" }}
                          className="m-1"
                          disabled={
                            Object.keys(formData).length === 0 ||
                            (Number(formData.scWin || 0) <= 0 &&
                              Number(formData.gcWin || 0) <= 0)
                          }
                          hidden={isHidden({
                            module: { key: "RafflePayout", value: "U" },
                          })}
                        >
                          Payout
                        </Button>
                      </Col>

                      {/* <Row className="mt-3" style={{ position: "relative" }}> */}
                      {/* <div className="col-12 col-lg-12"> */}
                      <Col xs={12} md="auto">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-valid-from">
                              Mark the giveaway as completed
                            </Tooltip>
                          }
                        >
                          <Col className="d-flex align-items-center">
                            <BForm.Label className="mb-0 me-2">
                              Giveaway completed
                              {/* <span className='text-danger'> *</span> */}
                            </BForm.Label>

                            <BForm.Check
                              type="switch"
                              name="isGiveAwayCompleted"
                              className="ms-2"
                              // placeholder='Enter Ac'
                              checked={formData.isGiveAwayCompleted}
                              onChange={handleWinnerChange}
                              onBlur={handleBlur}
                              // disabled={details}
                            />

                            <ErrorMessage
                              component="div"
                              name="isGiveAwayCompleted"
                              className="text-danger"
                            />
                          </Col>
                        </OverlayTrigger>
                      </Col>
                      {/* </div> */}
                    </Row>
                  </div>
                </>
              ) : (
                <></>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </>
  );
};

export default RafflePayout;
