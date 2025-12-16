import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { getAllCasinoCategories } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, 
  // useDeleteCasinoCategory,
   useUpdateStatusMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'

const useCasinoCategoriesListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['casino'])
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('masterGameCategoryId')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [categoryId, setCategoryId] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  // const [masterGameCategoryId, setMasterGameCategoryId] = useState('')

  // const { data: casinoCategories, isLoading: loading } = useQuery({
  //   queryKey: ['casinoCategories', limit, page, orderBy, sort],
  //   queryFn: ({ queryKey }) => {
  //     const params = {pageNo: queryKey[2], limit: queryKey[1], orderBy: queryKey[3], sort: queryKey[4]};
  //     return getAllCasinoCategories(params)
  //   },
  //   select: (res) => res?.data?.casinoCategories,
  //   refetchOnWindowFocus: false
  // })

  const selected = (h) =>
  orderBy === h.value &&
  h.labelKey !== 'Actions'
  
  // const totalPages = Math.ceil(casinoCategories?.count / limit)

  const handleShow = (id, active) => {
    setCategoryId(id)
    setActive(!active)
    setShow(true)
  }

  const { mutate: updateStatus,isLoading:updateloading } = useUpdateStatusMutation({onSuccess: ({data}) => {
    if(data.success) {
      if(data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['casinoCategories'] })
    }
    setShow(false)
  }, onError: (error) => {
    errorHandler(error)
  }})

  const handleYes = () => {
    updateStatus({
      code: 'CASINO_CATEGORY',
      masterGameCategoryId: categoryId,
      status: active
    })
  }

  const handleClose = () => setShowModal(false)

  const handleShowModal = (type) => {
    setType(type)
    setShowModal(true)
  }

  // const { mutate: deleteCategory,isLoading:deleteLoading } = useDeleteCasinoCategory({onSuccess: ({data}) => {
  //   if(data.success) {
  //     if(data.message) toast(data.message, 'success')
  //     queryClient.invalidateQueries({ queryKey: ['casinoCategories'] })
  //   }
  //   setDeleteModalShow(false)
  // }})

  // const handleDeleteYes = () => {
  //   deleteCategory({ masterGameCategoryId })
  // }

  const handleDeleteModal = () => {
    // setMasterGameCategoryId(id)
    setDeleteModalShow(true)
  }

  return {
    t,
    limit,
    page,
    // loading,
    // casinoCategories,
    show,
    setLimit,
    setPage,
    setShow,
    // totalPages,
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
    // handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    // deleteLoading,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,updateloading
  }
}

export default useCasinoCategoriesListing
