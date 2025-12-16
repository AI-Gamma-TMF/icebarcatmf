import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRaffle } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteTournament, useUpdateStatusRaffleMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { getDateDaysAgo } from '../../../utils/dateFormatter'
import { convertTimeZone, convertToUtc } from '../../../utils/helper'
import { useUserStore } from '../../../store/store'

const useRaffleListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('casino');
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('raffleId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [raffleId, setRaffleId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [tournamentId, setTournamentId] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchByTitle, setSearchByTitle] = useState('')
  const [status, setStatus] = useState('all')
  const [isActive, setIsActive] = useState('all')
  const [wgrBaseAmt, setWgrBaseAmt] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [debouncedSearch] = useDebounce(searchByTitle, 500)
  const [selectedCurrency, setSelectedCurrency] = useState('')
    const timeZoneCode = useUserStore((state) => state.timeZoneCode)
  
    const [startDate, setStartDate] = useState(convertTimeZone(getDateDaysAgo(10), timeZoneCode));
    const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));

    useEffect(() => {
      setStartDate(convertTimeZone(getDateDaysAgo(10), timeZoneCode))
      setEndDate(convertTimeZone(new Date(), timeZoneCode))
    }, [timeZoneCode])
  
  const { data: raffleList, isLoading: loading } = useQuery({
    queryKey: ['raffleList', limit, page, orderBy, 
    sort, debouncedSearch, status, isActive, wgrBaseAmt, convertToUtc(startDate), convertToUtc(endDate)],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if(queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if(queryKey[5]) params.search = queryKey[5]
      if(queryKey[6]) params.status = queryKey[6]
      if(queryKey[7]) params.isActive = queryKey[7]
      if(queryKey[8]) params.wagerBaseAmt = queryKey[8]
      if(queryKey[9]) params.startDate = queryKey[9]
      if(queryKey[10]) params.endDate = queryKey[10]


      return getRaffle(params)
    },
    select: (res) => res?.data?.raffleDetails,
    refetchOnWindowFocus: false
  })

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const totalPages = Math.ceil(raffleList?.count / limit)

  const handleShow = (id, active) => {
    setRaffleId(id)
    setActive(!active)
    setShow(true)
  }
  const { mutate: updateStatus } = useUpdateStatusRaffleMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['raffleList'] })
        const updatedList = queryClient.getQueryData([ 'raffleList', limit, page, orderBy, 
    sort, debouncedSearch, status, isActive, wgrBaseAmt, convertToUtc(startDate), convertToUtc(endDate)]);
     
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.raffleDetails?.rows) && updatedList?.data?.raffleDetails?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
      setShow(false)
      setDataLoading(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleYes = () => {
    setDataLoading(true)
    updateStatus({
      raffleId: raffleId,
      isActive: active
    })
  }

  const handleClose = () => setShowModal(false)

  const { mutate: deleteCategory } = useDeleteTournament({
    onSuccess: ({ data }) => {
      if (data?.success) {

        if (data?.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['raffleList'] })
      }
      setDeleteModalShow(false)
    }
  })

  const handleDeleteYes = () => {
    deleteCategory({ tournamentId })
  }

  const handleDeleteModal = (id) => {
    setTournamentId(id)
    setDeleteModalShow(true)
  }

  return {
    t,
    limit,
    page,
    loading,
    raffleList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    showModal,
    type,
    handleClose,
    selectedCategory,
    setSelectedCategory,
    active,
    navigate,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    statusFilter,
    setStatusFilter,
    selectedCurrency,
    setSelectedCurrency,
    setType,dataLoading,
    searchByTitle,
    setSearchByTitle,
    status,
    setStatus,
    isActive,
    setIsActive,
    wgrBaseAmt,
    setWgrBaseAmt,
    startDate,
    setStartDate,
    endDate,
    setEndDate
    }
}

export default useRaffleListing
