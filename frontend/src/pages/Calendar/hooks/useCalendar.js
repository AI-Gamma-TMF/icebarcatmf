import { useQuery } from '@tanstack/react-query';
import { getCalendarList } from "../../../utils/apiCalls";

const useCalendar = ({ selectedFilters, startDate, endDate }) => {
    const typeParam = selectedFilters.includes("all")
        ? "all"
        : selectedFilters.join(",");

    const { data = {}, isLoading, refetch, error } = useQuery({
        queryKey: ["calendar", typeParam, startDate, endDate],
        queryFn: () =>
            getCalendarList({
                type: selectedFilters.includes("all") ? ['all'] : selectedFilters,
                startDate: startDate,
                endDate: endDate,
            }),
        select: (res) => res?.data?.data ?? {},
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    });

    return {
        calendarData: data,
        isLoading,
        refetchCalendar: refetch,
        error
    };
};

export default useCalendar;
