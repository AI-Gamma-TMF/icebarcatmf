import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

import { getRedeemRuleDetail } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteRedeemRulesMutation, useUpdatePromoCodeMutation } from '../../../reactQuery/hooks/customMutationHook'
import { getDateDaysAgo } from '../../../utils/dateFormatter'

const useRedeemRulesListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('casino');
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [promocodeId, setPromocodeId] = useState()
  const [deleteRuleId, setDeleteRuleId] = useState()
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
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const { data: promoCodeList, isLoading: loading, isFetching: customerLoading } = useQuery({ 
    queryKey: ['promoCodeList', limit, page, orderBy, 
    sort, debouncedSearch],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocode = queryKey[5]
      return getRedeemRuleDetail(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false
  })

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(promoCodeList?.redeemRules?.count / limit)

  const handleShow = (id, active) => {
    setPromocodeId(id)
    setActive(!active)
    setShow(true)
  }
  const handleDelete = (id)=>{
    setDeleteRuleId(id)
    setDeleteModalShow(true)
  }
  const { mutate: updateStatus } = useUpdatePromoCodeMutation({ 
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
      promocodeId: promocodeId,
      isActive: active
    })
  }
  const { mutate: deleteRedeemRule, isLoading: loadingDeleteRules  } = useDeleteRedeemRulesMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promoCodeList'] })
        setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const handleDeleteYes = () => {
    deleteRedeemRule({
      ruleId: deleteRuleId,
    })
  }
  const handleClose = () => setShowModal(false)

  return {
    t,
    limit,
    page,
    loading,
    customerLoading,
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
    loadingDeleteRules
  }
}

export default useRedeemRulesListing
