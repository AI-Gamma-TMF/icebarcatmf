
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItem } from '../../../utils/storageUtils';
import { useUserStore } from '../../../store/store';
import { convertTimeZone, convertToUtc, utcFormat } from '../../../utils/helper';
import { getScratchCardDropdown, getScratchCardGraph, getScratchCardUserDetails } from '../../../utils/apiCalls';
import { getDateDaysAgo } from '../../../utils/dateFormatter';
import { bonusMetricOptions, intervalMap } from './constant';
import { getDateRange } from './ScratchCardUtils';

const useScratchCardGraph = () => {
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
  const [userStartDate, setUserStartDate] = useState(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));
  const [userEndDate, setUserEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));
  const [intervalTime, setIntervalTime] = useState({ label: "Auto", value: "auto" });
  const [scratchCardId, setScratchCardId] = useState([{ label: "All", value: "all" }]);
  const [userScratchCardId, setUserScratchCardId] = useState([{ label: "All", value: "all" }]);
  const [selectedMetric, setSelectedMetric] = useState(bonusMetricOptions[0]);
  const [refreshInterval, setRefreshInterval] = useState("off");
  const [progress, setProgress] = useState(100);
  const [countdownKey, setCountdownKey] = useState(0);
  const [selectedRange, setSelectedRange] = useState("1d");
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [error, setError] = useState('');
  const [errorStart, setErrorStart] = useState('');
  const [errorEnd, setErrorEnd] = useState('');
  const intervalRef = useRef()

  useEffect(() => {
    setStartDate(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);

  useEffect(() => {
    if(scratchCardId.length === 0) {
      setScratchCardId([{ label: "All", value: "all" }]);
    }
    setDebouncedSearch(search);
  }, [scratchCardId, search]);
  
  const currentTimeZone = getItem("timezone");
  const { data: rawScratchCardDropdownList, isLoading: isLoading } = useQuery({
    queryKey: ['scratchCardDropdownList'],
    queryFn: ({ queryKey }) => {
      return getScratchCardDropdown()
    },
    select: (res) => res?.data?.scratchCards,
    refetchOnWindowFocus: false,
  })
  const scratchCardDropdownList = [
    { label: "All", value: "all" },
    ...(rawScratchCardDropdownList?.map(item => ({
      value: item.scratchCardId,
      label: item.scratchCardName
    })) || [])
  ];

  const {
    data: scratchCardGraphData,
    isLoading: scratchCardGraphDataLoading,
    refetch
  } = useQuery({
    queryKey: [
      'ScratchCard-Graph',
      utcFormat(startDate),
      utcFormat(endDate),
      currentTimeZone,
      intervalTime?.value || "auto",
      scratchCardId.length === 0
        ? null
        : scratchCardId.some(b => b.value === 'all')
          ? "all"
          : scratchCardId.map(b => b.value).join(",")
    ],
    queryFn: async ({ queryKey }) => {
      const [_, start, end, timezone, intv, bonusTypeStr] = queryKey;

      const range = selectedRange !== "Custom"
        ? getDateRange(selectedRange)
        : { startDate, endDate };

      const params = {
        startDate: utcFormat(range.startDate),
        endDate: utcFormat(range.endDate),
        timezone,
        timeInterval: intv,
      };


      if (bonusTypeStr && bonusTypeStr !== "all") {
        params.scratchCardId = bonusTypeStr.split(",");
      } else if (bonusTypeStr === "all") {
        params.scratchCardId = ["all"];
      }

      return getScratchCardGraph(params);
    },
    enabled: !!startDate && !!endDate && scratchCardId.length > 0,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  });

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setProgress(100);
    setCountdownKey(prev => prev + 1);

    if (refreshInterval !== "off") {

      const intervalTime = intervalMap[refreshInterval];
      if (!intervalTime) return;

      let remaining = intervalTime;
      const tick = 100;

      intervalRef.current = setInterval(() => {
        remaining -= tick;
        setProgress((remaining / intervalTime) * 100);

        if (remaining <= 0) {
          refetch();
          remaining = intervalTime;
          setCountdownKey(prev => prev + 1);
          setProgress(100);
        }
      }, tick);
    }

    return () => clearInterval(intervalRef.current);
  }, [refreshInterval]);

  const resetFilters = () => {
    setStartDate(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
    setIntervalTime({ label: "Auto", value: "auto" });
    setScratchCardId([{ label: "All", value: "all" }]);
    setSelectedMetric(bonusMetricOptions[0]);
    setSelectedRange('1d')
    setDebouncedSearch(search);
    setRefreshInterval('off')
  };
  const { data: userDetail, isLoading: loadingUserDetail } = useQuery({
    queryKey: ['scratchCardUserList', limit, page, convertToUtc(userStartDate),
      convertToUtc(userEndDate), userId, debouncedSearch,
      userScratchCardId.length === 0
        ? null
        : userScratchCardId.some(b => b.value === 'all')
          ? "all"
          : userScratchCardId.map(b => b.value).join(",")],
    queryFn: ({ queryKey }) => {
      const params = { limit: queryKey[1], pageNo: queryKey[2], timezone: timeZoneCode };
      if (queryKey[3]) params.startDate = queryKey[3]
      if (queryKey[4]) params.endDate = queryKey[4]
      if (queryKey[5]) params.idSearch = queryKey[5]
      if (queryKey[6]) params.search = queryKey[6]
      if (queryKey[7] && queryKey[7] !== "all") {
        params.scratchCardId = queryKey[7].split(",");
      } else if (queryKey[7] === "all") {
        params.scratchCardId = ["all"];
      }
      return getScratchCardUserDetails(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(userDetail?.count / limit);
  const handleChange = (event) => {
    const value = event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
    setSearch(value)
    setPage(1)

    // Validate email
    if (value && !validateEmail(value)) {
      setError('Please enter a valid email address.')
    } else {
      setError('')
    }
  }
  const handleStartDateChange = (date) => {
    setUserStartDate(date)
    if (endDate && date && date.isAfter(endDate)) {
      setErrorStart('Start date cannot be greater than end date.')
    } else {
      setErrorEnd('')
      setErrorStart('')
    }
  }

  const handleEndDateChange = (date) => {
    setUserEndDate(date)
    if (startDate && date && date.isBefore(startDate)) {
      setErrorEnd('End date must be greater than the start date.')
    } else {
      setErrorStart('')
      setErrorEnd('')
    }
  }
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  return {
    scratchCardGraphData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    intervalTime,
    setIntervalTime,
    scratchCardId,
    setScratchCardId,
    userScratchCardId,
    setUserScratchCardId,
    scratchCardGraphDataLoading,
    resetFilters,
    selectedMetric,
    setSelectedMetric,
    refreshInterval,
    setRefreshInterval,
    progress,
    countdownKey,
    selectedRange,
    setSelectedRange, scratchCardDropdownList,
    userDetail,
    loadingUserDetail,
    limit,
    setLimit,
    page,
    setPage,
    userId,
    setUserId,
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    error,
    setError,
    errorStart,
    setErrorStart,
    errorEnd,totalPages,
    setErrorEnd, handleChange, handleStartDateChange, handleEndDateChange,
    userStartDate, setUserStartDate,userEndDate, setUserEndDate
  };
};

export default useScratchCardGraph;
