import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

import { useUserStore } from '../../../store/store'
import { getAllCasinoSubCategories, getGameLobbyGames } from '../../../utils/apiCalls'
import { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from '../../../utils/dateFormatter'
import { convertToUtc } from '../../../utils/helper'
// import { gameLobbyDetails } from '../constant'

const useGameLobby = () => {
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('');
  const [providerId, setProviderId] = useState('');
  const [subCategory, setSubCategory] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState('');
  const [startDate, setStartDate] = useState(moment(getFirstDayOfCurrentMonth())); // moment object
  const [endDate, setEndDate] = useState(moment(getLastDayOfCurrentMonth())); // moment object  
  const [debouncedSearch] = useDebounce(search, 500);


  const { data: gameLobbyDetails, isLoading: gameLobbyLoading } = useQuery({
    queryKey: ['gameLobbyDetails', page, limit, providerId, subCategoryId, convertToUtc(startDate),
      convertToUtc(endDate), debouncedSearch, timeZoneCode ? timeZoneCode : 'GMT'],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[1], limit: queryKey[2] };
      if (queryKey[3]) params.providerId = queryKey[3]
      if (queryKey[4]) params.subCategoryId = queryKey[4]
      if (queryKey[5]) params.startDate = queryKey[5];
      if (queryKey[6]) params.endDate = queryKey[6];
      if (queryKey[7]) params.search = queryKey[7];
      // if (queryKey[4]) params.timezone = queryKey[5];

      return getGameLobbyGames(params)
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
  })

  const { data: subCategories } = useQuery({
    queryKey: ['subCategories'],
    queryFn: () => {
      // const params = {pageNo: queryKey[2], limit: queryKey[1]};
      return getAllCasinoSubCategories();
    },
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    select: (res) => res?.data?.subCategory,
    onSuccess: (data) => {      
      if (data?.rows && data?.rows?.length) {
        const temp = [];
        data?.rows?.map((subCategory) => {
          temp.push({
            label: subCategory?.name.EN,
            value: subCategory?.masterGameSubCategoryId,
          });
        });
        setSubCategory(temp);
      }
    },
  });

  // const selected = (h) =>
  //   orderBy === h.value &&
  //   h.labelKey !== 'Actions'

  // const totalPages = Math.ceil(providerDetails?.count / limit)

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    subCategory,
    subCategoryId,
    setSubCategoryId,
    gameLobbyDetails,
    gameLobbyLoading,
    search,
    setSearch,
    setPage
  }
}

export default useGameLobby
