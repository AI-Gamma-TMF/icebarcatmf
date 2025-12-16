import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDateDaysAgo } from '../../../utils/dateFormatter';
import { getItem } from '../../../utils/storageUtils';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAmoeData } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce';
// import { timeZones } from '../../Dashboard/constants';
// import { timeZones } from '../../Dashboard/constants';
import {
  appendCurrentTime,
  convertTimeZone,
  convertToUtc,
  // getFormattedTimeZoneOffset,
  // getFormattedTimeZoneOffset,
} from '../../../utils/helper';
import moment from 'moment';
import { useUserStore } from '../../../store/store';
const useAmoeList = ({ isUTC }) => {
  const navigate = useNavigate();

  const { t } = useTranslation('players');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('1')
  const [debouncedStatus] = useDebounce(status,500)
  const [entryId, setEntryId] = useState('')
  const [debouncedEntryID] = useDebounce(entryId,500)
  const [debouncedSearch] = useDebounce(search, 500);
  const [scannedDate, setScannedDate] = useState(null);
  const timeZone = getItem("timezone");
  const queryClient = useQueryClient();

  const timeZoneCode = useUserStore((state) => state.timeZoneCode)

  const [startDate, setStartDate] = useState(convertTimeZone(getDateDaysAgo(10), timeZoneCode));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));

  useEffect(() => {
    setStartDate(convertTimeZone(getDateDaysAgo(10), timeZoneCode))
    setEndDate(convertTimeZone(new Date(), timeZoneCode))
  }, [timeZoneCode])

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // Reset filters
  const resetFilters = () => {
    setSearch('')
    setStatus('1')
    setEntryId('')
    setLimit(15);
    setPage(1);
    setStartDate(convertTimeZone(getDateDaysAgo(10), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
    setScannedDate(null);
  };

  const {
    data: AmoeData = [],
    isLoading: loading,
    refetch: AmoeRefetch,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'AmoeList',
      limit,
      page,
      debouncedSearch,
      convertToUtc(startDate), convertToUtc(endDate), convertToUtc(scannedDate),
      timeZone ? timeZone : 'GMT',debouncedStatus,debouncedEntryID
    ],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      };
      if (queryKey[3]) params.email = queryKey[3];
      if (queryKey[4]) params.startDate = queryKey[4];
      if (queryKey[5]) params.endDate = queryKey[5];
      if (queryKey[6]) params.scannedDate = queryKey[6];
      if (queryKey[7]) params.timezone = queryKey[7];
      if (queryKey[8]) params.status = queryKey[8];
      if (queryKey[9]) params.entryId = queryKey[9];
      // Set up date handling

      let formattedStartDate = startDate;
      let formattedEndDate = endDate;

      if (isUTC) {
        formattedStartDate = convertToUtc(appendCurrentTime(startDate));
        formattedEndDate = convertToUtc(appendCurrentTime(endDate));
      }

      // Adjust end date if start and end dates are the same
      if (formattedStartDate === formattedEndDate) {
        params.startDate = formatDate(formattedStartDate); // Format start date
        params.endDate = formatDate(new Date(formattedEndDate).setDate(new Date(formattedEndDate).getDate() + 1)); // Format end date
      } else {
        params.startDate = formatDate(formattedStartDate);
        params.endDate = formatDate(formattedEndDate);
      }

      return getAmoeData(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onError: (error) => {
      console.error('Error fetching Amoe data:', error);
    },
  });

  const totalPages = Math.ceil(AmoeData?.amoeBonusHistory?.count / limit);

  return {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    t,
    AmoeData,
    loading,
    startDate,
    setStartDate: (date) => setStartDate(moment(date).format('YYYY-MM-DD')),
    endDate,
    setEndDate: (date) => setEndDate(moment(date).format('YYYY-MM-DD')),
    search,
    setSearch,
    AmoeRefetch,
    scannedDate,
    setScannedDate: (date) => setScannedDate(formatDate(date)),
    resetFilters,
    isError,
    error,
    navigate,status, setStatus,entryId, setEntryId,
    queryClient
  };
};

export default useAmoeList;
