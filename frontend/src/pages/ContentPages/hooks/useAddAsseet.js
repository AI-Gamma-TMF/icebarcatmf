import { useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../components/Toast'
import { useTranslation } from 'react-i18next'
import { errorHandler, useAddAssetMutation, useUpdateAssetMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useParams } from 'react-router-dom'
import { serialize } from 'object-to-formdata'
import { useState } from 'react'

const useAddAsset = (handleClose) => {
  const { t } = useTranslation(['contentPages'])
  const { pageId } = useParams()
  const queryClient = useQueryClient()
  const [editorState, setEditorState] = useState(null)

  const onPopupClose = () => {
    setEditorState(null)
    handleClose()
  }
  const { mutate: updatePageAsset, isLoading: updateLoading } = useUpdateAssetMutation({onSuccess: () => {
    toast(t('editPageAssetSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPageDetail', pageId] })
    onPopupClose()
  }, onError: (error) => {
    onPopupClose()
    errorHandler(error)
  }})

  const updateAsset = (data) => {
    updatePageAsset(serialize(data))
  }

  const { mutate: createPageAsset, isLoading: createLoading } = useAddAssetMutation({onSuccess: () => {
    toast(t('createPageAssetSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPageDetail', pageId] })
    onPopupClose()
  }, onError: (error) => {
    onPopupClose()
    errorHandler(error)
  }})

  const createAsset = (data) => {
    createPageAsset(serialize(data))
  }

  return {
    loading: updateLoading || createLoading,
    createAsset,
    updateAsset,
    editorState,
    setEditorState,
    onPopupClose
  }
}

export default useAddAsset
