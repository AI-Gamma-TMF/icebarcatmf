import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useCheckPermission from '../../../utils/checkPermission'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getEmailDynamicData, getEmailTemplateDetail } from '../../../utils/apiCalls'
import { emailDynamicOptions } from '../helper'
import { useUpdateEmailTemplateMutation } from '../../../reactQuery/hooks/customMutationHook'
import { AdminRoutes } from '../../../routes'
import { toast } from '../../../components/Toast'
import { useTranslation } from 'react-i18next'
import { emailTemplateRegEx } from '../../../utils/helper'

const useEditEmailTemplate = () => {
  const { t } = useTranslation(['emailTemplate'])
  const { emailTemplateId } = useParams()
  const queryClient = useQueryClient()
  const [requiredKeyData, setRequiredKeyData] = useState({})
  const [galleryModal, setGalleryModal] = useState(false)
  const { isHidden } = useCheckPermission()
  const [isTestTemplateModalVisible, setIsTestTemplateModalVisible] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const selectedTab = 'EN'
  const [dynamicKeys, setDynamicKeys] = useState([])

  const navigate = useNavigate()

  const { isInitialLoading: loading, data: emailTemplate } = useQuery({
    queryKey: ['emailTemplateDetail', emailTemplateId ],
    queryFn: () => getEmailTemplateDetail({emailTemplateId}),
    select: (res) => res?.data?.emailTemplate,
    refetchOnWindowFocus: false,
  })

  const { data: emailTypes } = useQuery({
    queryKey: ['emailTypes'],
    queryFn: getEmailDynamicData,
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  })

  const { mutate: editEmailTemplate } = useUpdateEmailTemplateMutation({onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['emailTemplates'] })
    queryClient.invalidateQueries({ queryKey: ['emailTemplateDetail', emailTemplateId] })
    toast(t('editTemplate.editSuccessToast'), 'success')
    navigate(AdminRoutes.EmailTemplates)
  }})

  const getTemplateKeys = (template) => {
    const mainKeys = []
    const keys = template.match(emailTemplateRegEx)
    if (keys) {
      keys.forEach((key) => {
        mainKeys.push(key.replaceAll('{', '').replaceAll('}', '').trim())
      })
      return [...new Set(mainKeys)]
    } else {
      return []
    }
  }

  const updateTemplate = ({ data }) => {
    const allKeys = dynamicKeys.map((item) => item.key)
    const requiredKeys = dynamicKeys
      .filter((item) => item.required === true)
      .map((item) => item.key)
    const templateKeys = getTemplateKeys(data.templateCode)
    if (templateKeys.length || requiredKeys.length) {
      if (allKeys.some((r) => templateKeys.includes(r))) {
        if (requiredKeys.every((v) => templateKeys.includes(v))) {
            editEmailTemplate({
                ...emailTemplate,
                ...data,
                dynamicData: templateKeys,
                emailTemplateId: Number(emailTemplateId)
              })
        } else {
          toast(t('editTemplate.useAllKeysErrorToast'), 'error')
        }
      } else {
        toast(t('editTemplate.invalidDynamicKeyErrorToast'), 'error')
      }
    } else {
        editEmailTemplate({
            ...emailTemplate,
            ...data,
            dynamicData: templateKeys,
            emailTemplateId: Number(emailTemplateId)
          })
    }
  }

  useEffect(() => {
    if (Object.keys(dynamicKeys).length) {
      let tempDataAll = {}
      let tempData = {}
      dynamicKeys.forEach((item) => {
        tempDataAll = { ...tempDataAll, [item.key]: item.description }
        if (item.required) {
          tempData = { ...tempData, [item.key]: item.description }
        }
      })
      setRequiredKeyData(tempData)
    }
  }, [dynamicKeys])

  useEffect(() => {
    if (emailTemplate && Object.keys(emailTemplate).length && emailTypes) {
      setDynamicKeys(emailDynamicOptions({ type: emailTemplate.type, emailTypes }))
    }
  }, [emailTemplate, emailTypes])

  return {
    emailTemplate,
    loading,
    updateTemplate,
    dynamicKeys,
    galleryModal,
    setGalleryModal,
    isHidden,
    isTestTemplateModalVisible,
    setIsTestTemplateModalVisible,
    testEmail,
    setTestEmail,
    selectedTab,
    requiredKeyData,
    setRequiredKeyData,
    t
  }
}

export default useEditEmailTemplate
