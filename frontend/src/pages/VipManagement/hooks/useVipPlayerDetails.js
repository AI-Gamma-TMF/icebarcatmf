import { useQuery } from '@tanstack/react-query';
import { getVipPlayerDetails } from '../../../utils/apiCalls';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useState } from 'react';

const useVipPlayerDetails = () => {
  const { userId } = useParams();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: vipPlayerDetails, isLoading: vipPlayerDataLoading } = useQuery({
    queryKey: ['vipPlayerDetails', userId, debouncedSearch],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.userId = queryKey[1];
      if (queryKey[2]) params.userNameSearch = queryKey[2];

      return getVipPlayerDetails(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  return {
    vipPlayerDetails,
    vipPlayerDataLoading,
    search,
    setSearch,
  };
};

export default useVipPlayerDetails;
