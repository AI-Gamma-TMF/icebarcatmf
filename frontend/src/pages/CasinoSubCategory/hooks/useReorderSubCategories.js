import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCasinoSubCategories } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { useReorderCasinoSubCategoriesMutation } from '../../../reactQuery/hooks/customMutationHook'
import { AdminRoutes } from '../../../routes'
import { useTranslation } from 'react-i18next'

const useReorderSubCategories = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['casino'])
  const [state, setState] = useState({ rows: [], count: 0 })
  const [categoryFilter, setCategoryFilter] = useState('')

  // const { data: casinoCategories, isLoading: categoriesLoading } = useQuery({
  //   queryKey: ['casinoCategories'],
  //   queryFn: () => getAllCasinoCategories(), 
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   retry: false,
  //   staleTime: 'Infinity',
  //   select: (res) => res?.data?.casinoCategories
  // })

  const { subCategory, isLoading: subCategoriesLoading } = useQuery({
    queryKey: ['casinoSubCategories', categoryFilter],
    queryFn: () => {
      const params = {};
      // if(queryKey[1]) params.masterGameCategoryId = queryKey[1];
      params.orderBy = 'orderId';
      params.sort = 'asc';
      return getAllCasinoSubCategories(params)
    },
    onSuccess: (data) => {
      setState(data)
    },
    select: (res) => res?.data?.subCategory,
    refetchOnWindowFocus: false,
  })

  const reorder = (subCategories, startIndex, endIndex) => {
    const result = Array.from(subCategories)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const rows = reorder(
      state.rows,
      result.source.index,
      result.destination.index
    )
    setState({ rows, count: rows.length })
  }

  const { mutate: reorderSubCategory, isLoading: updateLoading } = useReorderCasinoSubCategoriesMutation({onSuccess: () => {
    toast(t('casinoSubCategory.categoryReorderSuccess'), 'success')
    queryClient.invalidateQueries({ queryKey: ['casinoSubCategories'] })
    navigate(AdminRoutes.CasinoSubCategories)
  }})

  const handleSave = () => {
    const row = []
    state.rows.map((list) => row.push(list.masterGameSubCategoryId))
    reorderSubCategory({order: row })
  }

  return {
    t,
    loading:  subCategoriesLoading,
    saveLoading: updateLoading,
    state,
    onDragEnd,
    handleSave,
    navigate,
    // casinoCategories,
    categoryFilter,
    setCategoryFilter,
    subCategory
  }
}

export default useReorderSubCategories
