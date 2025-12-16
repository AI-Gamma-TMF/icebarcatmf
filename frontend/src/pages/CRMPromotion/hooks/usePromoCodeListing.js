import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCrmPromoBonus } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteCRMPromotionMutation, useUpdateStatusCRMPromotionMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { getDateDaysAgo } from '../../../utils/dateFormatter'

const useCrmPromoCodeListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('casino');
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('promocode')
  const [isActive, setIsActive] = useState('all')
  const [sortBy, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [promocodeId, setPromocodeId] = useState()
  // const [deletePromocode, setDeletePromocode] = useState()
  // const [crmPromotionId, setCrmPromotionId] = useState()
  const [promocode,setPromocode]=useState('')
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [promoName, setpromoName] = useState('')
  const [debouncedPromoName] = useDebounce(promoName, 500)
  const [selectedType, setSelectedType] = useState('')
  const [scAmount, setScAmount] = useState(''); 
  const [gcAmount, setGcAmount] = useState(''); 
  const [debouncedSCAmount] = useDebounce(scAmount, 500)
  const [debouncedGCAmount] = useDebounce(gcAmount, 500)
  
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  // promocode, orderBy, sortBy, isActive, pageNo, limit
  const { data: promoCodeList, isLoading: loading } = useQuery({ 
    queryKey: ['promoCodeList', limit, page, orderBy, sortBy, debouncedSearch, selectedType],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sortBy = queryKey[4]
      if (queryKey[5]) params.promocodeSearch = queryKey[5]
      if (queryKey[6]) params.promotionType =queryKey[6]

      return getCrmPromoBonus(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false
  })



  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const totalPages = Math.ceil(promoCodeList?.details?.count / limit)

  const handleShow = (crmPromotionId, active) => {
    setPromocodeId(crmPromotionId)
    setActive(!active)
    setShow(true)
  }
  const handleDelete = (promocode)=>{
    setPromocode(promocode)
    setDeleteModalShow(true)
  }
  const { mutate: updateStatus } = useUpdateStatusCRMPromotionMutation({ 
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promoCodeList'] })
      setShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleYes = () => {
    updateStatus({
      crmPromotionId: promocodeId,
      isActive: active
    })
  }
  const { mutate: deletePromoCode } = useDeleteCRMPromotionMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promoCodeList'] })
        const updatedList = queryClient.getQueryData([ 'promoCodeList', limit, page, orderBy, sortBy, debouncedSearch, selectedType]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.details?.rows) && updatedList?.data?.details?.rows.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
        setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const handleDeleteYes = () => {
    deletePromoCode({
      promocode:promocode
    })
  }
  const handleClose = () => setShowModal(false)

  return {
    t,
    limit,
    page,
    loading,
    promoCodeList,
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
    sort:sortBy,
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
    selectedType,
    setSelectedType,
    promoName,
    setpromoName,
    isActive,
    setIsActive,
    scAmount,
    setScAmount,
    gcAmount,
    setGcAmount
  }
}

export default useCrmPromoCodeListing
