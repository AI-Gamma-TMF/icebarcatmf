import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { getAllTierUserListParams} from '../../../utils/apiCalls'

const useTierUserDetails = () => {
  const { tierId } = useParams()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('userId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: tierUserData, isLoading:isUserDataLoading } = useQuery({
    queryKey: ['tierUser',limit, page, orderBy, sort, debouncedSearch ],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.search = queryKey[5]
      return getAllTierUserListParams({tierId,params})
    },
    select: (res) => res?.data?.tierUserDetail,
    refetchOnWindowFocus: false
  })


  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(tierUserData?.count / limit)
  return {
    navigate,
    tierUserData,
    isUserDataLoading,
    sort,
    setSort,
    setOrderBy,
    setLimit,
    setPage,
    limit,
    page,
    over,
    setOver,
    totalPages,
    selected,
    search,
    setSearch
  }
}

export default useTierUserDetails