import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getVaultData } from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'

const useVaultList = (email) => {
 
  const { t } = useTranslation('players')
  const [csvDownload, setCsvDownload] = useState(false)
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(email || '')
  const [username, setUsername] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const[debouncedUsername]=useDebounce(username,500)
  const [operator, setOperator] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const [orderBy, setOrderBy] = useState('total_vault_sc_coin')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState('')

  const { data: vaultData, isLoading: loading, refetch:vaultRefetch } = useQuery({
    queryKey: ['VaultList', limit, page, debouncedSearch, debouncedUsername,
      filterBy, debouncedFilterValue, operator,  sort, orderBy
    ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.email = queryKey[3]
      if (queryKey[4]) params.username = queryKey[4]
      if (queryKey[5]) params.filterBy = queryKey[5]
      if (queryKey[6]) params.value = queryKey[6]
      if (queryKey[7]) params.operator = queryKey[7]
      if (queryKey[8]) params.order = queryKey[8]
      if (queryKey[9]) params.sortBy = queryKey[9]
      
      return getVaultData(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.vaultDetails,
    enabled: Boolean(!filterBy || (operator && debouncedFilterValue)),
    keepPreviousData: true
  })
  
  const totalPages = Math.ceil(vaultData?.count / limit)

  const getCsvDownloadUrl = () =>
   `${process.env.REACT_APP_API_URL}/api/v1/payment/vault-data?csvDownload=true&limit=${limit}&pageNo=${page}&email=${search}&username=${username}&filterBy=${filterBy}&operator=${operator}&value=${debouncedFilterValue}`

  const selected = (h) => orderBy === h.value;

  return {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    t,
    vaultData,
    loading,
    getCsvDownloadUrl,
    search,
    setSearch,
    vaultRefetch,
    csvDownload,
    setCsvDownload,
    username,
    setUsername,
    operator,
    setOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
    sort,
    setSort,
    over,
    setOver,
    orderBy,
    setOrderBy,
    selected
  }
}

export default useVaultList