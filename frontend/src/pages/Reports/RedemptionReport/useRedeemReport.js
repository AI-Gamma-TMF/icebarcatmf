import { useState, useEffect } from "react";
import { getItem } from "../../../utils/storageUtils";
import { useQuery } from "@tanstack/react-query";
import { getRedeemReport } from "../../../utils/apiCalls";
import { useDebounce } from "use-debounce";
import { convertTimeZone, convertToUtc, onDownloadCsvClick } from "../../../utils/helper";
import { useUserStore } from "../../../store/store";
import { formattedDate, getDateDaysAgo } from "../../../utils/dateFormatter";

const useRedeemReport = () => {
  const timezone = getItem("timezone");
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [limit, setLimit] = useState(15);
  const [pageNo, setPageNo] = useState(1);
  const [jackpotMetrics, setJackpotMetrics] = useState([
    { label: "All", value: "all" },
  ]);
  const [dateError, setDateError] = useState("");
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);

  const [startDate, setStartDate] = useState(() =>
    convertTimeZone(getDateDaysAgo(7), timeZoneCode)
  );
  const [endDate, setEndDate] = useState(() =>
    convertTimeZone(new Date(), timeZoneCode)
  );
  
  useEffect(() => {
    setStartDate(convertTimeZone(getDateDaysAgo(7), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);

  const {
    data: redeemReportData,
    isLoading: loading,
    refetch: redeemRefetch,
  } = useQuery({
    queryKey: [
      "redemptionReport",
      limit,
      pageNo,
      convertToUtc(startDate),
      convertToUtc(endDate),
    ],
    queryFn: ({ queryKey }) => {
      const params = {
      
      };
      if (queryKey[3]) params.startDate = queryKey[3];
      if (queryKey[4]) params.endDate = queryKey[4];

      return getRedeemReport(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });
    

  const totalPages = Math.ceil(redeemReportData?.count / limit);
  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/v1/report/redemption-rate-report?csvDownload=true&limit=${limit}&pageNo=${pageNo}&startDate=${convertToUtc(startDate)}&endDate=${convertToUtc(endDate)}`
  const handleDownloadClick = async () => {
      try {
        let filename = "redemption_report";
        const formattedStartDate = formattedDate(startDate);
        const formattedEndDate = formattedDate(endDate);
        filename += `_${formattedStartDate}_${formattedEndDate}`;
        setDownloadInProgress(true);
        const url = getCsvDownloadUrl();
        await onDownloadCsvClick(url, filename);
      } catch (error) {
        console.error("Error downloading CSV:", error);
      } finally {
        setDownloadInProgress(false);
      }
    };

  return {
    setLimit,
    setPageNo,
    totalPages,
    limit,
    pageNo,

    loading,
    handleDownloadClick,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    redeemReportData,
    loading,
    redeemRefetch,
    jackpotMetrics,
    setJackpotMetrics,
    dateError,
    setDateError,
    downloadInProgress, setDownloadInProgress
  };
};

export default useRedeemReport;
