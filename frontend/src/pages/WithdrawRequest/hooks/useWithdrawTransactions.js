import { useEffect, useState } from 'react'
import { getItem } from '../../../utils/storageUtils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRedeemDashboardData, getUserWithdrawRequests, getWithdrawRequests } from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'
import { toast } from '../../../components/Toast'
import { useFetchWithdrawRequestStatusMutation, useRedeemMoreDetailMutation, useUpdateRedeemRequestMutation, useUpdateWithdrawRequestMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useUserStore } from '../../../store/store'
import { timeZones } from '../../Dashboard/constants'
import { convertTimeZone, convertToUtc, getFormattedTimeZoneOffset } from '../../../utils/helper'
const useWithdrawTransactions = ({fetchDashboardData = false}={}) => {
  const { permissions } = useUserStore((state) => state);
  const [selectedAction, setSelectedAction] = useState('pending')
  const [paymentProvider, setPaymentProvider] = useState('all')
  const [approveModal, setApproveModal] = useState(false)
  // const [fetchStatusId, setFetchStatusId] = useState('')
  const [redeemMoreDetail, setRedeemMoreDetail] = useState(false)
  const [redeemRequest, setRedeemRequest] = useState({})
  const [moreDetailData, setMoreDetailData] = useState({})
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [userId,setUserId] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const queryClient = useQueryClient()
  const timezone = getItem("timezone")
  const [operator, setOperator] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [loadingRows, setLoadingRows] = useState({})
  const [isApproved, setIsApproved] = useState(null)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [pendingDay, setPendingDay] = useState(null)
  const [reasonData, setReasonData] = useState(null);
  const [debouncedPendingDay] = useDebounce(pendingDay, 600)
  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const timezoneOffset = timezone != null ? timeZones.find(x => x.code === timezone).value : getFormattedTimeZoneOffset()
  const timeZoneCode = useUserStore((state) => state.timeZoneCode)
  const [startDate, setStartDate] = useState(convertTimeZone(new Date(), timeZoneCode));
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));

  useEffect(() => {
    setStartDate(convertTimeZone(new Date(), timeZoneCode));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [timeZoneCode]);


  const {
    data: redeemDashboardData,
  } = useQuery({
    queryKey: ["RedeemRuleDashboardData"],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      };
      return getRedeemDashboardData(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    retry:false,
    enabled:fetchDashboardData,
  });

 const dashboardData = redeemDashboardData?.redeemDashboardData


  const { data: transactionData, isLoading: loading } = useQuery({
    queryKey: ['withdrawList', limit, page, selectedAction, convertToUtc(startDate), 
      convertToUtc(endDate), debouncedSearch, timezone ? timezone : 'GMT', isApproved, sort, debouncedPendingDay, paymentProvider, 
      filterBy,debouncedFilterValue,operator,transactionId,userId, orderBy],
    queryFn: ({ queryKey }) => {
      const params = { limit: queryKey[1], pageNo: queryKey[2], isApproved: queryKey[8] };
      if (queryKey[3]) params.status = queryKey[3]
      if (queryKey[4] && !isApproved && !pendingDay) params.startDate = queryKey[4]
      if (queryKey[5] && !isApproved && !pendingDay) params.endDate = queryKey[5]
      if (queryKey[6] && !isApproved && !pendingDay) params.email = queryKey[6]
      if (queryKey[7] && !isApproved && !pendingDay) params.timezone = queryKey[7]
      if (queryKey[9] && !isApproved) params.sortBy = queryKey[9]
      if (queryKey[10] && !isApproved) params.pendingDay = queryKey[10]
      if (queryKey[11]) params.paymentProvider = queryKey[11]
      if (queryKey[12]) params.filterBy = queryKey[12]
      if (queryKey[13]) params.operator = queryKey[14]
      if (queryKey[14]) params.value = queryKey[13]
      if (queryKey[15]) params.transactionId = queryKey[15].toString()
      if (queryKey[16]) params.userId = queryKey[16]
      if (queryKey[17]) params.orderBy = queryKey[17]
      if (permissions?.Users) {
        return getUserWithdrawRequests(params)
      }
      else {
        return getWithdrawRequests(params)
      }
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.requestDetails,
    retry:false,
    enabled: Boolean(!filterBy || (operator && debouncedFilterValue)),
    keepPreviousData: true,
  })


  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/v1/payment/redeem-requests?csvDownload=true&limit=${limit}&pageNo=${page}&email=${debouncedSearch}&status=${selectedAction}&startDate=${convertToUtc(startDate)}&endDate=${convertToUtc(endDate)}&timezone=${timezone}&userId=${userId}&paymentProvider=${paymentProvider}&filterBy=${filterBy}&operator=${operator}&value=${debouncedFilterValue}`


  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'



  const { mutate: updateWithdrawalRequest, isLoading: updateLoading } = useUpdateWithdrawRequestMutation({
    onSuccess: (data) => {
      if (data.data.success) {
        toast('Withdraw request updated successfully', 'success')
        queryClient.invalidateQueries({ queryKey: ['withdrawList'] })
        const updatedList = queryClient.getQueryData(['withdrawList', limit, page, selectedAction, convertToUtc(startDate), 
      convertToUtc(endDate), debouncedSearch, timezone ? timezone : 'GMT', isApproved, sort, debouncedPendingDay, paymentProvider, 
      filterBy,debouncedFilterValue,operator,transactionId,userId, orderBy]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.requestDetails?.rows) && updatedList?.data?.requestDetails?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
      } else {
        toast(data.data.message, 'error')
      }
    }, onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }
  })

  const { mutate: updateRedeemRequest, isLoading: redeemRequestLoading } = useUpdateRedeemRequestMutation({
    onSuccess: (data) => {
      if (data.data.success) {
        toast(data.data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['withdrawList'] })
      } else {
        toast(data.data.message, 'error')
      }
    }, onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }
  })

  const totalPages = Math.ceil(transactionData?.count / limit)

  const { mutate: getMoreDetailData, isLoading: moreDetailDataLoading } = useRedeemMoreDetailMutation({
    onSuccess: (data) => {
      if (data.data.status) {
        setReasonData(data?.data)
        setMoreDetailData(data?.data)
        setRedeemMoreDetail(true)
        setLoadingRows({ [data?.data?.data?.transactionId]: false })
      } else {
        toast(data.data.message, 'error')
      }
    }, onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }
  })

  const updateRedeemRequestApproved = () => {
    updateRedeemRequest()
  }
  const updateWithdrawData = (data) => {
    updateWithdrawalRequest(data)
  }

  const getMoreDetail = (data) => {
    getMoreDetailData(data)
  }

  const onFetchStatusSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['withdrawList'] })
    toast("Updated Successfully", 'success')
  }

  const onFetchStatusError = (err) => {
    if (err?.response?.data?.errors.length > 0) {
      const { errors } = err.response.data
      errors.forEach((error) => {
        if (error?.description) {
          if (error.errorCode === 3007) {
            console.log(error)
          } else toast(error?.description, "error")
        }
      })
    }
  }
  const fetchStatusMutation = useFetchWithdrawRequestStatusMutation({
    onSuccess: onFetchStatusSuccess,
    onError: onFetchStatusError
  })
  const handelFetchStatus = (id) => {
    // setFetchStatusId(id)
    fetchStatusMutation.mutate({ withdrawRequestId: id });
  }
  return {
    updateWithdrawData, approveModal, setApproveModal,dashboardData,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    setSelectedAction,
    selectedAction,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    transactionData,
    loading,
    search,
    setSearch,
    redeemRequest,
    setRedeemRequest,
    updateLoading,
    handelFetchStatus,
    getCsvDownloadUrl,
    setRedeemMoreDetail,
    redeemMoreDetail,
    timezoneOffset,
    moreDetailData,
    setMoreDetailData,
    selected,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    getMoreDetail,
    reasonData,
    setReasonData,
    pendingDay,
    setPendingDay,
    updateRedeemRequestApproved,
    setIsApproved,
    redeemRequestLoading,
    paymentProvider,transactionId, setTransactionId,userId,setUserId,
    setPaymentProvider, timeZoneCode, moreDetailDataLoading, loadingRows, setLoadingRows,
    operator,
    setOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
  }
}

export default useWithdrawTransactions
