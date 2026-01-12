import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getDateThreeMonthsBefore,
} from "../../../utils/dateFormatter";
import { getReportsV2 } from "../../../utils/apiCalls";
import {
  convertTimeZone,
  convertToUtc,
} from "../../../utils/helper";
import { useUserStore } from "../../../store/store";
import {
  isDemoHost,
  getMockDashboardData,
  getMockLoginData,
  getMockCustomerData,
  getMockEconomyData,
  getMockTransactionData,
  getMockBonusData,
  getMockReportTillData,
} from "../../../utils/demoData";

const useDashboardDataListing = (
  economicDataAccordionOpen = false,
  transactionDataAccordianOpen = false,
  bonusDataAccordionOpen = false
) => {
  const { t } = useTranslation(["dashboard"]);
  const [playerType, setPlayerType] = useState("real");
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  
  // Check if we're on the demo host - use mock data instead of real API calls
  const isDemo = isDemoHost();

  const [startDate, setStartDate] = useState(() =>
    convertTimeZone(getDateThreeMonthsBefore(), timeZoneCode)
  );
  const [endDate, setEndDate] = useState(() =>
    convertTimeZone(new Date(), timeZoneCode)
  );
  
  // Only update dates when timezone actually changes, not on every render
  useEffect(() => {
    setStartDate(convertTimeZone(getDateThreeMonthsBefore(), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);

  // Helper function to handle date conversion before passing to API
  const getFormattedParams = () => ({
    playerType,
    startDate: convertToUtc(startDate),
    endDate: convertToUtc(endDate),
    timezone: timeZoneCode ? timeZoneCode : "GMT",
  });

  // const {
  //   data: dashboardData,
  //   isFetching: dashboardReportLoading,
  //   refetch: dashboardReportRefetch,
  //   isRefetching: isDashboardReportRefetching,
  // } = useQuery({
  //   queryKey: ["dashboardReport", timeZoneCode, startDate, endDate],
  //   queryFn: () =>
  //     getReports({ ...getFormattedParams(), reportType: "dashboardData" }),
  //   select: (res) => res?.data,
  //   refetchOnWindowFocus: false,
  // });
  const {
    data: dashboardDataV2,
    isFetching: dashboardReportLoadingV2,
    refetch: dashboardReportRefetchV2,
    isRefetching: isDashboardReportRefetchingV2,
  } = useQuery({
    queryKey: ["dashboardReportV2", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockDashboardData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "dashboardData" }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    // enabled:false
  });

  const {
    data: reportData,
    isFetching: reportLoading,
    refetch: reportRefetch,
    isRefetching: isReportRefetching,
  } = useQuery({
    queryKey: ["betReport", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockLoginData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "loginData" }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  // const {
  //   data: customerData,
  //   isFetching: customerLoading,
  //   refetch: customerRefetch,
  //   isRefetching: isCustomerRefetching,
  // } = useQuery({
  //   queryKey: ["customerReport", timeZoneCode, startDate, endDate],
  //   queryFn: () =>
  //     getReports({ ...getFormattedParams(), reportType: "customerData" }),
  //   select: (res) => res?.data,
  //   refetchOnWindowFocus: false,
  // });
  const {
    data: customerDataV2,
    isFetching: customerLoadingV2,
    refetch: customerRefetchV2,
    isRefetching: isCustomerRefetchingV2,
  } = useQuery({
    queryKey: ["customerReportV2", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockCustomerData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "customerData" }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,

  });
  // const {
  //   data: economyData,
  //   isFetching: economyLoading,
  //   refetch: economyRefetch,
  //   isRefetching: isEconomyRefetching,
  // } = useQuery({
  //   queryKey: ["economyReport", timeZoneCode, startDate, endDate],
  //   queryFn: () =>
  //     getReports({ ...getFormattedParams(), reportType: "economyData" }),
  //   enabled: economicDataAccordionOpen,
  //   select: (res) => res?.data,
  //   refetchOnWindowFocus: false,
  //   enabled:false
  // });
  const {
    data: economyDataV2,
    isFetching: economyLoadingV2,
    refetch: economyRefetchV2,
    isRefetching: isEconomyRefetchingV2,
  } = useQuery({
    queryKey: ["economyReportV2", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockEconomyData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "economyData" }),
    enabled: economicDataAccordionOpen || isDemo,
    select: (res) => res?.data,
    refetchOnWindowFocus: false,


  });

  // const {
  //   data: transactionData,
  //   isFetching: transactionLoading,
  //   refetch: transactionRefetch,
  //   isRefetching: isTransactionRefetching,
  // } = useQuery({
  //   queryKey: ["transactionReport", timeZoneCode, startDate, endDate],
  //   queryFn: () =>
  //     getReports({ ...getFormattedParams(), reportType: "transactionData" }),
  //   enabled: transactionDataAccordianOpen,
  //   select: (res) => res?.data,
  //   refetchOnWindowFocus: false,
  //   enabled:false
  // });
  const {
    data: transactionDataV2,
    isFetching: transactionLoadingV2,
    refetch: transactionRefetchV2,
    isRefetching: isTransactionRefetchingV2,
  } = useQuery({
    queryKey: ["transactionReportV2", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockTransactionData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "transactionData" }),
    enabled: transactionDataAccordianOpen || isDemo,
    select: (res) => res?.data,
    refetchOnWindowFocus: false,

  });
  const {
    data: bonusDataV2,
    isFetching: bonusLoadingV2,
    refetch: bonusRefetchV2,
    isRefetching: isBonusRefetchingV2,
  } = useQuery({
    queryKey: ["bonusReportV2", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockBonusData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "bonusData" }),
    enabled: bonusDataAccordionOpen || isDemo,
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });
  // NOTE: Avoid noisy console logs on the dashboard (hurts perceived perf).
  const {
    data: reportTillData,
    isFetching: reportTillLoading,
    refetch: reportTillRefetch,
    isRefetching: isReportTillRefetching,
  } = useQuery({
    queryKey: ["tilldatedata", timeZoneCode, startDate?.toISOString?.() || startDate, endDate?.toISOString?.() || endDate, isDemo],
    queryFn: () =>
      isDemo
        ? Promise.resolve({ data: getMockReportTillData() })
        : getReportsV2({ ...getFormattedParams(), reportType: "loginDataTillDate" }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled: isDemo, // Enable for demo, disabled for prod
  });
  return {
    dashboardDataV2,
    dashboardReportLoadingV2,
    dashboardReportRefetchV2,
    isDashboardReportRefetchingV2,
    transactionDataV2,
    transactionLoadingV2,
    transactionRefetchV2,
    isTransactionRefetchingV2,
    economyLoadingV2,
    economyDataV2,
    economyRefetchV2,
    isEconomyRefetchingV2,
    customerDataV2,
    customerLoadingV2,
    customerRefetchV2,
    isCustomerRefetchingV2,
    reportData,


    reportRefetch,



    reportLoading,



    isReportRefetching,
    // setTimeStamp,
    // timeStamp,
    playerType,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setPlayerType,
    t,
    timeZoneCode,




    reportTillData,
    reportTillLoading,
    reportTillRefetch,
    isReportTillRefetching,
    bonusDataV2,
    bonusLoadingV2,
    bonusRefetchV2,
    isBonusRefetchingV2,
  };
};

export default useDashboardDataListing;
