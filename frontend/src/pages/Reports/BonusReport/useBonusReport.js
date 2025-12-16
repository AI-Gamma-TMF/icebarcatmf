import { useEffect, useState } from 'react'
import { getItem } from '../../../utils/storageUtils'
import { useQuery } from '@tanstack/react-query'
import { getBonusReport } from '../../../utils/apiCalls'
import { convertTimeZone, convertToUtc } from '../../../utils/helper'
import { getDateDaysAgo } from '../../../utils/dateFormatter'
import { useUserStore } from '../../../store/store'

const useBonusReport = () => {
  const timezone = getItem("timezone");
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));

  useEffect(() => {
    setStartDate(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);

  const {
    data: bonusReportData,
    isLoading: loading,
    refetch: bonusRefetch,
  } = useQuery({
    queryKey: ['bonusReport', convertToUtc(startDate), convertToUtc(endDate)],
    queryFn: ({ queryKey }) => {
      const params = { timezone };
      if (queryKey[1]) params.startDate = queryKey[1];
      if (queryKey[2]) params.endDate = queryKey[2];
      return getBonusReport(params);
    },
    enabled: false,
    select: (res) => res?.data,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return {
    bonusReportData,
    loading,
    bonusRefetch,
  };
};

export default useBonusReport;
