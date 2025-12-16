import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminAddedCoins } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce';

const useStaffSCCreditDetails = () => {
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [orderBy, setOrderBy] = useState('adminUserId')
  const [sort, setSort] = useState('ASC')
  const [over, setOver] = useState(false)

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setLimit(15);
    setPage(1);
  };

    const selected = (h) =>
      ['email', 'totalScAdded', 'totalScRemoved'].includes(h.value) &&
      orderBy === h.value;

      const {
        data: StaffSCCreditData,
        isLoading: loading,
        isFetching
          } = useQuery({
        queryKey: [
            'AdminCreditCoins',
            limit,
            page,
            debouncedSearch,
            orderBy,
            sort
        ],
        queryFn: async ({ queryKey }) => {
            const params = {
                pageNo: queryKey[2],
                limit: queryKey[1],
            };
            if (queryKey[3]) params.search = queryKey[3];
            if (queryKey[4]) params.orderBy = queryKey[4];
            if (queryKey[5]) params.sort = queryKey[5];
    
            return getAdminAddedCoins(params);
        },
        refetchOnWindowFocus: false,
        select: (res) => res?.data,
        onError: (error) => {
            console.error('Error fetching data:', error);
        },
    });
    

  const totalPages = Math.ceil(StaffSCCreditData?.adminDetails?.count / limit);

  return {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    StaffSCCreditData,
    loading,
    search,
    setSearch,
    resetFilters,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    selected,
    isFetching  };
};

export default useStaffSCCreditDetails;
