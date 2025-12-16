import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {  getCasinoAggregators } from '../../../utils/apiCalls'
import { errorHandler, useHideAggregatorMutation, useUpdateAggregatorsStatusMutation, useUpdateStatusMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
import { useDebounce } from 'use-debounce';

const useAggregatorListing = () => {
  const { t } = useTranslation(['casino'])
  const [limit, setLimit] = useState(15)
  const [orderBy, setOrderBy] = useState('masterGameAggregatorId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [page, setPage] = useState(1)
  const [id, setId] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)
  const [freeSpinstatus, setFreeSpinStatus] = useState()
  const [freeSpinStatusShow,setFreeSpinStatusShow] = useState(false)
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [aggregatorStatus, setAggregatorStatus] = useState('all');
 
  const [name, setName] = useState()
  const queryClient = useQueryClient()
  const [hideModalShow, setHideModalShow] = useState(false)


  const { data: aggregators,refetch ,isLoading: loading} = useQuery({
    queryKey: ['AggregatorsList', limit, page, orderBy, sort, debouncedSearch, aggregatorStatus],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1], orderBy: queryKey[3], sort: queryKey[4]};  
      if (queryKey[5]) params.search = queryKey[5];
      if(queryKey[6]) params.isActive = queryKey[6]

      return getCasinoAggregators(params)
    },
    select: (res) => res?.data?.casinoAggregator,
    refetchOnWindowFocus: false
  })

  const selected = (h) =>
  orderBy === h.value &&
  h.labelKey !== 'Actions'

  const totalPages = Math.ceil(aggregators?.count / limit)

  const handleStatusShow = (id, status, myName,freeSpinAllowed) => {
    setId(id)
    setStatus(!status)
    setStatusShow(true)
    setName(myName)
    setFreeSpinStatus(freeSpinAllowed?true:false)
  }

  const handleHide = (id)=>{
    setId(id)
    setHideModalShow(true)
  }
   const { mutate: updateFreeSpinStatus,isLoading:updateFreeSpinloading } = useUpdateStatusMutation({onSuccess: ({data}) => {
      if(data.success) {
        if(data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['aggregatorList'] })
        setFreeSpinStatusShow(false)
         refetch()
      }
    }, onError: (error) => {
      errorHandler(error)
    }})
      const handleFreeSpin = (id, status) => {
    setId(id)
    setFreeSpinStatus(!status)
    setFreeSpinStatusShow(true)
   
  }
   const handleFreeSpinYes = () => {
      updateFreeSpinStatus({
        code: 'FREE_SPIN_AGGREGATOR',
        masterGameAggregatorId: id,
        status:freeSpinstatus
      })
    }
  
  const { mutate: updateStatus,isLoading:updateloading } = useUpdateAggregatorsStatusMutation({onSuccess: ({data}) => {
    refetch()
    
    if(data.message){
      toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['aggregatorList'] })
      const updatedList = queryClient.getQueryData(['AggregatorsList', limit, page, orderBy, sort, debouncedSearch, aggregatorStatus]);
     
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.casinoAggregator?.rows) && updatedList?.data?.casinoAggregator?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
    }
    setStatusShow(false)
      
    
  }, onError: (error) => {
    errorHandler(error)
  }})

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleYes = () => {

    updateStatus({
      aggregatorId: id,
      isActive:status,
      freeSpinAllowed:freeSpinstatus
    })
    setTimeout(() => {
      setStatusShow(false)
    }, 500)
  }

  const { mutate: hideAggregator,isLoading:hideLoading } = useHideAggregatorMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['AggregatorsList'] })
        const updatedList = queryClient.getQueryData(['AggregatorsList', limit, page, orderBy, sort, debouncedSearch, aggregatorStatus]);
     
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.casinoAggregator?.rows) && updatedList?.data?.casinoAggregator?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
        setHideModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleHideYes = () => {
    hideAggregator({
      masterGameAggregatorId: id,
    })
  }

  return {
    t,
    aggregators,
    limit,
    setLimit,
    page,
    setPage,
    totalPages,
    handleStatusShow,
    handleYes,
    statusShow,
    setStatusShow,
    show,
    handleClose,
    handleShow,
    loading,
    status,
    name,    
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    updateloading,
    search,
    setSearch,
    aggregatorStatus,
    setAggregatorStatus,
    hideModalShow,
    setHideModalShow,
    handleHideYes,
    hideLoading, handleHide,setFreeSpinStatusShow,handleFreeSpinYes,freeSpinStatusShow,freeSpinstatus,updateFreeSpinloading,handleFreeSpin,
  }
}

export default useAggregatorListing
