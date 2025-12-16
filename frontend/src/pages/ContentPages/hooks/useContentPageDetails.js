import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getContentPageDetails } from '../../../utils/apiCalls'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteAsset } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'

const useContentPageDetails = () => {
  const [selectedTab, setSelectedTab] = useState('textAssets')// 'seoDetails')
  const { t } = useTranslation(['contentPages'])
  const { pageId } = useParams()
  const navigate = useNavigate()
  const [type, setType] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  
  const { isInitialLoading: loading, data: contentPageData } = useQuery({ 
    queryKey: ['contentPageDetail', pageId ],
    queryFn: () => getContentPageDetails({pageId: pageId}),
    select: (res) => res?.data?.pageDetails,
    refetchOnWindowFocus: false,
  })

  const { mutate: deleteAsset } = useDeleteAsset({onSuccess: () => {
    toast(t('deletePageAssetSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['contentPageDetail', pageId] })
    setDeleteModalShow(false)
  }})
    
  const handleShowModal = (modalType, assetType) => {
    setType(modalType)
    setSelectedAssetType(assetType)
    setShowModal(true)
  }
  const handleClose = () => {
    setSelectedAsset('')
    setShowModal(false)
  }

  const handleDeleteModal = () => {
    setDeleteModalShow(true)
  }

  const handleDeleteYes = () => {
    deleteAsset({pageId: pageId, assetKey: selectedAsset.assetKey})
  }

  return {
    t,
    contentPageData,
    loading,
    navigate,
    selectedTab,
    setSelectedTab,
    handleClose,
    handleShowModal,
    selectedAsset,
    setSelectedAsset,
    showModal,
    setShowModal,
    type,
    selectedAssetType,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    handleDeleteModal
  }
}

export default useContentPageDetails
