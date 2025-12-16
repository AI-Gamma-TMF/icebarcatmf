import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserDailyReport } from "../../../utils/apiCalls";
import { convertTimeZone, convertToUtc } from "../../../utils/helper";
import { useUserStore } from "../../../store/store";
import { getDateDaysAgo } from "../../../utils/dateFormatter";

const useUserDailyReport = () => {
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)

  const [dateField, setDateField] = useState({
    startDate: convertTimeZone(getDateDaysAgo(7), timeZoneCode),
   endDate : convertTimeZone(new Date(), timeZoneCode)
  });
  const [dateError, setDateError] = useState({
    startDateError: "",
    endDateError:""
  });
 
  useEffect(() => {
    setDateField({
      startDate: convertTimeZone(getDateDaysAgo(7), timeZoneCode),
    endDate:convertTimeZone(new Date(), timeZoneCode)
    });
  }, [timeZoneCode]);

  const { data: userDailyReport, isLoading } = useQuery({
    queryKey: [
      "UserDailyReport",
      convertToUtc(dateField?.startDate),
      convertToUtc(dateField.endDate),
      limit,
      page
    ],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.startDate = queryKey[1];
      if(queryKey[2]) params.endDate = queryKey[2]
      if(queryKey[3]) params.limit = queryKey[3]
      if(queryKey[4]) params.pageNo = queryKey[4]
      return getUserDailyReport(params);
    },
    select: (data) => data?.data?.data,
    retry: false,
    refetchOnWindowFocus: false,
    // enabled: !dateError.startDateError && ! dateError.endDateError
  });

  const totalPages = Math.ceil(userDailyReport?.count/limit)


  const getCsvDownloadUrl = () => {
    const baseUrl = `${process.env.REACT_APP_API_URL}/api/v1/report/merv-report`;
    const params = new URLSearchParams({
      csvDownload: 'true',
      limit,
      pageNo: page,
      startDate:convertToUtc(dateField?.startDate),
      endDate:convertToUtc(dateField?.endDate),
      // timezone: timeZoneCode,
    });
   
    return `${baseUrl}?${params.toString()}`;
  };


  return {
    userDailyReport,
    isLoading,
    dateField,
    setDateField,
    dateError,
    setDateError,
    getCsvDownloadUrl,
    timeZoneCode,
    page, setPage,
    limit, setLimit,
    totalPages,
  };
};

export default useUserDailyReport;
