import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { getAllCasinoCategories } from '../../../utils/apiCalls'
import { useTranslation } from 'react-i18next'
// import { useReorderCasinoCategoriesMutation } from '../../../reactQuery/hooks/customMutationHook'

const useReorderSubCategories = () => {
  const navigate = useNavigate()
  const [state, setState] = useState({ rows: [], count: 0 })
  // const queryClient = useQueryClient()
  const { t } = useTranslation(['casino'])

  // const { isLoading: fetchLoading } = useQuery({
  //   queryKey: ['casinoCategories'],
  //   onSuccess: (data) => setState(data),
  //   queryFn: () => {
  //     return getAllCasinoCategories()
  //   },
  //   select: (res) => res?.data?.casinoCategories,
  //   refetchOnWindowFocus: false,
  // })

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

  // const { mutate: reorderCategory, isLoading: updateLoading } = useReorderCasinoCategoriesMutation({onSuccess: () => {
  //   toast(t('casinoCategory.categoriesReorderSuccessToast'), 'success')
  //   queryClient.invalidateQueries({ queryKey: ['casinoCategories'] })
  //   navigate(AdminRoutes.CasinoCategories)
  // }})

  const handleSave = () => {
    const row = []
    state.rows.map((list) => row.push(list.masterGameCategoryId))
    // reorderCategory({order: row})
  }

  return {
    t,
    // loading: fetchLoading ,
    state,
    onDragEnd,
    handleSave,
    navigate
  }
}

export default useReorderSubCategories
