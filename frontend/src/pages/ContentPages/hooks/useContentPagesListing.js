import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { toast } from '../../../components/Toast'
import { useDeleteContentPage } from '../../../reactQuery/hooks/customMutationHook'
import { getContentPages } from '../../../utils/apiCalls'

const useCmsListing = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(['contentPages'])
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [showModal, setShowModal] = useState(false)
  const [active, setActive] = useState('all')
  const [statusShow, setStatusShow] = useState(false)
  const [orderBy, setOrderBy] = useState('pageId')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const queryClient = useQueryClient()
  const [selectedPage, setSelectedPage] = useState(null)
  const [type, setType] = useState('')

  const { isLoading: loading, data: pageContentData } = useQuery({
    queryKey: ['contentPagesList', limit, page, debouncedSearch, orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.orderBy = orderBy
      if (queryKey[5]) params.sort = sort
      return getContentPages(params)
    },
    select: (res) => res?.data?.pages,
    refetchOnWindowFocus: false
  })
  const totalPages = Math.ceil(pageContentData?.count / limit)

  const { mutate: deletePage } = useDeleteContentPage({onSuccess: () => {
    toast(t('deletePageSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPagesList'] })
    setDeleteModalShow(false)
  }})

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'
  
  const handleDeleteModal = () => {
    setDeleteModalShow(true)
  }
  
  const handleShowModal = (modalType) => {
    setType(modalType)
    setShowModal(true)
  }
  const handleClose = () => setShowModal(false)

  const handleDeleteYes = () => {
    deletePage({pageId: selectedPage.pageId})
  }

  return {
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    pageContentData,
    totalPages,
    loading,
    statusShow,
    setStatusShow,
    active,
    setActive,
    handleShowModal,
    handleClose,
    t,
    over,
    setOver,
    selected,
    setOrderBy,
    sort,
    setSort,
    handleDeleteModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    type,
    selectedPage,
    setSelectedPage,
    showModal,
    setShowModal
  }
}

export default useCmsListing
