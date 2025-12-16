import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {  getAllTierList } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteTournament, useUpdateStatusTierMutation, useUpdateTournamentCronMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { formatDateYMD, getDateDaysAgo } from '../../../utils/dateFormatter'

const useTierListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['tier'])
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('tierId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [categoryId, setCategoryId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  // const [tournamentId, setTournamentId] = useState('')
  const [statusFilter, setStatusFilter] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [tierSearch, setTierSearch] = useState('all');
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const { data: tierList, isLoading: loading } = useQuery({
    queryKey: ['rewardList', limit, page,debouncedSearch, orderBy, sort, statusFilter,selectedCurrency, formatDateYMD(state.map(a => a.startDate)), formatDateYMD(state.map(a => a.endDate)), tierSearch],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.orderBy = queryKey[4]
      if (queryKey[5]) params.sort = queryKey[5]
      if (queryKey[6]) params.isActive = statusFilter
      if (queryKey[8]) params.startDate = queryKey[8]
      if (queryKey[9]) params.endDate = queryKey[9]
      if (queryKey[10]) params.level = queryKey[10]
      return getAllTierList(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    retry: false
  })

  const resetFilters = () => {
    setTierSearch('all')
    setSearch('')
    setStatusFilter(true)
  }

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(tierList?.tiers?.count / limit)

  const handleShow = (id, active) => {
    setCategoryId(id)
    setActive(!active)
    setShow(true)
  }
  //const { mutate:updateTournamentCron} = useUpdateTournamentCronMutation()


  const { mutate: updateStatus,isLoading:updateloading } = useUpdateStatusTierMutation({
    onSuccess: ({ data }) => {
      // if (data.success) {
        //updateTournamentCron({tierId:categoryId})
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['rewardList'] })
      // }
      setShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleYes = () => {
    updateStatus({
      tierId: categoryId,
      isActive: active
    })
  }

  const handleClose = () => setShowModal(false)

  const handleShowModal = (type) => {
    setType(type)
    setShowModal(true)
  }

  const { mutate: _deleteCategory } = useDeleteTournament({
    onSuccess: ({ data }) => {
      if (data?.success) {

        if (data?.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['rewardList'] })
      }
      setDeleteModalShow(false)
    }
  })

  const handleDeleteYes = () => {
   // deleteCategory({ tierId })
  }

  const handleDeleteModal = () => {
    // setTournamentId(id)
    setDeleteModalShow(true)
  }

  return {
    t,
    limit,
    page,
    loading,
    tierList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    handleShowModal,
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
    search,
    setSearch,
    selectedCurrency,
    setSelectedCurrency,
    state,
    setState,updateloading,
    tierSearch,
    setTierSearch,
    resetFilters
  }
}

export default useTierListing
