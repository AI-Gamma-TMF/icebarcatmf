import { useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../components/Toast'
import { useTranslation } from 'react-i18next'
import { errorHandler, useCreateContentPageMutation, useUpdateContentPageMutation } from '../../../reactQuery/hooks/customMutationHook'

const useCreateContentPage = (handleClose) => {
  const { t } = useTranslation(['contentPages'])
  const queryClient = useQueryClient()
  const { mutate: updatePage, isLoading: updateLoading } = useUpdateContentPageMutation({onSuccess: () => {
    toast(t('editPageSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPagesList'] })
    handleClose()
  }, onError: (error) => {
    handleClose()
    errorHandler(error)
  }})

  const updateContentPage = (data) => {
    updatePage(data)
  }

  const { mutate: createPage, isLoading: createLoading } = useCreateContentPageMutation({onSuccess: () => {
    toast(t('createPageSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPagesList'] })
    handleClose()
  }, onError: (error) => {
    handleClose()
    errorHandler(error)
  }})

  const createContentPage = (data) => {
    createPage(data)
  }

  return {
    loading: updateLoading || createLoading,
    updateContentPage,
    createContentPage
  }
}

export default useCreateContentPage
