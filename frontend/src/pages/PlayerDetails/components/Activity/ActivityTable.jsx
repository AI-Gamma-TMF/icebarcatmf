import { Accordion, Button, Row, Table } from '@themesberg/react-bootstrap';
import { useDebounce } from 'use-debounce'
import { useEffect, useState } from 'react';
import { activityTableHeader, TRANSACTION_STATUS } from '../../constants';
import { InlineLoader } from '../../../../components/Preloader';
import PaginationComponent from '../../../../components/Pagination';
import { useQuery } from '@tanstack/react-query';
import { getActivityTable, getUserAllCasinoProviders  } from '../../../../utils/apiCalls';
import { useParams } from 'react-router-dom';
import { getDateTime } from '../../../../utils/dateFormatter';
import ActivityTableFilters from './ActivityTableFilters';
import Trigger from '../../../../components/OverlayTrigger';
import {
  convertTimeZone,
  convertToTimeZone,
  convertToUtc,
  getFormattedTimeZoneOffset,
} from '../../../../utils/helper';
import { ApproveRedeemConfirmation, MoreDetail } from '../../../../components/ConfirmationModal';
import useWithdrawTransactions from '../../../WithdrawRequest/hooks/useWithdrawTransactions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronRight, faTimesSquare } from '@fortawesome/free-solid-svg-icons';
import { getItem } from '../../../../utils/storageUtils';
import { timeZones } from '../../../Dashboard/constants';
import { useUserStore } from '../../../../store/store';
const ActivityTable = ({ 
  // setOpenAccountOverview, 
  // setCurrentDetails, 
  accordionOpen, setAccordionOpen }) => {
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  // const [state, setState] = useState([
  //   {
  //     startDate: getDateThreeMonthsBefore(),
  //     endDate: new Date(),
  //     key: 'selection',
  //   },
  // ]);
  // const [providerId, setProviderId] = useState('all');
  // const [status, setStatus] = useState('all');
  const [providerName, setProviderName] = useState('all');
  const [providerNameArray, setProviderNameArray] = useState([{ lable: 'All', value: 'all' }]);
  const [transaction, setTransaction] = useState('all');
  const [coinType, setCoinType] = useState('all');
  // const [activity, setActivity] = useState('all');
  const { userId } = useParams();
  const [show, setShow] = useState(false);
  const [moreDetailData, setMoreDetailData] = useState(null);
  const [action, setAction] = useState('all');

  const timezone = getItem('timezone');
  const timezoneOffset =
    timezone != null ? timeZones.find((x) => x.code === timezone).value : getFormattedTimeZoneOffset();
  // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x => x.value === timezoneOffset)?.code);
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(convertTimeZone(new Date(), timeZoneCode));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));
  const [errorEnd, setErrorEnd] = useState('');
  const [errorStart, setErrorStart] = useState('');
  const [gameIdSearch, setGameIdSearch] = useState('')
  const [gameNameSearch, setGameNameSearch] = useState('')
  const [debouncedGameId] = useDebounce(gameIdSearch, 500);
  const [debouncedGameName] = useDebounce(gameNameSearch, 500);

  // useEffect(() => {
  //   setTimeZoneCode(timeZones.find(x => x.value === timezoneOffset)?.code)
  // }, [timezoneOffset])

  useEffect(() => {
    setStartDate(convertTimeZone(new Date(), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);
  const handleStartDateChange = (date) => {
    setPage(1)
    setStartDate(date);
    if (endDate && date && date.isAfter(endDate)) {
      setErrorStart('Start date cannot be greater than end date.');
    } else {
      setErrorEnd('');
      setErrorStart('');
    }
  };

  const handleEndDateChange = (date) => {
    setPage(1)
    setEndDate(date);
    if (startDate && date && date.isBefore(startDate)) {
      setErrorEnd('End date must be greater than the start date.');
    } else {
      setErrorStart('');
      setErrorEnd('');
    }
  };
  const { approveModal, redeemRequest, disable, setApproveModal, updateWithdrawData, setRedeemRequest } =
    useWithdrawTransactions();

  // const handleOpenDetails = (data) => {
  //   setOpenAccountOverview(true);
  //   setCurrentDetails(data);
  // };

  const handleApproveRequest = () => {
    updateWithdrawData({
      withdrawRequestId: redeemRequest?.withdrawRequestId.toString(),
      reason: '',
      userId: redeemRequest?.actioneeId,
      status: type,
    });
  };
  const {
    data,
    isFetching: customerLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'activityList',
      action,
      page,
      limit,
      startDate,
      endDate,
      coinType,
      transaction,
      userId,
      providerName,
      timezone ? timezone : 'GMT',
      debouncedGameId,
      debouncedGameName
    ],
    queryFn: () => {
      const params = {
        pageNo: page,
        limit,
        startDate: convertToUtc(startDate),
        endDate: convertToUtc(endDate),
        providerName: providerName,
        coinType,
        action: action,
        transaction,
        userId,
        timezone: timezone ? timezone : 'GMT',
        gameId: debouncedGameId,
        gameName: debouncedGameName
      };
      return getActivityTable(params);
    },
    enabled: accordionOpen,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  // const downloadActivityMutation = useDownloadActivityCsvMutation({
  //   onSuccess: (res) => {
  //     downloadCSVFromApiResponse(res?.data?.data);
  //   },
  // });

  // const downloadActivity = () => {
  //   const params = {
  //     pageNo: page,
  //     limit,
  //     startDate: convertToUtc(startDate),
  //     endDate: convertToUtc(endDate),
  //     providerId,
  //     coinType,
  //     activityType: activity,
  //     status,
  //     userId,
  //     csvDownload: true,
  //   };
  //   downloadActivityMutation.mutate(params);
  // };

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL
    }/api/v1/user/user-activity?csvDownload=true&limit=${limit}&pageNo=${page}&startDate=${convertToUtc(
      startDate,
    )}&endDate=${convertToUtc(
      endDate,
    )}&transaction=${transaction}&providerName=${providerName}&coinType=${coinType}&action=${action}&userId=${userId}&timezone=${timezone}&gameId=${gameIdSearch}&gameName=${gameNameSearch}`;

  const handleDownloadClick = () => {
    const _url = getCsvDownloadUrl();
    // onDownloadCsvClick(url, 'user_activity')
  };

  const { data: casinoProvidersData } = useQuery({
    queryKey: ['providersList'],
    queryFn: () => {
      const params = { pageNo: '', limit: '', orderBy: '', sort: '' };
      return getUserAllCasinoProviders(params);
    },
    enabled: accordionOpen,
    select: (res) => res?.data?.casinoProvider,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (casinoProvidersData?.rows?.length > 0) {
      const updatedProviders = casinoProvidersData.rows.map((x) => ({
        label: x.name,
        value: x.name
      }));
      setProviderNameArray([{ label: 'All', value: 'all' }, ...updatedProviders]);
      setProviderName('all');
    }
  }, [casinoProvidersData]);
  const totalPages = Math.ceil(data?.count / limit);

  const resetFilters = () => {
    setPage(1);
    setLimit(30);
    setStartDate(convertTimeZone(new Date(), timeZoneCode)),
      setEndDate(convertTimeZone(new Date(), timeZoneCode)),
      // setStatus('all');
    setProviderName('all');
    setCoinType('all');
    setAction('all');
    setTransaction('all');
    setErrorStart('');
    setErrorEnd('');
    setTimeout(() => {
      refetch();
    }, 500);
    setGameIdSearch('')
    setGameNameSearch('')
  };

  const handleShowMoreDetails = (details) => {
    if (details) {
      try {
        const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
        setMoreDetailData(parsedDetails);
      } catch (e) {
        setMoreDetailData(null);
      }
    } else {
      setMoreDetailData(null);
    }
    setShow(true);
  };

  return (
    <>
      <Row className='mt-4' onClick={() => setAccordionOpen(!accordionOpen)} style={{ cursor: 'pointer' }}>
        <h5 className='accordian-heading'>
          <span>Player Activity</span>
          <span>
            {accordionOpen ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}{' '}
          </span>
        </h5>
      </Row>

      <Accordion activeKey={accordionOpen ? '0' : ''}>
        <Accordion.Item eventKey='0'>
          <Accordion.Body>
            <>
              <ActivityTableFilters
                startDate={startDate}
                endDate={endDate}
                providerName={providerName}
                setProviderName={setProviderName}
                providerNameArray={providerNameArray}
                setProviderNameArray={setProviderNameArray}
                transaction={transaction}
                setTransaction={setTransaction}
                casinoProvidersData={casinoProvidersData}
                coinType={coinType}
                setCoinType={setCoinType}
                action={action}
                setAction={setAction}
                data={data}
                handleDownloadClick={handleDownloadClick}
                resetFilters={resetFilters}
                getCsvDownloadUrl={getCsvDownloadUrl}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                errorEnd={errorEnd}
                errorStart={errorStart}
                gameIdSearch={gameIdSearch}
                setGameIdSearch={setGameIdSearch}
                gameNameSearch={gameNameSearch}
                setGameNameSearch={setGameNameSearch}
                setPage={setPage}
              />
              <Table bordered striped responsive hover size='sm' className='text-center mt-3'>
                <thead className='thead-dark'>
                  <tr>
                    {activityTableHeader?.map((h, idx) => (
                      <th key={idx} className=''>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customerLoading ? (
                    <tr>
                      <td colSpan={10}>
                        <InlineLoader />
                      </td>
                    </tr>
                  ) : data?.count > 0 && data?.rows.length > 0 ? (
                    data?.rows?.map(
                      (
                        {
                          gameId,
                          gameName,
                          paymentProvider,
                          startTime,
                          endTime,
                          transactionType,
                          actionType,
                          amount,
                          paymentTransactionId,
                          packageId,
                          actionId,
                          afterBalance,
                          beforeBalance,
                          moreDetails,
                          scCoin,
                          gcCoin,
                          status,
                          isSuccess,
                          gc,
                          sc,
                          modelType,
                          transactionId,
                          withdrawRequestId,
                          actioneeId,
                          roundId,
                          tournamentId,
                        },
                        index,
                      ) => {
                        return (
                          <tr key={index}>
                            <td>{gameId || '-'}</td>
                            <td>{gameName || '-'}</td>
                            <td>{paymentProvider || '-'}</td>
                            <td>{getDateTime(convertToTimeZone(startTime, timezoneOffset)) || '-'}</td>
                            <td>{getDateTime(convertToTimeZone(endTime, timezoneOffset)) || '-'}</td>
                            <td className='text-capitalize'>
                              {transactionType
                                ? transactionType
                                : modelType === 'WithdrawRequest'
                                  ? 'Redeem'
                                  : actionType}{' '}
                            </td>
                            <td>{transactionId ? amount : '-'}</td>
                            <td>{gcCoin >= 0 ? gcCoin : gc >= 0 ? gc : '-'}</td>
                            <td>{scCoin >= 0 ? scCoin : sc >= 0 ? sc : '-'}</td>
                            <td>{transactionId || '-'}</td>
                            <td>{TRANSACTION_STATUS[status]}</td>
                            <td>{isSuccess == true ? 'True' : 'False'}</td>
                            <td>{paymentTransactionId || '-'}</td>
                            <td>{packageId || '-'}</td>
                            <td>{actionId == 1 ? 'Add' : 'Remove'}</td>
                            <td>{beforeBalance || '-'}</td>
                            <td>{afterBalance || '-'}</td>
                            <td>{roundId || '-'}</td>
                            <td>{tournamentId || '-'}</td>
                            <td>
                              <Button onClick={() => handleShowMoreDetails(moreDetails)}>More Details</Button>
                            </td>
                            {/* <td>
                      <Button size='sm' variant='outline-success' 
                      hidden={!(transactionType === 'deposit' || transactionType === 'redeem')} 
                      onClick={() => handleOpenDetails({ transactionType, status, amount, 
                      paymentTransactionId, createdAt, updatedAt, gcCoin, scCoin, transaction, moreDetails,
                       transactionBankingId })}>Details</Button>
                    </td> */}
                            <td>
                              {modelType === 'WithdrawRequest' ? (
                                <>
                                  {status === 0 ? (
                                    <>
                                      <Trigger message='Approve' id={transactionId + 'edit'} />
                                      <Button
                                        disabled={status !== 0 || disable}
                                        id={transactionId + 'edit'}
                                        className='m-1'
                                        size='sm'
                                        variant='success'
                                        onClick={() => {
                                          setType('approved');
                                          setApproveModal(true);
                                          setRedeemRequest({ actioneeId, withdrawRequestId, paymentProvider });
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faCheck} />
                                      </Button>
                                    </>
                                  ) : status === 1 ? (
                                    <span className='success'>Approved</span>
                                  ) : status === 2 ? (
                                    <span className='danger'>Cancelled</span>
                                  ) : (
                                    <span className='danger'>In-Process</span>
                                  )}
                                  {status === 0 && (
                                    <>
                                      <Trigger message='Cancel' id={transactionId + 'Cancel'} />
                                      <Button
                                        disabled={status !== 0 || disable}
                                        id={transactionId + 'Cancel'}
                                        className='m-1'
                                        size='sm'
                                        variant='danger'
                                        onClick={() => {
                                          setType('rejected');
                                          setApproveModal(true);
                                          setRedeemRequest({ actioneeId, withdrawRequestId, paymentProvider });
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faTimesSquare} />
                                      </Button>
                                    </>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </td>

                            {/* <td>{JSON.parse(moreDetails)}</td> */}
                          </tr>
                        );
                      },
                    )
                  ) : (
                    <tr>
                      <td colSpan={19} className='text-danger text-center'>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* {loading && <InlineLoader />} */}
              {data?.count > 0 && data?.rows.length > 0 && (
                <PaginationComponent
                  page={page}
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
            </>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <MoreDetail show={show} setShow={setShow} moreDetailData={moreDetailData} />
    </>
  );
};

export default ActivityTable;
