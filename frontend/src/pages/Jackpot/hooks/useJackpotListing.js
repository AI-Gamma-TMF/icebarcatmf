import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentJackpot, getJackpotDetails, getJackpotInfo } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteJackpotMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useDebounce } from 'use-debounce'
import { useUserStore } from '../../../store/store'

const useJackpotListing = (isHitoricalTab) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const timeZoneCode = useUserStore((state) => state.timeZoneCode); 
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  // const [isActive, setIsActive] = useState('all');
  const [jackpotId, setJackpotId] = useState()
  const [status, setStatus] = useState('all')


  const { data: jackpotList, isLoading: loading } = useQuery({
    queryKey: ['jackpotList', limit, page, orderBy,
      sort, debouncedSearch, status, timeZoneCode ? timeZoneCode : 'GMT'],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.search = queryKey[5]
      if (queryKey[6]) params.isActive = queryKey[6]
      if (queryKey[6]) params.timezone = queryKey[7]
      return getJackpotDetails(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled: isHitoricalTab === 'historical-data'
  })


  const { data: jackpotInfo, isLoading: jackpotInfoLoading } = useQuery({
    queryKey: ['jackpotInfo'],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      return getJackpotInfo(params)
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false
  })


  const { data: currentJackpot, isLoading: currentJackpotLoading } = useQuery({
    queryKey: ['currentJackpot'],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      return getCurrentJackpot(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false
  })
  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(jackpotList?.data?.count / limit)


  const handleDelete = (id) => {
    setJackpotId(id)
    setDeleteModalShow(true)
  }

  const { mutate: deleteJackpot, isLoading: deleteLoading } = useDeleteJackpotMutation({
    onSuccess: ({ data }) => {
      if (data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['jackpotList'] })
      queryClient.invalidateQueries({ queryKey: ['currentJackpot'] })
      const updatedList = queryClient.getQueryData(['jackpotList', limit, page, orderBy,
      sort, debouncedSearch, status, timeZoneCode ? timeZoneCode : 'GMT']);
                 
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.data?.rows) && updatedList?.data?.data?.rows?.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }

      setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleDeleteYes = () => {
    deleteJackpot({
      jackpotId: jackpotId,
    })
  }

  return {
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    sort,
    search,
    setSearch,
    jackpotList,
    setOrderBy,
    selected,
    setSort,
    over,
    setOver,
    loading,
    handleDelete,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
    currentJackpot,
    jackpotInfo,
    navigate,
    status, 
    setStatus,
    jackpotInfoLoading,
    currentJackpotLoading

  }
}

export default useJackpotListing
