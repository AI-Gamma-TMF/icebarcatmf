import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCasinoProviders, getAllProviders, getCasinoAggregators,  getProviderDashboardDetails } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteProviderRateMatrixMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useDebounce } from 'use-debounce'
import { useUserStore } from '../../../store/store'
import moment from 'moment'
import { getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from '../../../utils/dateFormatter'
import { convertToUtc } from '../../../utils/helper'

const useProviderRateMatrixListing = (isHitoricalTab) => {
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
  const [rateId, setRateId] = useState()
  const [status, setStatus] = useState('all')

  const [providerId, setProviderId] = useState('');
  const [aggregatorId, setAggregatorId] = useState('');
  const [gameNameOptions, setGameNameOptions] = useState([]);
  const [providerNameOptions, setProviderNameOptions] = useState([]);
  const [aggregatorNameOptions, setAggregatoNameOptions] = useState([]);
  const [startDate, setStartDate] = useState(moment(getFirstDayOfCurrentMonth())); // moment object
  const [endDate, setEndDate] = useState(getLastDayOfCurrentMonth()); // moment object  
 
  const { data: providerDetails, isLoading: loading } = useQuery({
    queryKey: ['providerDetails', limit, page, orderBy,
      sort, providerId, status, timeZoneCode ? timeZoneCode : 'GMT'],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[5]) params.providerId = queryKey[5]
      return getAllProviders(params)
    },
    select: (res) => res?.data?.finalResult,
    refetchOnWindowFocus: false,
    enabled: isHitoricalTab === 'provider-matrix'
  })



  const { data: providerInfo, isLoading: providerInfoLoading } = useQuery({
    queryKey: ['providerInfo', providerId, aggregatorId,  convertToUtc(startDate),
          convertToUtc(endDate), timeZoneCode ? timeZoneCode : 'GMT'],
    queryFn: ({ queryKey }) => {
      const params = { };
      if (queryKey[1]) params.masterCasinoProviderId = queryKey[1]
      if (queryKey[2]) params.masterGameAggregatorId = queryKey[2]
       if (queryKey[3]) params.startDate = queryKey[3];
      if (queryKey[4]) params.endDate = queryKey[4];
      if (queryKey[5]) params.timezone = queryKey[5];

      return getProviderDashboardDetails(params)
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    enabled: isHitoricalTab === 'dashboard'

  })

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(providerDetails?.count / limit)


  const handleDelete = (id) => {
    setRateId(id)
    setDeleteModalShow(true)
  }

  const { mutate: deleteProviderRate, isLoading: deleteLoading } = useDeleteProviderRateMatrixMutation({
    onSuccess: ({ data }) => {
      if (data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['rateMatrixList'] })
      setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const { data: gameDashboardProvider, isLoading: providerListLoading } = useQuery({
    queryKey: ['gameDashboardProvider'],
    queryFn: () => {
      return getAllCasinoProviders();
    },
    select: (res) => res?.data?.casinoProvider,
    refetchOnWindowFocus: false,
    retry: false,
    // enabled: isHitoricalTab === 'provider-matrix',
    onSuccess: (data) => {
      if (data?.rows && data?.rows?.length) {
        const temp = [];
        data?.rows?.map((provider) => {
          temp.push({
            label: provider?.name,
            value: provider?.masterCasinoProviderId,
          });
        });
        setProviderNameOptions(temp);
      }
    },
  });

  const { data: gameDashboardAggregator, isLoading: aggregatorLoading } = useQuery({
    queryKey: ['gameDashboardAggregator'],
    queryFn: () => {
      return getCasinoAggregators();
    },
    select: (res) => res?.data?.casinoAggregator,

    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {

      if (data?.rows && data?.rows?.length) {
        const temp = [];
        data?.rows?.map((aggregator) => {
          temp.push({
            label: aggregator?.name,
            value: aggregator?.masterGameAggregatorId,
          });
        });
        setAggregatoNameOptions(temp);
      }
    },
  });

  const handleDeleteYes = () => {
    deleteProviderRate({
      rateId: rateId,
    })
  }

  return {
    providerDetails,
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    sort,
    search,
    setSearch,
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
    navigate,
    status,
    setStatus,
    providerId,
    setProviderId,
    gameNameOptions,
    providerNameOptions,
    aggregatorNameOptions,
    providerInfo,
    providerInfoLoading,
    aggregatorId, 
    setAggregatorId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,


  }
}

export default useProviderRateMatrixListing
