import { useState } from 'react'
import { getItem } from '../../../utils/storageUtils'
import { useQuery } from '@tanstack/react-query'
import { getPurchaseReport} from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'

const usePurchaseReport = () => {

  const timezone = getItem("timezone")
   const [csvDownload, setCsvDownload] = useState('false')
  const [limit, setLimit] = useState(15)
  const [pageNo, setPageNo] = useState(1)
  const [search, setSearch] = useState('')

  const [filterBy, setFilterBy] = useState('')
  const [filterOperator, setFilterOperator] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortBy, setSortBy] = useState('asc')
 
  const [orderBy, setOrderBy] = useState('')
   const [over, setOver] = useState(false)

 
  const [debouncedSearch] = useDebounce(search, 500)
  const [debouncedFilterValue] = useDebounce(filterValue, 500)

  const { data: purchaseReportData, isLoading: loading, refetch: purchaseRefetch } = useQuery({
    queryKey: ['purchaseReport', limit, pageNo, debouncedSearch, filterBy, filterOperator, debouncedFilterValue, sortBy, orderBy, csvDownload],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
        timezone
      }
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.filterBy = queryKey[4]
      if (queryKey[5]) params.filterOperator = queryKey[5]
      if (queryKey[6]) params.filterValue = queryKey[6]
      if (queryKey[7]) params.sortBy = queryKey[7]
      if (queryKey[8]) params.orderBy = queryKey[8]
      if (queryKey[9]) params.csvDownload = queryKey[9]

      return getPurchaseReport(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: Boolean(timezone && (!filterBy || (filterOperator && debouncedFilterValue))),
    keepPreviousData: true
  })
  const totalPages = Math.ceil(purchaseReportData?.count / limit)


const getCsvDownloadUrl = () => {
  const params = new URLSearchParams({
    csvDownload: 'true',
    limit,
    pageNo,
    timezone,
  });

  if (debouncedSearch) params.append('search', debouncedSearch);
  if (orderBy) params.append('orderBy', orderBy);
  if (filterBy) params.append('filterBy', filterBy);
  if (filterOperator) params.append('filterOperator', filterOperator);
  if (debouncedFilterValue) params.append('filterValue', debouncedFilterValue);

  return `${process.env.REACT_APP_API_URL}/api/v1/report/purchase-report?${params.toString()}`;
};


return {
  purchaseReportData,
    setLimit,
    setPageNo,
    totalPages,
    limit,
    pageNo,
  
    loading,
    getCsvDownloadUrl,
    search,
    setSearch,
    purchaseRefetch,
    setCsvDownload,
    filterOperator,
    setFilterOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,sortBy,setSortBy,orderBy,setOrderBy,over,setOver
  }  
}

export default usePurchaseReport
