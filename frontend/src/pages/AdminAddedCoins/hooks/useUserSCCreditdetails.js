import {  useState } from 'react';
import {  useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserCreditedByAdmin } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce';

const useUserSCCreditdetails = () => {
  const { adminUserId } = useParams();
   const navigate = useNavigate()
    const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [emailSearch, setEmailSearch] = useState('');
  const [debouncedEmailSearch] = useDebounce(emailSearch, 500);
  const [idSearch, setIdSearch] = useState('');
  const [debouncedIdSearch] = useDebounce(idSearch, 500);
  const [nameSearch, setNameSearch] = useState('');
  const [debouncedNameSearch] = useDebounce(nameSearch, 500);
  const [orderBy, setOrderBy] = useState('createdAt')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false) 

  // Reset filters
  const resetFilters = () => {
    setEmailSearch('');
    setIdSearch('');
    setNameSearch('');
    setLimit(15);
    setPage(1);
  };

    const selected = (h) =>
      ['userEmail', 'createdAt', 'userId', 'amount'].includes(h.value) &&
      orderBy === h.value;

  const {
    data: UserSCCreditData,
    isLoading: loading
  } = useQuery({
    queryKey: [
      'UserCreditedByAdmin',
      limit,
      page,
      debouncedEmailSearch,
      debouncedIdSearch,
      debouncedNameSearch,
      orderBy,
      sort,
      adminUserId
      ],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      };
      if (queryKey[3]) params.emailSearch = queryKey[3];
      if (queryKey[4]) params.idSearch = queryKey[4];
      if (queryKey[5]) params.firstNameSearch = queryKey[5];
      if (queryKey[6]) params.orderBy = queryKey[6]
      if (queryKey[7]) params.sort = queryKey[7]
      if (queryKey[8]) params.adminUserId = queryKey[8]

      return getUserCreditedByAdmin(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  });

  const totalPages = Math.ceil(UserSCCreditData?.data?.count / limit);

  return {
    navigate,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    UserSCCreditData,
    loading,
    emailSearch,
    setEmailSearch,
    idSearch,
    setIdSearch,
    nameSearch,
    setNameSearch,
    resetFilters,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    selected
  };
};

export default useUserSCCreditdetails;
