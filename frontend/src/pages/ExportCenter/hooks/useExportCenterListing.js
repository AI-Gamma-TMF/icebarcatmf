import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllCSVExportData } from '../../../utils/apiCalls';
import { convertTimeZone } from '../../../utils/helper';
import { formatDateYMD, getDateDaysAgo } from '../../../utils/dateFormatter';
import { useUserStore } from '../../../store/store';

const useExportCenterListing = () => {
    const { t } = useTranslation(['exportCenter']);
    const [limit, setLimit] = useState(15);
    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState('id');
    const [sortBy, setSortBy] = useState('DESC')
    const [statusFilter, setStatusFilter] = useState('all')
    const [type, setType] = useState('')
    const [over, setOver] = useState(false)

    // const timezone = getItem("timezone");
    // const timezoneOffset = timezone != null ? timeZones.find(x => x.code === timezone).value : getFormattedTimeZoneOffset()
    // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x => x.value === timezoneOffset)?.code);
    const timeZoneCode = useUserStore((state) => state.timeZoneCode)

    const [startDate, setStartDate] = useState(convertTimeZone(getDateDaysAgo(7), timeZoneCode));
    const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));


    const { data: exportCenterList, isLoading: loading, refetch } = useQuery({
        queryKey: ['exportCenterList', limit, page, type, orderBy, sortBy, statusFilter, formatDateYMD(startDate), formatDateYMD(endDate), timeZoneCode],
        queryFn: ({ queryKey }) => {
            const params = { limit: queryKey[1], pageNo: queryKey[2] };
            if (queryKey[3]) params.type = queryKey[3]
            if (queryKey[4]) params.orderBy = queryKey[4]
            if (queryKey[5]) params.sortBy = queryKey[5]
            if (queryKey[6]) params.status = queryKey[6]
            if (queryKey[7]) params.startDate = queryKey[7]
            if (queryKey[8]) params.endDate = queryKey[8]
            if (queryKey[9]) params.timezone = queryKey[9]

            return getAllCSVExportData(params);
        },
        select: (res) => res?.data?.exportsList?.rows,
        refetchOnWindowFocus: false,
        retry: 0,

    })
    const totalPages = Math.ceil(exportCenterList?.count / limit)
    const selected = (h) =>
        orderBy === h.value &&
        h.labelKey !== 'Action'


    // useEffect(() => {
    //     setTimeZoneCode(timeZones.find(x => x.value === timezoneOffset)?.code)
    // }, [timezoneOffset])

    useEffect(() => {
        setStartDate(convertTimeZone(getDateDaysAgo(7), timeZoneCode));
        setEndDate(convertTimeZone(new Date(), timeZoneCode));
    }, [timeZoneCode]);

    const handleReset = () => {
        setLimit(15);
        setPage(1);
        setOrderBy('id');
        setSortBy('DESC')
        setStatusFilter('all');
        setType('');
        setOver(false);
        setStartDate(convertTimeZone(getDateDaysAgo(7), timeZoneCode));
        setEndDate(convertTimeZone(new Date(), timeZoneCode));
    }

    return {
        t,
        setOrderBy,
        setSortBy,
        setStatusFilter,
        exportCenterList,
        setPage,
        page,
        statusFilter,
        type,
        setType,
        totalPages,
        limit,
        setLimit,
        selected,
        sortBy,
        over,
        setOver,
        orderBy,
        loading,
        refetch,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleReset
    }
}

export default useExportCenterListing;