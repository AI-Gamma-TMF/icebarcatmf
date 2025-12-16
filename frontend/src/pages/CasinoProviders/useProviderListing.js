import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCasinoProviders, getCasinoAggregators } from '../../utils/apiCalls'
import { errorHandler, useCreateCasinoProvidersMutation, useHideProvider, useUpdateCasinoProvidersMutation, useUpdateStatusMutation } from '../../reactQuery/hooks/customMutationHook'
import { toast } from '../../components/Toast'
import { useTranslation } from 'react-i18next'
import { serialize } from 'object-to-formdata'
import { useDebounce } from 'use-debounce'

const useProviderListing = () => {
  const { t } = useTranslation(['casino'])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [aggregatorsFilter, setAggregatorsFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderBy, setOrderBy] = useState('orderId')
  const [sort, setSort] = useState('asc')
  const [over, setOver] = useState(false)
  const [show, setShow] = useState(false)
  const [providerId, setProviderId] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)
  const [data, setData] = useState()
  const [type, setType] = useState('')
  const [hideModalShow, setHideModalShow] = useState(false)
  const [providerDeleteId, setProviderDeleteId] = useState('')
  const [freeSpinstatus, setFreeSpinStatus] = useState()
  const [freeSpinStatusShow,setFreeSpinStatusShow] = useState(false)

  const { data: casinoProvidersData,isLoading: loading } = useQuery({
    queryKey: ['providersList', limit, page, debouncedSearch, orderBy, sort, statusFilter, aggregatorsFilter],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.orderBy = queryKey[4]
      if (queryKey[5]) params.sort = queryKey[5]
      if (queryKey[6]) params.isActive = statusFilter
      if (queryKey[7]) params.masterGameAggregatorId = aggregatorsFilter
            return getAllCasinoProviders(params)
    },
    select: (res) => res?.data?.casinoProvider,
    refetchOnWindowFocus: false
  })

  const resetFilters = () => {
    setSearch('')
    setAggregatorsFilter('all')
    setStatusFilter('all')
};


  const { data: aggregatorsList ,isLoading} = useQuery({
    queryKey: ['AggregatorsList1'],
    queryFn: () =>  getCasinoAggregators(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    select: (res) => res?.data?.casinoAggregator,
  })
  const totalPages = Math.ceil(casinoProvidersData?.count / limit)

  const selected = (h) =>
  orderBy === h.value &&
  h.labelKey !== 'Thumbnail' &&
  h.labelKey !== 'Actions'

  const handleClose = () => setShow(false)
  const handleShow = (type, data) => {
    setType(type)
    setData(data)
    setShow(true)
  }

  const handleStatusShow = (id, status,freespinstatus) => {
    setProviderId(id)
    setStatus(!status)
    setStatusShow(true)
     setFreeSpinStatus(freespinstatus ? true : false)
  }

  const { mutate: updateStatus,isLoading:updateloading } = useUpdateStatusMutation({onSuccess: ({data}) => {
    if(data.success) {
      if(data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['providersList'] })
    setStatusShow(false)
      const updatedList = queryClient.getQueryData('providersList', limit, page, debouncedSearch, orderBy, sort, statusFilter, aggregatorsFilter);
     
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.casinoProvider?.rows) && updatedList?.data?.casinoProvider?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
    }
  }, onError: (error) => {
    errorHandler(error)
  }})

  const handleYes = () => {
    updateStatus({
      code: 'CASINO_PROVIDER',
      masterCasinoProviderId: providerId,
      status:status,
      freeSpinAllowed:freeSpinstatus
    })
  }

  const { mutate: hideProvider,isLoading:hideLoading } = useHideProvider({onSuccess: () => {
    toast(t('casinoProvider.hideProviderSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['providersList'] })
    setHideModalShow(false)
    const updatedList = queryClient.getQueryData('providersList', limit, page, debouncedSearch, orderBy, sort, statusFilter, aggregatorsFilter);
     
    // If current page is now empty and not the first page, go back one
    if (Array.isArray(updatedList?.data?.casinoProvider?.rows) && updatedList?.data?.casinoProvider?.rows.length === 1 && page > 1) {

      setPage((prev) => prev - 1);
    }
  }})

  const { mutate: updateCasinoProvider, isLoading: updateLoading } = useUpdateCasinoProvidersMutation({onSuccess: () => {
    toast(t('casinoProvider.editProviderSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['providersList'] })
    handleClose()
  }})

  const updateProvider = (data, { masterCasinoProviderId }) => {
    if(data?.thumbnail == null) delete data.thumbnail
    updateCasinoProvider(serialize({
      ...data,
      masterCasinoProviderId,
    }))
  }

  const { mutate: createCasinoProvider, isLoading: createLoading } = useCreateCasinoProvidersMutation({onSuccess: () => {
    toast(t('casinoProvider.createProviderSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['providersList'] })
    handleClose()
  }})
  const createProvider = (data) => {
    createCasinoProvider(serialize({
      ...data,
      masterGameAggregatorId: 1
    }))
  }

  const handleHideModal = (id) => {
    setProviderDeleteId(id)
    setHideModalShow(true)
  }

  const handleHideYes = () => {
    hideProvider({masterCasinoProviderId: providerDeleteId})
  }
   const { mutate: updateFreeSpinStatus,isLoading:updateFreeSpinloading } = useUpdateStatusMutation({onSuccess: ({data}) => {
      if(data.success) {
        if(data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['providersList'] })
        setFreeSpinStatusShow(false)
      }
    }, onError: (error) => {
      errorHandler(error)
    }})
      const handleFreeSpin = (id, status) => {
    setProviderId(id)
    setFreeSpinStatus(!status)
    setFreeSpinStatusShow(true)
   
  }
   const handleFreeSpinYes = () => {
      updateFreeSpinStatus({
        code: 'FREE_SPIN_PROVIDER',
        masterCasinoProviderId: providerId,
        status:freeSpinstatus
      })
    }

  return {
    search,
    setSearch,
    t,
    limit,
    setLimit,
    page,
    setPage,
    show,
    statusShow,
    setStatusShow,
    aggregatorsList,
    isLoading,
    createUpdateLoading: createLoading || updateLoading,
    data,
    type,
    casinoProvidersData,
    totalPages,
    handleClose,
    handleShow,
    handleStatusShow,
    handleYes,
    loading,
    createProvider,
    updateProvider,
    status,
    navigate,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    providerId,
    setProviderDeleteId,


    handleHideModal,
    hideModalShow,
    setHideModalShow,
    handleHideYes,
    hideLoading,
    setAggregatorsFilter,
    aggregatorsFilter,
    setStatusFilter,
    statusFilter,
    updateloading,
    resetFilters,setFreeSpinStatusShow,handleFreeSpinYes,freeSpinStatusShow,freeSpinstatus,updateFreeSpinloading,handleFreeSpin,
  }
}

export default useProviderListing
