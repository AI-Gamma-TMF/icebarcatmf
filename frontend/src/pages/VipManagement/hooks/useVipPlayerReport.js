import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVipPlayerReport } from '../../../utils/apiCalls';
import { formatDateYMD, getDateDaysAgo } from '../../../utils/dateFormatter';
import { getItem } from '../../../utils/storageUtils';
import { convertTimeZone } from '../../../utils/helper';
import { useUserStore } from '../../../store/store';
import { useState } from 'react';

const useVipPlayerReport = () => {
  const { userId } = useParams();

  const timezone = getItem('timezone');
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(getDateDaysAgo(7));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));

  const { data: vipPlayerReport, isLoading: vipPlayerReportLoading } = useQuery({
    queryKey: ['vipPlayerReport', formatDateYMD(startDate), formatDateYMD(endDate), timezone, userId],
    queryFn: ({ queryKey }) => {
      let params = {};
      if (queryKey[1] && queryKey[2] && queryKey[3] && queryKey[4]) {
        params = { startDate: queryKey[1], endDate: queryKey[2], timezone, userId };
      }
      return getVipPlayerReport(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  return {
    vipPlayerReport,
    vipPlayerReportLoading,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    userId,
    timeZoneCode,
  };
};

export default useVipPlayerReport;
