import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getUserSubscriptionList } from '../../../utils/apiCalls';

const useUserSubscriptionList = () => {
    const navigate = useNavigate();

    const [limit, setLimit] = useState(15);
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all')
    const [subscriptionType, setSubscriptionType] = useState('all')
    const [debouncedUserIdSearch] = useDebounce(userId, 500)
    const [debouncedSearch] = useDebounce(search, 500)
    const [sort, setSort] = useState('DESC')
    const [orderBy, setOrderBy] = useState('userId')

    const resetFilters = () => {
        setUserId('');
        setSearch('');
        setLimit(15);
        setPage(1);
        setStatus('all');
        setSubscriptionType('all');
    };

    const {
        data: UserSubscriptionList = [],
        isLoading: loading,
        refetch: UserSubscriptionListRefetch,
        isError,
        error,
    } = useQuery({
        queryKey: [
            'UserSubscription',
            limit,
            page,
            debouncedUserIdSearch,
            status,
            subscriptionType,
            orderBy,
            sort,
            debouncedSearch
        ],
        queryFn: ({ queryKey }) => {
            const params = {
                pageNo: queryKey[2],
                limit: queryKey[1]
            };
            if (queryKey[3]) params.userId = queryKey[3];
            if (queryKey[4]) params.status = queryKey[4];
            if (queryKey[5]) params.subscriptionType = queryKey[5];
            if (queryKey[6]) params.orderBy = queryKey[6];
            if (queryKey[7]) params.sort = queryKey[7];
            if (queryKey[8]) params.search = queryKey[8];

            return getUserSubscriptionList(params);
        },
        refetchOnWindowFocus: false,
        select: (res) => res?.data,
        onError: (error) => {
            console.error('Error fetching Amoe data:', error);
        },
    });

    const selected = (h) =>
        orderBy === h.value &&
        h.labelKey !== 'Action'

    const totalPages = Math.ceil(UserSubscriptionList?.data?.count / limit);

    return {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        userId,
        setUserId,
        status,
        setStatus,
        subscriptionType,
        setSubscriptionType,
        resetFilters,
        orderBy,
        setOrderBy,
        sort,
        setSort,
        selected,
        search,
        setSearch,
        UserSubscriptionList,
        loading,
        UserSubscriptionListRefetch,
        isError,
        error,
        navigate
    };
};

export default useUserSubscriptionList;
