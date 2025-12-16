import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPromotionBonus } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeletePromotionMutation, useUpdateStatusPromotionMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { getDateDaysAgo } from '../../../utils/dateFormatter'
import { convertToUtc } from '../../../utils/helper'
import { useUserStore } from '../../../store/store'

const usePromotionListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('casino');
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [promocodeId, setPromocodeId] = useState()
  const [deletePromocodeId, setDeletePromocodeId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [affilId, setAffilId] = useState('')
  const [bonusSC, setBonusSC] = useState('')
  const [bonusGC, setBonusGC] = useState('')
  const [debouncedAffilId] = useDebounce(affilId, 500)
  const [debouncedSCAmount] = useDebounce(bonusSC, 500)
  const [debouncedGCAmount] = useDebounce(bonusGC, 500)
  const [validDate, setValidDate] = useState(null);
  const [AffilError, setAffilError] = useState('')
  const [bonusScError, setBonusScError] = useState('')
  const [bonusGcError, setBonusGcError] = useState('')
  const timeZoneCode = useUserStore((state) => state.timeZoneCode);

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [selectedCurrency, setSelectedCurrency] = useState('')
 
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const { data: promotionList, isLoading: loading } = useQuery({
    queryKey: ['promotionList', limit, page, orderBy, 
    sort, debouncedSearch, debouncedAffilId, debouncedSCAmount, debouncedGCAmount, statusFilter, convertToUtc(validDate), timeZoneCode],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocode = queryKey[5]
      if (queryKey[6]) params.affiliateId = queryKey[6]
      if (queryKey[7]) params.bonusSc = queryKey[7]
      if (queryKey[8]) params.bonusGc = queryKey[8]
      if (queryKey[9]) params.isActive = queryKey[9]
      if (queryKey[10]) params.validTill = queryKey[10]
      if(queryKey[10] && queryKey[11])  params.timezone = queryKey[11]

      return getPromotionBonus(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false
  })

  const resetFilters = ()=>{
    setSearch('')
    setAffilId('')
    setBonusSC('')
    setBonusGC('')
    setStatusFilter('all')
    setValidDate(null)
    setAffilError('')
    setBonusScError('')
    setBonusGcError('')
  }

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const totalPages = Math.ceil(promotionList?.count / limit)

  const handleShow = (id, active) => {
    setPromocodeId(id)
    setActive(!active)
    setShow(true)
  }
  const handleDelete = (id)=>{
    setDeletePromocodeId(id)
    setDeleteModalShow(true)
  }
  const { mutate: updateStatus,isLoading:updateloading } = useUpdateStatusPromotionMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promotionList'] })
        const updatedList = queryClient.getQueryData(['promotionList', limit, page, orderBy, 
    sort, debouncedSearch, debouncedAffilId, debouncedSCAmount, debouncedGCAmount, statusFilter, convertToUtc(validDate), timeZoneCode]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.promoCodes) && updatedList?.data?.promoCodes.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      setShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleYes = () => {
    updateStatus({
      promocodeId: promocodeId,
      isActive: active
    })
  }
  const { mutate: deletePromotion ,isLoading:deleteLoading} = useDeletePromotionMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promotionList'] })
        const updatedList = queryClient.getQueryData(['promotionList', limit, page, orderBy, 
          sort, debouncedSearch, debouncedAffilId, debouncedSCAmount, debouncedGCAmount, statusFilter, convertToUtc(validDate), timeZoneCode]);
              // If current page is now empty and not the first page, go back one
              if (Array.isArray(updatedList?.data?.promoCodes) && updatedList?.data?.promoCodes.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
              }
        setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const handleDeleteYes = () => {
    deletePromotion({
      promocodeId: deletePromocodeId,
    })
  }
  const handleClose = () => setShowModal(false)

  return {
    t,
    limit,
    page,
    loading,
    promotionList,
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
    setState,
    setType,
    handleDelete,
    deleteLoading,
    updateloading,
    affilId,
    setAffilId,
    bonusSC,
    setBonusSC,
    bonusGC,
    setBonusGC,
    validDate,
    setValidDate,
    resetFilters,
    AffilError,
    setAffilError,
    bonusScError,
    setBonusScError,
    bonusGcError,
    setBonusGcError
  }
}

export default usePromotionListing
