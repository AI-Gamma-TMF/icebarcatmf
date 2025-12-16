import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItem } from '../../../utils/storageUtils';
import { useUserStore } from '../../../store/store';
import {  convertTimeZone, utcFormat } from '../../../utils/helper';
import { getBonusGraphData } from '../../../utils/apiCalls';
import { getDateDaysAgo } from '../../../utils/dateFormatter';
import { bonusMetricOptions, intervalMap } from './constant';
import { getDateRange } from './BonusUtils';

const useBonusGraph = () => {
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [startDate, setStartDate] = useState(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));
  const [intervalTime, setIntervalTime] = useState({ label: "Auto", value: "auto" });
  const [bonusType, setBonusType] = useState([{ label: "All", value: "all" }]);
  const [selectedMetric, setSelectedMetric] = useState(bonusMetricOptions[0]);
  const [refreshInterval, setRefreshInterval] = useState("off");
  const [progress, setProgress] = useState(100);
  const [countdownKey, setCountdownKey] = useState(0);
  const [selectedRange, setSelectedRange] = useState("1d");

  const intervalRef = useRef()

  useEffect(() => {
    setStartDate(convertTimeZone(getDateDaysAgo(1), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);

  const currentTimeZone = getItem("timezone");

  const {
    data: bonusData,
    isLoading: bonusGraphDataLoading,
    refetch
  } = useQuery({
    queryKey: [
      'Bonus-Graph',
      utcFormat(startDate),
      utcFormat(endDate),
      currentTimeZone,
      intervalTime?.value || "auto",
      bonusType.length === 0
        ? null
        : bonusType.some(b => b.value === 'all')
          ? "all"
          : bonusType.map(b => b.value).join(",")
    ],
    queryFn: async ({ queryKey }) => {
      const [_,start, end, timezone, intv, bonusTypeStr] = queryKey;

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
        params.bonusType = bonusTypeStr.split(",");
      } else if (bonusTypeStr === "all") {
        params.bonusType = ["all"];
      }

      return getBonusGraphData(params);
    },
    enabled: !!startDate && !!endDate && bonusType.length > 0,
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
    setBonusType([{ label: "All", value: "all" }]);
    setSelectedMetric(bonusMetricOptions[0]);
    setSelectedRange('1d')
  };

  return {
    bonusData,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    intervalTime,
    setIntervalTime,
    bonusType,
    setBonusType,
    bonusGraphDataLoading,
    resetFilters,
    selectedMetric,
    setSelectedMetric,
    refreshInterval,
    setRefreshInterval,
    progress,
    countdownKey,
    selectedRange,
    setSelectedRange
  };
};

export default useBonusGraph;
