import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { useUserStore } from '../../store/store';
import {
  getAllCasinoProviders,
  getCasinoAggregators,
  getGameDashboard,
  getGameDashboardSummary,
  getGamesIdsRequest,
} from '../../utils/apiCalls';
import { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from '../../utils/dateFormatter';
import { convertToUtc } from '../../utils/helper';

const useGameDashboardList = () => {
  const [orderBy, setOrderBy] = useState('totalUniquePlayers');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [gameId, setGameId] = useState('');
  const [aggregatorId, setAggregatorId] = useState('');
  const [providerId, setProviderId] = useState('');
  const [sort, setSort] = useState('DESC');
  const [over, setOver] = useState(false);
  const [gameNameOptions, setGameNameOptions] = useState([]);
  const [providerNameOptions, setProviderNameOptions] = useState([]);
  const [aggregatorNameOptions, setAggregatoNameOptions] = useState([]);
  const [rtpValue, setRtpValue] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(moment(getFirstDayOfCurrentMonth()));
  const [endDate, setEndDate] = useState(moment(getLastDayOfCurrentMonth()));
  const [debouncedRTPValue] = useDebounce(rtpValue, 500);

  const { data: gameDashboardList, isLoading } = useQuery({
    queryKey: [
      'gameDashboardList',
      limit,
      page,
      orderBy,
      sort,
      aggregatorId,
      providerId,
      gameId,
      convertToUtc(startDate),
      convertToUtc(endDate),
      timeZoneCode,
      selectedOperator,
      debouncedRTPValue,
    ],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.limit = queryKey[1];
      if (queryKey[2]) params.pageNo = queryKey[2];
      if (queryKey[3]) params.orderBy = queryKey[3];
      if (queryKey[4]) params.sort = queryKey[4];
      if (queryKey[5]) params.masterGameAggregatorId = queryKey[5] ?? '';
      if (queryKey[6]) params.masterCasinoProviderId = queryKey[6] ?? '';
      if (queryKey[7]) params.idSearch = queryKey[7] ?? '';
      if (queryKey[8]) params.startDate = queryKey[8];
      if (queryKey[9]) params.endDate = queryKey[9];
      if (queryKey[8] && queryKey[9] && queryKey[10]) params.timezone = queryKey[10];
      if (queryKey[11] && queryKey[12]) {
        if (queryKey[11] === '=') {
          params.RTP = queryKey[12];
        } else if (queryKey[11] === '<=') {
          params.RTPle = queryKey[12];
        } else if (queryKey[11] === '>=') {
          params.RTPge = queryKey[12];
        }
      }

      return getGameDashboard(params);
    },
    select: (res) => res?.data?.data,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !(selectedOperator && !rtpValue),
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(gameDashboardList?.games?.count / limit);

  const selected = (h) => orderBy === h.value;

  const { data: gameDashboardSummary, isLoading: gameDashboardLoading } = useQuery({
    queryKey: ['gameDashboardSummary'],
    queryFn: () => {
      return getGameDashboardSummary();
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: gameDashboardGames, isLoading: gameListLoading } = useQuery({
    queryKey: ['gameDashboardGames'],
    queryFn: () => {
      return getGamesIdsRequest();
    },
    select: (res) => res?.data?.games,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data?.length) {
        const temp = [];
        data?.map((game) => {
          temp.push({
            label: game?.name,
            value: game?.masterCasinoGameId,
          });
        });
        setGameNameOptions(temp);
      }
    },
  });

  const { data: gameDashboardProvider, isLoading: providerListLoading } = useQuery({
    queryKey: ['gameDashboardProvider'],
    queryFn: () => {
      return getAllCasinoProviders();
    },
    select: (res) => res?.data?.casinoProvider,

    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      if (data?.rows && data?.rows?.length) {
        const temp = [];
        data?.rows?.map((provider) => {
          temp.push({
            label: provider?.name,
            value: provider?.masterCasinoProviderId,
          });
        });
        setProviderNameOptions(temp);
      }
    },
  });

  const { data: gameDashboardAggregator, isLoading: aggregatorLoading } = useQuery({
    queryKey: ['gameDashboardAggregator'],
    queryFn: () => {
      return getCasinoAggregators();
    },
    select: (res) => res?.data?.casinoAggregator,

    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      if (data?.rows && data?.rows?.length) {
        const temp = [];
        data?.rows?.map((aggregator) => {
          temp.push({
            label: aggregator?.name,
            value: aggregator?.masterGameAggregatorId,
          });
        });
        setAggregatoNameOptions(temp);
      }
    },
  });

  const getCsvDownloadUrl = () => {
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/v1/casino/game-dashboard/game-infos`;
    const params = new URLSearchParams({
      csvDownload: 'true',
      limit,
      pageNo: page,
      orderBy,
      sort,
      masterGameAggregatorId: aggregatorId,
      masterCasinoProviderId: providerId,
      idSearch: gameId,
      startDate: convertToUtc(startDate),
      endDate: convertToUtc(endDate),
      timezone: timeZoneCode,
    });

    if (selectedOperator && debouncedRTPValue) {
      if (selectedOperator === '=') {
        params.append('RTP', debouncedRTPValue);
      } else if (selectedOperator === '<=') {
        params.append('RTPle', debouncedRTPValue);
      } else if (selectedOperator === '>=') {
        params.append('RTPge', debouncedRTPValue);
      }
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    gameDashboardList,
    isLoading,
    setPage,
    page,
    limit,
    setLimit,
    totalPages,
    sort,
    setSort,
    orderBy,
    setOrderBy,
    gameDashboardGames,
    gameListLoading,
    gameDashboardProvider,
    providerListLoading,
    gameDashboardAggregator,
    aggregatorLoading,
    gameId,
    setGameId,
    aggregatorId,
    setAggregatorId,
    providerId,
    setProviderId,
    gameDashboardSummary,
    gameDashboardLoading,
    over,
    setOver,
    selected,
    gameNameOptions,
    providerNameOptions,
    aggregatorNameOptions,
    getCsvDownloadUrl,
    rtpValue,
    setRtpValue,
    selectedOperator,
    setSelectedOperator,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  };
};

export default useGameDashboardList;
