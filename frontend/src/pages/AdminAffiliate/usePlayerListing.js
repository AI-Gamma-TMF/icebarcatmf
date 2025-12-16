import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { getAffiliatesList } from '../../utils/apiCalls'
import { useTranslation } from 'react-i18next'
import { errorHandler , useUpdateStatusMutation } from '../../reactQuery/hooks/customMutationHook'
import { toast } from '../../components/Toast'
import { initialSet } from './constants'

const usePlayerListing = () => {
  const { t } = useTranslation(['players'])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);
  const [kycOptions, setKycOptions] = useState('')
  const [orderBy, setOrderBy] = useState('affiliateId')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [playerId, setPlayerId] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)
  const [globalSearch, setGlobalSearch] = useState(initialSet)

  const { isLoading: loading, data: res,refetch } = useQuery({
    queryKey: ['AffiliateList', limit, page, debouncedSearch, kycOptions, orderBy, sort, globalSearch],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.kycStatus = kycOptions
      if (queryKey[5]) params.orderBy = orderBy
      if (queryKey[6]) params.sort = sort
      if (queryKey[7]) params.idSearch = globalSearch.idSearch
      if (globalSearch.emailSearch) params.emailSearch = globalSearch.emailSearch
      if (globalSearch.firstNameSearch) params.firstNameSearch = globalSearch.firstNameSearch
      if (globalSearch.lastNameSearch) params.lastNameSearch = globalSearch.lastNameSearch
      if (globalSearch.lastNameSearch) params.lastNameSearch = globalSearch.lastNameSearch
      if (globalSearch.userNameSearch) params.userNameSearch = globalSearch.userNameSearch
      if (globalSearch.phoneSearch) params.phoneSearch = globalSearch.phoneSearch
      if (globalSearch.affiliateIdSearch) params.affiliateIdSearch = globalSearch.affiliateIdSearch
      if (globalSearch.regIpSearch) params.regIpSearch = globalSearch.regIpSearch
      if (globalSearch.lastIpSearch) params.lastIpSearch = globalSearch.lastIpSearch
      if (9[6]) params.sort = sort
    
      return getAffiliatesList(params)
    }
  })
  const playersData = res?.data?.affiliatesDetails
  const totalPages = Math.ceil(playersData?.count / limit)

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const { mutate: updateStatus } = useUpdateStatusMutation({onSuccess: ({data}) => {
        toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['playersList'] })
        setStatusShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }})

  const handleStatusShow = (id, status) => {
      setPlayerId(id)
      setStatus(!status)
      setStatusShow(true)
    }

  const handleYes = () => {
      updateStatus({
        code: 'USER',
        userId: playerId,
        status
      })
    }

  return {
    t,
    orderBy,
    selected,
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    playersData,
    totalPages,
    navigate,
    loading,
    kycOptions,
    setKycOptions,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    handleStatusShow,
    setStatusShow, statusShow, handleYes, status,
    globalSearch,
    setGlobalSearch,
    refetch
  }
}

export default usePlayerListing
