import { useEffect, useState } from 'react'
import { getItem } from '../../../utils/storageUtils'
// import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getBankingTransactions } from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'
import { convertTimeZone, convertToUtc } from '../../../utils/helper'
import { useUserStore } from '../../../store/store'
const useTransactionBLIst = (email) => {
  // const { userId } = useParams()
  const { t } = useTranslation('players')
  const [selectedAction, setSelectedAction] = useState('all')
  // const timezone = getItem("timezone")
  const [csvDownload, setCsvDownload] = useState(false)
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState(email || '')
  const [debouncedSearch] = useDebounce(search, 500)
  const [userIdFilter, setUserIdFilter] = useState('')
   const [orderBy, setOrderBy] = useState("createdAt");
    const [sort, setSort] = useState("DESC");
    const [over, setOver] = useState(false);


  // const [state, setState] = useState([
  //   {
  //     startDate: getDateDaysAgo(10),
  //     endDate: new Date(),
  //     key: 'selection'
  //   }
  // ])
  const timeZone = getItem("timezone");
  // const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()
  // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x=> x.value === timezoneOffset)?.code);
  const timeZoneCode = useUserStore((state) => state.timeZoneCode)

  const [startDate, setStartDate] = useState(() => convertTimeZone(new Date(), timeZoneCode));
  const [endDate, setEndDate] = useState(() => convertTimeZone(new Date(), timeZoneCode));

  useEffect(() => {
    setStartDate(convertTimeZone(new Date(), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));

  }, [timeZoneCode]);


  const { data: transactionData, isLoading: loading, refetch: transactionRefetch } = useQuery({
    queryKey: ['transactionList', limit, page, debouncedSearch, status, selectedAction,
      convertToUtc(startDate), convertToUtc(endDate), timeZone ? timeZone : 'GMT', userIdFilter, sort, orderBy
    ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.email = queryKey[3]
      if (queryKey[4]) params.status = queryKey[4]
      if (queryKey[5]) params.transactionType = queryKey[5]
      if (queryKey[6]) params.startDate = queryKey[6]
      if (queryKey[7]) params.endDate = queryKey[7]
      if (queryKey[8]) params.timezone = queryKey[8]
      if (queryKey[9]) params.userId = queryKey[9]
      if(queryKey[10]) params.sort = queryKey[10]
      if(queryKey[11]) params.orderBy = queryKey[11]

      return getBankingTransactions(params)
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.transactionDetail,

  })

  const totalPages = Math.ceil(transactionData?.count / limit)

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/v1/payment/transactions?csvDownload=true&limit=${limit}&pageNo=${page}&startDate=${convertToUtc(startDate)}&endDate=${convertToUtc(endDate)}&transactionType=${selectedAction}&status=${status}&timezone=${timeZone}&email=${search}`

  return {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedAction,
    startDate, setStartDate, endDate, setEndDate,
    t,
    transactionData,
    loading,
    status,
    setStatus,
    getCsvDownloadUrl,
    search,
    setSearch,
    transactionRefetch,
    csvDownload,
    setCsvDownload,
    timeZoneCode,
    userIdFilter,
    setUserIdFilter,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver
  }
}

export default useTransactionBLIst