import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from '../../../components/Toast'
import { getEmailTemplates } from '../../../utils/apiCalls'
import useCheckPermission from '../../../utils/checkPermission'
import { useDeleteEmailTemplete } from '../../../reactQuery/hooks/customMutationHook'

const useEmailTemplate = () => {
  const { t } = useTranslation(['emailTemplate'])
  const queryClient = useQueryClient()
  const [show, setShow] = useState(false)
  const [lang, setLang] = useState('EN')
  const [manualModalData, setManualModalData] = useState({})
  const [templateData, setTemplateData] = useState('')
  const languages = [{languageName: 'English', code: 'EN'}]
  const { isHidden } = useCheckPermission()
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [emailId, setEmailId] = useState('')

  const setModalData = (template) => {
    setManualModalData(template.data)
    setTemplateData(template.data.templateCode)
    setShow(true)
  }

  const {isLoading: loading, data } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: getEmailTemplates,
    onError: (error) => {
      if(error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
        errors.map((error) => {
          if(error?.description) toast(error?.description, 'error')
        })
      }
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  })

  const { mutate: deleteEmailTemplate } = useDeleteEmailTemplete({onSuccess: () => {
    toast(t('editTemplate.deleteSuccessToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['emailTemplates'] })
    setDeleteModalShow(false)
  }})

  const handleDeleteModal = (id) => {
    setEmailId(id)
    setDeleteModalShow(true)
  }

  const handleDeleteYes = () => {
    deleteEmailTemplate({emailTemplateId: emailId})
  }

  return {
    emailTemplates: data?.emailTemplate,
    loading,
    show,
    setShow,
    setModalData,
    manualModalData,
    templateData,
    t,
    isHidden,
    emailTemplateOrder: data?.emailTemplateOrder,
    lang,
    setLang,
    languages,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow
  }
}

export default useEmailTemplate
