import { useQuery } from '@tanstack/react-query'
import moment from 'moment';
import { getAmoeDashboardData } from '../../../utils/apiCalls'
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getItem } from '../../../utils/storageUtils';
import { appendCurrentTime, convertTimeZone, convertToUtc } from '../../../utils/helper';
import { getDateDaysAgo } from '../../../utils/dateFormatter';
import { useUserStore } from '../../../store/store';

const useAmoeDashboard = ({ isUTC }) => {
  const { t } = useTranslation('players');

  const timeZone = getItem("timezone");
  // const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()
  // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x => x.value === timezoneOffset)?.code);
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

  // useEffect(() => {
  //   setTimeZoneCode(timeZones.find((x) => x.value === timezoneOffset)?.code);
  // }, [timezoneOffset]);



  const { data: amoeDashboardData, refetch, isLoading: isLoadingAmoeData } = useQuery({
    queryKey: [`amoeDashboard`,
      convertToUtc(startDate),
      convertToUtc(endDate),
      timeZone ? timeZone : 'GMT',],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.startDate = queryKey[1];
      if (queryKey[2]) params.endDate = queryKey[2];
      if (queryKey[3]) params.timezone = queryKey[3];

      let formattedStartDate = startDate;
      let formattedEndDate = endDate;

      if (isUTC) {
        formattedStartDate = convertToUtc(appendCurrentTime(startDate));
        formattedEndDate = convertToUtc(appendCurrentTime(endDate));
      }

      if (formattedStartDate === formattedEndDate) {
        params.startDate = formatDate(formattedStartDate); // Format start date
        params.endDate = formatDate(new Date(formattedEndDate).setDate(new Date(formattedEndDate).getDate() + 1)); // Format end date
      } else {
        params.startDate = formatDate(formattedStartDate);
        params.endDate = formatDate(formattedEndDate);
      }

      if (formattedStartDate === formattedEndDate) {
        params.startDate = formatDate(formattedStartDate); // Format start date
        params.endDate = formatDate(new Date(formattedEndDate).setDate(new Date(formattedEndDate).getDate() + 1)); // Format end date
      } else {
        params.startDate = formatDate(formattedStartDate);
        params.endDate = formatDate(formattedEndDate);
      }

      return getAmoeDashboardData(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  })

  return {
    t,
    amoeDashboardData,
    refetch,
    isLoadingAmoeData,
    startDate,
    setStartDate: (date) => setStartDate(moment(date).format('YYYY-MM-DD')),
    endDate,
    setEndDate: (date) => setEndDate(moment(date).format('YYYY-MM-DD')),
  }
}

export default useAmoeDashboard
