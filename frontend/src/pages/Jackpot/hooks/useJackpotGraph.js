import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { useUserStore } from "../../../store/store";
import { getJackpotGraphData } from "../../../utils/apiCalls";
import { getDateDaysAgo } from "../../../utils/dateFormatter";
import { convertTimeZone, utcFormat } from "../../../utils/helper";
import { getItem } from "../../../utils/storageUtils";
import { getDateRange } from "../../Reports/BonusReport/BonusUtils";
import { intervalMap } from "../../Reports/BonusReport/constant";

const useJackpotGraph = () => {
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(
    convertTimeZone(getDateDaysAgo(1), timeZoneCode)
  );
  const [endDate, setEndDate] = useState(
    convertTimeZone(new Date(), timeZoneCode)
  );
  const [intervalTime, setIntervalTime] = useState({
    label: "Auto",
    value: "auto",
  });
  const [jackpotMetrics, setJackpotMetrics] = useState([{ label: "All", value: "all" }]);
  const [refreshInterval, setRefreshInterval] = useState("off");
  const [progress, setProgress] = useState(100);
  const [countdownKey, setCountdownKey] = useState(0);
  const [selectedRange, setSelectedRange] = useState("1d");
    const [dateError, setDateError] = useState("");

  const intervalRef = useRef();

  useEffect(() => {
    setStartDate(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);

  const currentTimeZone = getItem("timezone");
  const {
    data: jackpotData,
    isLoading: jackpotGraphDataLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "jackpotData",
      utcFormat(startDate),
      utcFormat(endDate),
      currentTimeZone,
      intervalTime?.value || "auto",
    ],
    queryFn: ({ queryKey }) => {
      const [_, start, end, timezone, intv] = queryKey;
      const range =
        selectedRange !== "Custom"
          ? getDateRange(selectedRange)
          : { startDate, endDate };

      const params = {
        startDate: utcFormat(range.startDate),
        endDate: utcFormat(range.endDate),
        timeInterval: intv,
      };
      return getJackpotGraphData(params);
    },
    enabled: !!startDate && !!endDate ,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    retry:false,
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
       setJackpotMetrics([{ label: "All", value: "all" }]);
       setSelectedRange('1d')
       setRefreshInterval('off')
     };

     return {
        jackpotData,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        intervalTime,
        setIntervalTime,
        jackpotMetrics,
        setJackpotMetrics,
        jackpotGraphDataLoading,
        resetFilters,
        refreshInterval,
        setRefreshInterval,
        progress,
        countdownKey,
        selectedRange,
        setSelectedRange,
        dateError, setDateError
     }
};

export default useJackpotGraph;
