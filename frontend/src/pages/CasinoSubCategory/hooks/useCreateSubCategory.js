import { useCreateCasinoSubCategoryMutation, useUpdateCasinoSubCategoryMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { serialize } from 'object-to-formdata'

const useCreateSubCategory = (handleClose) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['casino'])

  const { mutate: updateCasinoSubCategory, isLoading: updateLoading } = useUpdateCasinoSubCategoryMutation({onSuccess: () => {
    toast(t('casinoSubCategory.categoryUpdateSuccess'), 'success')
    queryClient.invalidateQueries({ queryKey: ['casinoSubCategories'] })
    handleClose()
  }})
  
  const updateCasinoMenu = (data) =>{
    updateCasinoSubCategory(serialize(data))
  }

  const { mutate: createCasinoSubCategory, isLoading: createLoading } = useCreateCasinoSubCategoryMutation({onSuccess: () => {
    toast(t('casinoSubCategory.categoryCreateSuccess'), 'success')
    queryClient.invalidateQueries({ queryKey: ['casinoSubCategories'] })
    handleClose()
  }})

  const createCasinoMenu = (data) =>{
    createCasinoSubCategory(serialize(data))
  }
  return {
    t,
    loading: createLoading || updateLoading,
    updateCasinoMenu,
    createCasinoMenu
  }
}

export default useCreateSubCategory
