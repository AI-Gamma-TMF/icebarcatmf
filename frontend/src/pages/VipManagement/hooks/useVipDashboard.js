import { getBiggestWinnerAndLooser, getVipDashboardReport } from '../../../utils/apiCalls';
import { useQuery } from '@tanstack/react-query';
import { getItem } from '../../../utils/storageUtils';

const useVipDashboard = () => {
    const timezone = getItem('timezone');

  const { data: biggestWinnerLooser, isLoading } = useQuery({
    queryKey: ['vipBiggestWinLose', timezone],
    queryFn: () => {
      const params = {timezone}
      return getBiggestWinnerAndLooser(params);
    },
    select: (res) => res?.data?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: vipDashboardSummary,
    isLoading: isVipDashboardSummaryLoading,
  } = useQuery({
    queryKey: ['vipDashboardSummary', timezone],
    queryFn: () => {
      const params = { reportType: '1' , timezone};
      return getVipDashboardReport(params);
    },
    select: (res) => res?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    data: vipDashboardStats,
    isLoading: isVipDashboardStatsLoading,
  } = useQuery({
    queryKey: ['vipDashboardStats',timezone],
    queryFn: () => {
      const params = { reportType: '2', timezone };
      return getVipDashboardReport(params);
    },
    select: (res) => res?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,

  });

  const { data: vipDashboardPerformanceMetrics, isLoading: isPerformanceMetricsLoading } = useQuery({
    queryKey: ['vipDashboardPerformanceMetrics', timezone],
    queryFn: () => {
      const params = { reportType: '3', timezone };
      return getVipDashboardReport(params);
    },
    select: (res) => res?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,

  });

  const { data: vipDashboardScRewardMetrics, isLoading: isScRewardMetricsLoading } = useQuery({
    queryKey: ['vipDashboardScRewardMetrics', timezone],
    queryFn: () => {
      const params = { reportType: '4', timezone };
      return getVipDashboardReport(params);
    },
    select: (res) => res?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,

  });

  return {
    biggestWinnerLooser,
    isLoading,
    vipDashboardSummary,
    isVipDashboardSummaryLoading,
    vipDashboardStats,
    isVipDashboardStatsLoading,
    vipDashboardPerformanceMetrics,
    isPerformanceMetricsLoading,
    vipDashboardScRewardMetrics,
    isScRewardMetricsLoading
  };
};

export default useVipDashboard;
