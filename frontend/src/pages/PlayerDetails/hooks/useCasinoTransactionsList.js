import { useEffect, useState } from 'react';
import { getItem } from '../../../utils/storageUtils';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getAllTransactions } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce';
// import { timeZones } from '../../Dashboard/constants';
import {
  convertTimeZone,
  convertToUtc,
  getFormattedTimeZoneOffset,
  utcFormat,
} from '../../../utils/helper';
import { useGetGamesPaymentQuery } from '../../../reactQuery/hooks/customQueryHook';
import { useUserStore } from '../../../store/store';

const useCasinoTransactionsList = () => {
  const { userId } = useParams();
  // const timezone = getItem('timezone');
  const { t } = useTranslation('players');
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [gameId, setGameId] = useState('');
  const [gameName, setGameName] = useState('');
  const [search, setSearch] = useState('');
  const [searchCasinoId, setSearchCasinoId] = useState('');
  const [scCoin, setScCoin] = useState('');
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [searchUserName, setSearchUserName] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedSearchCasinoId] = useDebounce(searchCasinoId, 500);
  const [debouncedSearchTransactionId] = useDebounce(searchTransactionId, 500);
  const [debounceSearchSccoin] = useDebounce(scCoin, 500);
  const [debounceSearchGameId] = useDebounce(gameId, 500);
  const [debounceSearchUserName] = useDebounce(searchUserName, 500);
  const [debounceSearchUserId] = useDebounce(searchUserId, 500);
  const [orderBy, setOrderBy] = useState('casinoTransactionId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");
  const timeZone = getItem('timezone');
  // const timezoneOffset =
  //   timeZone != null
  //     ? timeZones.find((x) => x.code === timeZone).value
  //     : getFormattedTimeZoneOffset();
  // const [timeZoneCode, setTimeZoneCode] = useState(
  //   timeZones.find((x) => x.value === timezoneOffset)?.code
  // );
  const timeZoneCode = useUserStore((state) => state.timeZoneCode)
   const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - 15 * 60 * 1000); // 10 minutes ago
  });
  const [endDate, setEndDate] = useState(new Date());
  const [gameIdsOptions, setGamesIdsOptions] = useState([]);
  const [enabled, _setEnabled] = useState(false);
  const [isSelectLoading, _setIsSetLoading] = useState(false);


  useEffect(() => {
    if (gameId !== undefined) {
      setGameName('');
    }
  }, [gameId]);
  useEffect(() => {
    if (gameName !== undefined) {
      setGameId('');
    }
  }, [gameName]);
  // useEffect(() => {
  //   setTimeZoneCode(timeZones.find((x) => x.value === timezoneOffset)?.code);
  // }, [timezoneOffset]);

  // useEffect(() => {
  //   setStartDate(convertTimeZone(new Date(), timeZoneCode));
  //   setEndDate(convertTimeZone(new Date(), timeZoneCode));
  // }, [timeZoneCode]);

  const successToggler = (data) => {
    if (data?.length) {
      const tempData = [];
      data?.map((item) => {
        tempData.push({
          label: item.name,
          value: item.masterCasinoGameId,
        });
      });
      setGamesIdsOptions(tempData);
    }
  };
  const { refetch: fetchData } = useGetGamesPaymentQuery({
    params: {},
    enabled,
    successToggler,
  });
  useEffect(() => {
    fetchData();
  }, []);
  const { data: transactionData, isLoading: loading } = useQuery({
    queryKey: [
      'transactionList',
      limit,
      page,
      userId,
      selectedCurrency,
      status,
      selectedAction,
      utcFormat(startDate),
      utcFormat(endDate),
      debouncedSearch,
      Number(debouncedSearchCasinoId),
      debouncedSearchTransactionId,
      timeZone ?? 'GMT',
      debounceSearchGameId,
      debounceSearchSccoin,
      gameName,
      debounceSearchUserName,
      debounceSearchUserId,
      orderBy,
      sort
    ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.userId = queryKey[3];
      if (queryKey[4]) params.amountType = queryKey[4];
      if (queryKey[5]) params.status = queryKey[5];
      if (queryKey[6]) params.transactionType = queryKey[6];
      if (queryKey[7]) params.startDate = queryKey[7];
      if (queryKey[8]) params.endDate = queryKey[8];
      if (queryKey[9]) params.email = queryKey[9];
      if (queryKey[10]) params.casinoTransactionId = queryKey[10];
      if (queryKey[11]) params.externalTransactionId = queryKey[11];
      if (queryKey[12]) params.timezone = queryKey[12];
      if (queryKey[13] || queryKey[15])
        params.gameId = queryKey[13] || (queryKey[15]?.value ?? '');

      if (queryKey[14]) params.sweepCoinUsed = queryKey[14];
      if (queryKey[16]) params.userName = queryKey[16]
      if (queryKey[17]) params.userId = queryKey[17]
      if(queryKey[18]) params.orderBy = queryKey[18]
      if(queryKey[19]) params.sort = queryKey[19]
      return getAllTransactions(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.transactionDetail,
  });

  const totalPages = Math.ceil(transactionData?.count / limit);

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL
    }/api/v1/payment/casino-transactions?csvDownload=true&limit=${limit}&pageNo=${page}&startDate=${utcFormat(
      startDate
    )}&endDate=${utcFormat(
      endDate
    )}&transactionType=${selectedAction}&status=${status}&timezone=${timeZone}&email=${search}
    &amountType=${selectedCurrency}&casinoTransactionId=${searchCasinoId}
    &externalTransactionId=${searchTransactionId}&sweepCoinUsed=${scCoin}&userName=${searchUserName}&userId=${searchUserId}
    &gameId=${gameId || (gameName?.value ?? '')
    }`;

    const selected = (h) => orderBy === h.value && h.labelKey !== "Actions";
  const handleReset = () => {
    const now = new Date();
    setSearch("");
    setSelectedAction("all");
    setSelectedCurrency("all");
    setSearchCasinoId("");
    setSearchTransactionId("");
    setLimit(15);
    setPage(1);
    setStartDate(new Date(now.getTime() - 15 * 60 * 1000)),
    setEndDate(new Date()),
    setGameId(""),
    setScCoin(""),
    setGameName(""),
    setErrorStart(""),
    setErrorEnd(""),
    setStatus("all"),
    setSearchUserId('')
  }

  return {
    setSelectedCurrency,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedCurrency,
    selectedAction,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    t,
    transactionData,
    loading,
    status,
    setStatus,
    gameId,
    setGameId,
    getCsvDownloadUrl,
    search,
    setSearch,
    setSearchCasinoId,
    setSearchTransactionId,
    searchCasinoId,
    searchTransactionId,
    scCoin,
    setScCoin,
    gameName,
    setGameName,
    setGamesIdsOptions,
    gameIdsOptions, isSelectLoading, timeZoneCode,
    setSearchUserName, setSearchUserId, searchUserName,searchUserId,
    orderBy,
    setOrderBy, sort, setSort, over, setOver, selected,handleReset,
    errorEnd, setErrorEnd,errorStart, setErrorStart
  }
}

export default useCasinoTransactionsList;
